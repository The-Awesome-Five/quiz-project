import React from 'react';

export const Question = ({ question }) => {

    return (
        <div>
            <h1>{question.question}</h1>
            <ul>
                {question.answers.map((answer, index) => {
                    return (
                        <li key={index}>{String.fromCharCode(65 + index)}) {answer}</li>
                    )
                })}
            </ul>
        </div>
    )

}
