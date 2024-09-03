import React, {useState} from "react";
import {Container} from "react-bootstrap";
import {GenerateQuestionsAIForm} from "./GenerateQuestionsAIForm/GenerateQuestionsAIForm.jsx";
import {AIQuestionsList} from "./AIQuestionsList/AIQuestionsList.jsx";

export const QuestionsAIForm = ({
    category,
    questions,
    setQuestions
                                        }) => {


   const [ promptData, setPromptData ] = useState({
       category: '',
       number: 0
   });

    return (
        <Container>

            {!questions && <GenerateQuestionsAIForm /> }

            {questions && <AIQuestionsList questions={questions} />}

        </Container>
    )
}
