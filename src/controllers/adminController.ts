import prismadb from "../lib/prismadb";
import { Request, Response } from "express";
import { BadRequestError, InternalServerError, SuccessMessage } from "../constants/responses";

export const getModeratorRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get all users who registered as moderators but aren't approved yet
        const moderatorRequests = await prismadb.user.findMany({
            where: {
                role: 'MODERATOR',
                approvedAsMod: false
            },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true
            }
        });

        if (moderatorRequests.length === 0) {
            BadRequestError(res, null, "No moderator requests found", "Please try again later");
            return;
        }

        const data = {
            moderatorRequests: moderatorRequests
        }
        SuccessMessage(res, "Moderator requests fetched successfully", data);

    } catch (error) {
        InternalServerError(res, error);
    }
}


export const handleModeratorRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, approved } = req.body;

        if (!userId) {
            BadRequestError(res, null, "User ID is required", "Invalid request");
            return;
        }

        // Check if user exists and is a pending moderator
        const user = await prismadb.user.findFirst({
            where: {
                id: userId,
                role: 'MODERATOR',
                approvedAsMod: false
            }
        });

        if (!user) {
            BadRequestError(res, null, "User not found or not a pending moderator", "Invalid request");
            return;
        }

        if (approved) {
            // Approve moderator request
            await prismadb.user.update({
                where: {
                    id: userId
                },
                data: {
                    approvedAsMod: true
                }
            });

            SuccessMessage(res, "Moderator request approved successfully", { userId });
        } else {
            // Reject moderator request and change role to USER
            await prismadb.user.update({
                where: {
                    id: userId
                },
                data: {
                    role: 'USER',
                    approvedAsMod: false
                }
            });

            SuccessMessage(res, "Moderator request rejected successfully", { userId });
        }

    } catch (error) {
        InternalServerError(res, error);
    }
}


