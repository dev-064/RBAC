import prismadb from "../lib/prismadb";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { BadRequestError, InternalServerError, SuccessMessage, UnauthorizedError } from "../constants/responses";
import { UserSchema } from "../types/user";
import jwt from 'jsonwebtoken';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = UserSchema.safeParse(req.body);

        if (!result.success) {
            BadRequestError(res, result, "Invalid request data", "Please check your input and try again");
            return;
        }

        const { email, password, name, role } = result.data;

        // Check if user already exists
        const existingUser = await prismadb.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingUser) {
            BadRequestError(res, null, "User already exists", "User already exists");
            return;
        }

        // Don't allow direct registration of admin accounts
        if (role === "ADMIN") {
            BadRequestError(res, null, "Cannot register admin accounts", "Invalid registration request");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await prismadb.user.create({
            data: {
                email,
                username: name,
                password: hashedPassword,
                role: role || "USER", // Default to USER if no role specified
                approvedAsMod: false
            }
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        const data = {
            user: userWithoutPassword,
            token
        }

        SuccessMessage(res, "User registered successfully", data);

    } catch (error) {
        InternalServerError(res, error);
    }
};


const loginUserSchema = UserSchema.partial({
    name: true,
    role: true,
    status: true
}).required({
    email: true,
    password: true
})

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate input
        const result = loginUserSchema.safeParse({ email, password });
        if (!result.success) {
            BadRequestError(res, result, "Invalid input", "Validation failed");
            return;
        }

        // Find user by email
        const user = await prismadb.user.findUnique({
            where: { email }
        });

        if (!user) {
            BadRequestError(res, null, "User not found", "The email you entered is incorrect")
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            UnauthorizedError(res, "UnauthorizedError", "Your login session expired, please login again")
            return;
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        const data = {
            user: userWithoutPassword,
            token
        }

        SuccessMessage(res, "Login successful", data);

    } catch (error) {
        InternalServerError(res, error);
    }
};
