import { Hono } from 'hono';
import { userRouter } from './routes/user';
import { authRouter } from './routes/auth';
import { cors } from 'hono/cors'

const app = new Hono<{
	Bindings:{
		DATABASE_URL: string;
		JWT_SECRET: string
	}
}>();

app.use('/api/*', cors());
app.route("/api/v1/auth", authRouter);
app.route("/api/v1/user", userRouter);

export { app as default };