import axios from "axios";
import {API_KEY} from "../config/apiKeys.js";

const openai = axios.create({
    baseURL: 'https://api.openai.com/v1/chat',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});

export const getOpenAIResponse = async (prompt) => {

    const responseFormat = {
       answers:
       ["string", "string", "string", "string"],
        correctAnswerIndex: "number",
        question: "string"

    }

    const response = await openai.post('/completions', {
        model: 'gpt-4o-mini',
        messages: [
            {
                role: "system",
                content: "You create unique questions. I need 4 answers, one of them correct. JSON format"
            },
            {
                role: "user",
                content: prompt
            }
        ],
        max_tokens: 200,
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "quiz_question",
                schema: {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        answers: {
                            type: "object",
                            properties: {
                                "0": { type: "string" },
                                "1": { type: "string" },
                                "2": { type: "string" },
                                "3": { type: "string" }
                            },
                            required: ["0", "1", "2", "3"],
                            additionalProperties: false
                        },
                        correctAnswerIndex: { type: "integer" }
                    },
                    required: ["question", "answers", "correctAnswerIndex"],
                    additionalProperties: false
                },
                strict: true
            }
        }
    });

    return response.data;
};