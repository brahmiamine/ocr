import OpenAI from "openai";
import fs from "fs";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "", // Remplacez par votre clé API
});

// Fonction pour lire un PDF et envoyer son contenu à OpenAI
export const readPDFAndSendToChatGPT = async (filePath: string): Promise<string> => {
    try {
        // Vérifiez si le fichier existe
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        // Étape 1 : Lire le contenu du PDF
        console.log("Reading PDF content...");
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);

        // Vérifiez si le contenu du PDF est vide
        if (!pdfData.text.trim()) {
            throw new Error("The PDF file is empty or contains non-extractable content.");
        }

        console.log("PDF content extracted successfully.");

        const promptTemplate = fs.readFileSync("prompt.txt", "utf-8");
        const prompt = `${promptTemplate}${pdfData.text}`;
        
        
        // Étape 3 : Envoyer la prompt à ChatGPT
        console.log("Sending content to ChatGPT...");
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-4", // Utilisez le modèle souhaité
            messages: [
                { role: "system", content: "You are a JSON formatting assistant." },
                { role: "user", content: prompt },
            ],
        });

        // Retourner la réponse de ChatGPT
        const analysis = chatResponse.choices[0]?.message?.content || "No content available.";
        return analysis;
    } catch (error: any) {
        console.error("Error processing file:", error.message || error);
        throw error;
    }
};
