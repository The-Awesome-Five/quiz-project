import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addParticipant, updateQuiz } from "../../../services/quiz.service";
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
    const [addUser, setAddUser]= useState('')
    const navigate= useNavigate();

    
    useEffect(() => {
        if (quizData) {
            setQuiz(quizData);
            console.log(quizData)
        }
    }, [quizData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            [name]: value,
        }));
    };

    const handleAddChange = (e) => {
        setAddUser(e.target.value); 
    };
    const handleAddParticipant = async () => {
        if (addUser) {
            const isUserAlreadyInvited =
                quiz.inviteList?.pending?.[addUser] ||
                quiz.inviteList?.accepted?.[addUser] ||
                quiz.inviteList?.rejected?.[addUser];
        if (isUserAlreadyInvited) {
                toast.error('User has already been invited.');
                return;
            }
            try {
                await addParticipant(quizData.id, addUser)
                setQuiz((prevQuiz) => ({
                    ...prevQuiz,
                    inviteList: {
                        ...prevQuiz.inviteList,
                        pending: {
                            ...prevQuiz.inviteList?.pending,
                            [addUser]: addUser,
                        },
                    },
                })); 
                setAddUser('');
                toast.success('User invited');
            } catch (error) {
                console.error("Error adding participant:", error);
                toast.error('Failed to invite user');
            }
        }
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
            navigate(`/organization/${organizationID.orgID}`);
            
        } catch (error) {
            console.error("Error updating quiz:", error);
            toast.error("Failed to update quiz.");
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
                        {question.answers && <><label>Correct Answer</label>
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
                        /></>}
                        <label>Answers</label>
                        {question.answers && question.answers.map((answer, answerIndex) => (
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
                {quiz.isInvites ?
                 <div className="p-4 rounded-3 shadow bg-light scrollable-container">
                    {quiz.inviteList?.accepted ? Object.entries(quiz.inviteList.accepted).map(([id, name]) => (
                  <div key={id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <Link to={`/profile/${id}`} className="mb-0">{name}</Link>
                      <h5 className="mb-0 text-muted">accepted</h5> 
                  </div>)):<></>}
                  {quiz.inviteList?.rejected ? Object.entries(quiz.inviteList.rejected).map(([id, name]) => (
                  <div key={id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <Link to={`/profile/${id}`} className="mb-0">{name}</Link>
                      <h5 className="mb-0 text-muted">rejected</h5> 
                  </div>)):<></>}
                  {quiz.inviteList?.pending ? Object.entries(quiz.inviteList.pending).map(([id, name]) => (
                  <div key={id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <Link to={`/profile/${id}`} className="mb-0">{name}</Link>
                      <h5 className="mb-0 text-muted">pending</h5> 
                  </div>)):<></>}
                  <div className="input-group mb-2">
            <input
                type="text"
                className="form-control"
                placeholder="Please enter a username"
                value={addUser}
                onChange={handleAddChange}
            />
            <div className="input-group-append">
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleAddParticipant}
                >
                    Add Participant
                </button>
            </div>
        </div>
                 </div>
                
                :<></>}
            </div>

            <button type="submit" className="btn btn-primary">
                Update Quiz
            </button>
        </form>
    );
};

export default EditQuizForm;