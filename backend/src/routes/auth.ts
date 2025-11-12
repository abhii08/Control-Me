import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { signupInput, signinInput } from '../schemas/validation';

// Helper function to create Prisma client  
function createPrismaClient(databaseUrl: string) {
	// Ensure we're using the Cloudflare Workers binding, not env vars
	const prisma = new PrismaClient({
		datasourceUrl: databaseUrl,
	}).$extends(withAccelerate());
	return prisma;
}

export const authRouter = new Hono<{
	Bindings:{
		DATABASE_URL: string;
		JWT_SECRET: string
	}
}>();

authRouter.post('/signup', async(c) => {
	const body = await c.req.json();
    const validation = signupInput.safeParse(body);
    if(!validation.success){
        c.status(400);
        return c.json({
            message: "Validation failed",
            errors: validation.error.format()
        })
    }
	const prisma = createPrismaClient(c.env.DATABASE_URL);

	const { email, password, name } = validation.data;

	try{
		const user = await prisma.user.create({
			data:{
				email,
				password,
				name
			}
		})
		const jwt = await sign({
			id: user.id
		}, c.env.JWT_SECRET);

		return c.text(jwt);
	} catch(e: any){
		console.log(e)
		if(e.code === 'P2002'){
			c.status(409);
			return c.json({
				message: "User with this email already exists"
			});
		}
		c.status(500);
		return c.json({
			message: "Internal server error"
		});
	} 
})

authRouter.post('/signin', async(c) => {

	const body = await c.req.json();
	const validation = signinInput.safeParse(body);
    if(!validation.success){
        c.status(400);
        return c.json({
            message: "Validation failed",
            errors: validation.error.format()
        })
    }
	const prisma = createPrismaClient(c.env.DATABASE_URL);

	const { email, password } = validation.data;

	try{
		const user = await prisma.user.findFirst({
			where:{
				email,
				password
			}
		})
		if(!user){
			c.status(403);
			return c.json({
				message:"incorrect credentials"
			})
		}
		const jwt = await sign({
			id: user.id
		}, c.env.JWT_SECRET);
		
		return c.text(jwt);
	} catch(e){
		console.log(e)
		c.status(411);
		return c.text("Invalid")
	} 
})

authRouter.post('/logout', async(c) => {
	const authHeader = c.req.header("Authorization");
	
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		c.status(401);
		return c.json({
			message: "Unauthorized"
		});
	}

	const token = authHeader.split(" ")[1];

	try{
		const payload = await verify(token, c.env.JWT_SECRET);
		
		if(!payload){
			c.status(403);
			return c.json({
				message: "Invalid token"
			});
		}

		return c.json({
			message: "Logged out successfully"
		});
	} catch(e){
		console.log(e)
		c.status(411);
		return c.text("Invalid")
	}
})