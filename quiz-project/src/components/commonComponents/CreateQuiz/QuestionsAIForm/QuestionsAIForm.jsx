import React, {useState} from "react";
import {Button, Container, Form} from "react-bootstrap";

import {getOpenAIResponse} from "../../../../services/chatgpt.service.js";
import {toast} from "react-toastify";

export const QuestionsAIForm = ({
                                    category, setQuestions,difficulty
                                }) => {

    const [ numberOfQuestions, setNumberOfQuestions ] = useState(0);

    const generateAIQuestions = async () => {

        if (numberOfQuestions > 5) {
            return toast.error("Number of questions should be less than 5");
        }

        const response = await getOpenAIResponse(`Generate ${numberOfQuestions} questions related to ${category} that have ${difficulty} difficulty`);
        const data = await JSON.parse(response.choices[0].message.content);

        setQuestions(prevQuestions => {
            return [...prevQuestions, ...Object.values(data)[0]]
        });

    }


    return (<Container>

        <Form>
            <Form.Label>Generate Questions from AI</Form.Label>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Enter the number of questions</Form.Label>
                <Form.Control
                    placeholder="Enter number of questions"
                    type="text"
                    value={numberOfQuestions}
                    onChange={(e) =>
                        setNumberOfQuestions(+e.target.value)}
                />

                <Button onClick={generateAIQuestions}>Submit</Button>
            </Form.Group>
        </Form>

    </Container>)
}
