const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config(); // For local environment variable support

const app = express();
app.use(cors()); // Allow requests from anywhere (we can restrict later if needed)
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
                    { role: "user", content: prompt }
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
