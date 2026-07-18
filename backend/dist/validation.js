import { z } from "zod";
export const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
export const signinSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});
export const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    avatar: z.string().optional(),
});
export const toggleLikeSchema = z.object({
    productId: z.string().min(1, "productId is required"),
});
