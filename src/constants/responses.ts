import { Response } from "express"

export const InternalServerError = (res: Response, error: any) => {
    return res.status(500).json({
        error: error?.message,
        devMessage: "Internal Server Error",
        userMessage: "Something went wrong on our end, Please try again later"
    })
}

export const BadRequestError = (res: Response, error: any, devMessage: string, userMessage: string) => {
    return res.status(400).json({
        error: error?.error?.errors,
        devMessage: devMessage,
        userMessage: userMessage
    });
}

export const SuccessMessage = (res: Response, message: string, data: any) => {
    return res.status(201).json({ userMessage: message, data: data, devMessage: message });
}

export const UnauthorizedError = (res: Response, devMessage: string, userMessage: string) => {
    return res.status(401).json({ devMessage: devMessage, userMessage: userMessage });
}