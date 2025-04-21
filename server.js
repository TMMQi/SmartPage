const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config(); // For local environment variable support

const app = express();
app.use(cors()); // Allow requests from anywhere (can restrict later)
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Your key stored securely

app.post('/ask', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).send({ error: 'Prompt is required' });

    try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-4-0125-preview",
                messages: [
                    {
                        role: "system",
                        content: "As an AI assistant, only provide answers or complete tasks that are directly related to the content on the page. Keep responses concise but also informative. If the question or task is not relevant to the page’s content, do not answer or complete it, and avoid using general knowledge to respond. When giving answers, ensure they are easy to understand for users with learning difficulties like dyslexia. This means using clear language and a simple structure. Additionally, provide a keyword or key phrase from the page that the user can search for (using Control+F or Command+F) to find the exact section of the page where the information is located. If you are unable to answer the question or complete the task, you do not have to give a keyword or phrase. You can generate tables if asked or if you think it will help with presentation, try to give as much useful information as possible without overwhelming the reader."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        const data = await openaiResponse.json();
        res.json(data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
