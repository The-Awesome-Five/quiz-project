/* eslint-disable react/prop-types */
import React from "react";
import { QuestionsAIForm } from "../QuestionsAIForm/QuestionsAIForm.jsx";

export const CreateQuestionForm = ({
    questions,
    setQuestions,
    removeQuestion,
    handleQuestionChange,
    handleAnswerChange,
    handleCorrectAnswerChange,
    handleAddToPublicBankChange,
    handleAddToBankChange,
    quiz,
    addMultipleChoiceQuestion,
    addOpenQuestion,
    handlePointsChange,
}) => {
    if (!questions) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">Create Questions</h4>
                    {questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="mb-4 p-3 border rounded question-box">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <label className="form-label">
                                    <strong>Question {questionIndex + 1}</strong>
                                </label>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeQuestion(questionIndex)}
                                >
                                    Remove Question
                                </button>
                            </div>

                            <input
                                type="text"
                                className="form-control mb-3"
                                placeholder="Enter your question"
                                value={question.question}
                                onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                            />

                            <div className="row">
                                {question.answers &&
                                    question.answers.map((answer, answerIndex) => (
                                        <div className="col-md-6 mb-3" key={answerIndex}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={`Answer ${answerIndex + 1}`}
                                                value={answer}
                                                onChange={(e) =>
                                                    handleAnswerChange(
                                                        questionIndex,
                                                        answerIndex,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <div className="form-check mt-2">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name={`correctAnswer${questionIndex}`}
                                                    checked={
                                                        question.correctAnswerIndex === answerIndex
                                                    }
                                                    onChange={() =>
                                                        handleCorrectAnswerChange(
                                                            questionIndex,
                                                            answerIndex
                                                        )
                                                    }
                                                />
                                                <label className="form-check-label">
                                                    Mark as Correct Answer
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            <label className="form-label">Points For Question</label>
                            <input
                                type="number"
                                className="form-control mb-3"
                                placeholder="Enter Points For This Question"
                                value={question.points}
                                onChange={(e) => handlePointsChange(questionIndex, e.target.value)}
                            />

                            {question.isMultiple && (
                                <div className="form-check mt-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`addToPublicBank${questionIndex}`}
                                        checked={question.addToPublicBank || false}
                                        onChange={(e) =>
                                            handleAddToPublicBankChange(
                                                questionIndex,
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={`addToPublicBank${questionIndex}`}
                                    >
                                        Add this question to the public bank
                                    </label>
                                </div>
                            )}

                            {quiz.organisationId && question.isMultiple && (
                                <div className="form-check mt-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`addToPrivateBank${questionIndex}`}
                                        checked={question.addPrivate || false}
                                        onChange={(e) =>
                                            handleAddToBankChange(questionIndex, e.target.checked)
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={`addToPrivateBank${questionIndex}`}
                                    >
                                        Add this question to the private question bank
                                    </label>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Generate AI Questions Form */}
                    <QuestionsAIForm
                        questions={questions}
                        setQuestions={setQuestions}
                        category={quiz.category}
                        difficulty={quiz.difficulty}
                    />

                    <div className="mt-4">
                        <button
                            className="btn btn-primary me-2"
                            onClick={addMultipleChoiceQuestion}
                        >
                            Add Multiple Choice Question
                        </button>
                       {quiz.organisationId && <button className="btn btn-primary me-2  " onClick={addOpenQuestion}>
                            Add Open Ended Question
                        </button>}
                    </div>
                </div>
            </div>
        </div>
    );
};