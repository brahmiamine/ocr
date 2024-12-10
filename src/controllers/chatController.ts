import { Request, Response, NextFunction } from "express";
import { readPDFAndSendToChatGPT } from "../services/chatService";

export const uploadPDFAndAnalyze = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Ensure a file is uploaded
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        const filePath = req.file.path;

        // Analyze the PDF and get the response from ChatGPT
        const rawAnalysis = await readPDFAndSendToChatGPT(filePath);

        let parsedAnalysis;

        try {
            // Nettoyage de la réponse pour retirer les délimiteurs de code (```json ... ```)
            const cleanedAnalysis = rawAnalysis.replace(/^```json|```$/g, '').trim();

            // Parser la réponse nettoyée
            parsedAnalysis = JSON.parse(cleanedAnalysis);
        } catch (error) {
            console.warn("Analysis is not valid JSON, returning as-is.");
            parsedAnalysis = rawAnalysis.replace(/^```json|```$/g, '').trim();
        }

        res.status(200).json({ message: "PDF analyzed successfully", analysis: parsedAnalysis });
    } catch (error) {
        next(error); // Forward errors to the error-handling middleware
    }
};

