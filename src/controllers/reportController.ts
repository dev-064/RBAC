import prismadb from "../lib/prismadb";
import { Request, Response } from "express";
import { BadRequestError, InternalServerError, SuccessMessage, UnauthorizedError } from "../constants/responses";
import { CreateReportSchema } from "../types/report";
import { CustomRequest } from "../types/requestType";

export const getAllReports = async (req: Request, res: Response): Promise<void> => {
    try {
        const reports = await prismadb.report.findMany({
            select: {
                id: true,
                title: true,
                comments: {
                    select: {
                        id: true,
                        content: true,
                        user: {
                            select: {
                                id: true,
                                username: true
                            }
                        }
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        if (reports.length === 0) {
            BadRequestError(res, null, "No reports found", "Please try again later");
            return;
        }

        const data = {
            reports: reports
        }
        SuccessMessage(res, "Reports fetched successfully", data);

    } catch (error) {
        InternalServerError(res, error);
    }
}


export const createReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const validationResult = CreateReportSchema.safeParse(req.body);
        if (!validationResult.success) {
            BadRequestError(res, validationResult.error.errors, "Invalid input data", "Please check your input and try again");
            return;
        }

        const userId = ((req as CustomRequest).token as any).id;

        // Check if report with same title exists
        const existingReport = await prismadb.report.findFirst({
            where: {
                title: validationResult.data.title
            }
        });

        if (existingReport) {
            BadRequestError(res, null, "Report with this title already exists", "Please use a different title");
            return;
        }

        const report = await prismadb.report.create({
            data: {
                ...validationResult.data,
                createdById: userId
            }
        });

        SuccessMessage(res, "Report created successfully", { report });
    } catch (error) {
        InternalServerError(res, error);
    }
}

export const updateReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const validationResult = CreateReportSchema.safeParse(req.body);
        if (!validationResult.success) {
            BadRequestError(res, validationResult.error.errors, "Invalid input data", "Please check your input and try again");
            return;
        }

        const userId = ((req as CustomRequest).token as any).id;
        const reportId = req.params.id;

        // Check if report exists
        const existingReport = await prismadb.report.findUnique({
            where: {
                id: reportId
            }
        });

        if (!existingReport) {
            BadRequestError(res, null, "Report not found", "The report you're trying to update doesn't exist");
            return;
        }

        // Check if user is the creator of the report
        if (existingReport.createdById !== userId) {
            UnauthorizedError(res, "UnauthorizedError", "You can only update your own reports");
            return;
        }

        // Check if new title conflicts with other reports (excluding current report)
        const titleConflict = await prismadb.report.findFirst({
            where: {
                title: validationResult.data.title,
                id: {
                    not: reportId
                }
            }
        });

        if (titleConflict) {
            BadRequestError(res, null, "Report with this title already exists", "Please use a different title");
            return;
        }

        const updatedReport = await prismadb.report.update({
            where: {
                id: reportId
            },
            data: validationResult.data
        });

        SuccessMessage(res, "Report updated successfully", { report: updatedReport });
    } catch (error) {
        InternalServerError(res, error);
    }
}


export const deleteReport = async (req: Request, res: Response) => {
    try {
        const userId = ((req as CustomRequest).token as any).id;
        const reportId = req.params.id;

        // Check if report exists
        const existingReport = await prismadb.report.findUnique({
            where: {
                id: reportId
            }
        });

        if (!existingReport) {
            BadRequestError(res, null, "Report not found", "The report you're trying to delete doesn't exist");
            return;
        }

        // Check if user is the creator of the report
        if (existingReport.createdById !== userId) {
            UnauthorizedError(res, "UnauthorizedError", "You can only delete your own reports");
            return;
        }

        await prismadb.report.delete({
            where: {
                id: reportId
            }
        });

        SuccessMessage(res, "Report deleted successfully", null);
    } catch (error) {
        InternalServerError(res, error);
    }
}

export const addComment = async (req: Request, res: Response) => {
    try {
        const userId = ((req as CustomRequest).token as any).id;
        const reportId = req.params.id;
        const { content } = req.body;

        // Check if report exists
        const existingReport = await prismadb.report.findUnique({
            where: {
                id: reportId
            }
        });

        if (!existingReport) {
            BadRequestError(res, null, "Report not found", "The report you're trying to comment on doesn't exist");
            return;
        }

        // Create comment
        const comment = await prismadb.comment.create({
            data: {
                content,
                reportId,
                userId
            }
        });

        SuccessMessage(res, "Comment added successfully", { comment });
    } catch (error) {
        InternalServerError(res, error);
    }
}

export const deleteComment = async (req: Request, res: Response) => {
    try {
        const userId = ((req as CustomRequest).token as any).id;
        const commentId = req.params.commentId;

        // Check if comment exists and belongs to user
        const existingComment = await prismadb.comment.findUnique({
            where: {
                id: commentId
            }
        });

        if (!existingComment) {
            BadRequestError(res, null, "Comment not found", "The comment you're trying to delete doesn't exist");
            return;
        }

        if (existingComment.userId !== userId) {
            UnauthorizedError(res, "UnauthorizedError", "You can only delete your own comments");
            return;
        }

        await prismadb.comment.delete({
            where: {
                id: commentId
            }
        });

        SuccessMessage(res, "Comment deleted successfully", null);
    } catch (error) {
        InternalServerError(res, error);
    }
}

