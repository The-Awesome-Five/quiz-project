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

    const response = await openai.post('/completions', {
        model: 'gpt-4o-mini',
        messages: [
            {
                role: "system",
                content: `You create unique questions, do not provide me previous questions. For each question I need 4 answers, one of them correct. JSON format`
            },
            {
                role: "user",
                content: prompt
            }
        ],
        max_tokens: 1000,
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "quiz_questions",
                schema: {
                    type: "object",
                    properties: {
                        questions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    question: { type: "string" },
                                    answers: {
                                        type: "array",
                                        items: {
                                            type: "string"
                                        },
                                    },
                                    correctAnswerIndex: { type: "integer" }
                                },
                                required: ["question", "answers", "correctAnswerIndex"],
                                additionalProperties: false
                            }
                        }
                    },
                    required: ["questions"],
                    additionalProperties: false
                },
                strict: true
            }
        }

    });

    return response.data;
};
