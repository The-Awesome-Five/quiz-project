import axios from "axios";
import {API_KEY} from "../config/apiKeys.js";

const openai = axios.create({
    baseURL: 'https://api.openai.com/v1/chat',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
    },
});

export const getOpenAIResponse = async (prompt, number) => {

    if (number > 5) {
        return new Error("Number of questions should be less than 5");
    }

    const response = await openai.post('/completions', {
        model: 'gpt-4o-mini',
        messages: [
            {
                role: "system",
                content: `You create ${number} unique questions. For each question I need 4 answers, one of them correct. JSON format`
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