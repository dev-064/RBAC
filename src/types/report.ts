import { z } from "zod";


export const CreateReportSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
});


export const CommentSchema = z.object({
    id: z.number(),
    content: z.string(),
    reportId: z.number(),
    createdAt: z.date()
});

export const ReportSchema = z.object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
    createdAt: z.date(),
    comments: CommentSchema.optional()
});

export type Report = z.infer<typeof ReportSchema>;

export type CreateReport = z.infer<typeof CreateReportSchema>;
