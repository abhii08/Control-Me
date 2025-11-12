import { z } from 'zod';

// Authentication validation schemas
export const signupInput = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	name: z.string().optional()
});

export const signinInput = z.object({
	email: z.string().email(),
	password: z.string().min(1)
});

// Profile validation schemas
export const updateProfileInput = z.object({
	name: z.string().min(1).optional(),
	phone: z.string().min(1).optional()
});
