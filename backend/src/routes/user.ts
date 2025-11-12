import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { updateProfileInput } from '../schemas/validation';

// Helper function to create Prisma client  
function createPrismaClient(databaseUrl: string) {
	// Ensure we're using the Cloudflare Workers binding, not env vars
	const prisma = new PrismaClient({
		datasourceUrl: databaseUrl,
	}).$extends(withAccelerate());
	return prisma;
}

export const userRouter = new Hono<{
	Bindings:{
		DATABASE_URL: string;
		JWT_SECRET: string
	}
}>();

// GET user profile
userRouter.get('/profile', async(c) => {
	const authHeader = c.req.header("Authorization");
	
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		c.status(401);
		return c.json({
			message: "Unauthorized"
		});
	}

	const token = authHeader.split(" ")[1];

	try{
		const payload = await verify(token, c.env.JWT_SECRET) as any;
		
		if(!payload || !payload.id){
			c.status(403);
			return c.json({
				message: "Invalid token"
			});
		}

		const prisma = createPrismaClient(c.env.DATABASE_URL);

		const user = await prisma.user.findUnique({
			where: {
				id: payload.id
			},
			select: {
				id: true,
				email: true,
				name: true,
				phone: true,
				createdAt: true,
				updatedAt: true
			}
		});

		if(!user){
			c.status(404);
			return c.json({
				message: "User not found"
			});
		}

		return c.json({
			user: user
		});
	} catch(e){
		console.log(e)
		c.status(411);
		return c.json({
			message: "Invalid token"
		});
	}
})

// UPDATE user profile
userRouter.put('/profile', async(c) => {
	const authHeader = c.req.header("Authorization");
	
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		c.status(401);
		return c.json({
			message: "Unauthorized"
		});
	}

	const token = authHeader.split(" ")[1];

	try{
		const payload = await verify(token, c.env.JWT_SECRET) as any;
		
		if(!payload || !payload.id){
			c.status(403);
			return c.json({
				message: "Invalid token"
			});
		}

		const body = await c.req.json();
		const validation = updateProfileInput.safeParse(body);
		
		if(!validation.success){
			c.status(400);
			return c.json({
				message: "Validation failed",
				errors: validation.error.format()
			});
		}

		const prisma = createPrismaClient(c.env.DATABASE_URL);

		// Only allow updating name and phone
		const updateData: any = {};
		if(validation.data.name !== undefined) updateData.name = validation.data.name;
		if(validation.data.phone !== undefined) updateData.phone = validation.data.phone;

		const user = await prisma.user.update({
			where: {
				id: payload.id
			},
			data: updateData,
			select: {
				id: true,
				email: true,
				name: true,
				phone: true,
				createdAt: true,
				updatedAt: true
			}
		});

		return c.json({
			message: "Profile updated successfully",
			user: user
		});
	} catch(e){
		console.log(e)
		c.status(411);
		return c.json({
			message: "Failed to update profile"
		});
	}
})