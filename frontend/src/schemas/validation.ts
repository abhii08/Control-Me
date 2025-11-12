import { z } from 'zod';

// Authentication validation schemas (matching backend)
export const signupInput = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters long"),
	name: z.string().min(1, "Name is required").optional()
});

export const signinInput = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required")
});

// Profile validation schemas
export const updateProfileInput = z.object({
	name: z.string().min(1, "Name cannot be empty").optional(),
	phone: z.string().min(1, "Phone cannot be empty").optional()
});

// Export types
export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type UpdateProfileInput = z.infer<typeof updateProfileInput>;
