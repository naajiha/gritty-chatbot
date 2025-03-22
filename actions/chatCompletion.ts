export const chatCompletion = async (messages: any[]) => {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages,
                temperature: 0.7,
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error("Error from API:", data.error.message);
            return { error: data.error.message };
        }

        return { response: data.choices[0].message.content };
        
    } catch (error) {
        console.error("API call failed:", error);
        return { error: "API call failed. Check your connection or quota." };
    }
};


import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "API key not found. Make sure your .env.local file is properly configured." });
    }

    const { messages } = req.body;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages,
                temperature: 0.7,
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error("Error from OpenAI API:", data.error.message);
            return res.status(500).json({ error: data.error.message });
        }

        return res.status(200).json({ response: data.choices[0].message.content });
        
    } catch (error) {
        console.error("API call failed:", error);
        return res.status(500).json({ error: "API call failed. Check your connection or quota." });
    }
}


