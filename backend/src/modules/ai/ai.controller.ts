import { Request, Response } from 'express';

export const askAI = async (req: Request, res: Response) => {
    try {
        const { question } = req.body;

        // Placeholder response
        const answer = `This is a placeholder AI response for: "${question}". Integration with OpenAI/Perplexity coming soon!`;

        res.json({ answer });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
