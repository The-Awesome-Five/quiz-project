import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateQuiz } from "../../../services/quiz.service";
import { toast } from "react-toastify";

const EditQuizForm = () => {
    const { state } = useLocation();
    const { quizData } = state || {};
    const [quiz, setQuiz] = useState({
        name: "",
        description: "",
        avatar: "",
        questions: [],
        ruleSet: {},
        isPublic: false,
    });
    const navigate= useNavigate();

    useEffect(() => {
        if (quizData) {
            setQuiz(quizData);
        }
    }, [quizData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            [name]: value,
        }));
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...quiz.questions];
        if (field === "correctAnswerIndex") {
            updatedQuestions[index][field] = parseInt(value, 10) - 1;
        } else if (field.startsWith("answers.")) {
            const answerIndex = parseInt(field.split(".")[1], 10);
            updatedQuestions[index].answers[answerIndex] = value;
        } else {
            updatedQuestions[index][field] = value;
        }

        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            questions: updatedQuestions,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { id, organizationID } = quiz;
            await updateQuiz(id, quiz);
            toast.success("Quiz updated successfully!");
            navigate(`/organization/${organizationID}`);
            
        } catch (error) {
            console.error("Error updating quiz:", error);
            alert("Failed to update quiz.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="edit-quiz-form">
            <div className="form-group">
                <label htmlFor="name">Quiz Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={quiz.name}
                    onChange={handleInputChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={quiz.description}
                    onChange={handleInputChange}
                ></textarea>
            </div>

            <div className="form-group">
                <label htmlFor="avatar">Avatar URL</label>
                <input
                    type="text"
                    className="form-control"
                    id="avatar"
                    name="avatar"
                    value={quiz.avatar}
                    onChange={handleInputChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="isPublic">Public Quiz</label>
                <select
                    id="isPublic"
                    name="isPublic"
                    className="form-control"
                    value={quiz.isPublic}
                    onChange={(e) =>
                        setQuiz((prevQuiz) => ({
                            ...prevQuiz,
                            isPublic: e.target.value === "true",
                        }))
                    }
                >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>

            <div className="form-group">
                <label>Questions</label>
                {quiz.questions.map((question, index) => (
                    <div key={index} className="mb-3">
                        <label>Question {index + 1}</label>
                        <input
                            type="text"
                            className="form-control"
                            value={question.question}
                            onChange={(e) =>
                                handleQuestionChange(
                                    index,
                                    "question",
                                    e.target.value
                                )
                            }
                        />
                        <label>Correct Answer</label>
                        <input
                            type="number"
                            className="form-control"
                            value={question.correctAnswerIndex + 1}
                            onChange={(e) =>
                                handleQuestionChange(
                                    index,
                                    "correctAnswerIndex",
                                    e.target.value
                                )
                            }
                        />
                        <label>Answers</label>
                        {question.answers.map((answer, answerIndex) => (
                            <input
                                key={answerIndex}
                                type="text"
                                className="form-control mb-2"
                                value={answer}
                                onChange={(e) =>
                                    handleQuestionChange(
                                        index,
                                        `answers.${answerIndex}`,
                                        e.target.value
                                    )
                                }
                            />
                        ))}
                    </div>
                ))}
            </div>

            <button type="submit" className="btn btn-primary">
                Update Quiz
            </button>
        </form>
    );
};

export default EditQuizForm;