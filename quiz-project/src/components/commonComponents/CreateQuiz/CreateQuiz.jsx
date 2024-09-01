import React, {useContext, useState, useEffect} from "react";
import "./CreateQuiz.css";
import {createQuizInFirebase} from "../../../services/quiz.service";
import {AppContext} from "../../../appState/app.context.js";
import {toast} from "react-toastify";
import {
    getQuestionsByOrgIds,
    getAllQuestionFromSearch,
    addQuestionToQuestionBank
} from "../../../services/quizBank.service.js";
import {getUserOrganizations} from "../../../services/organization.service.js";
import {CreateQuestionForm} from "./CreateQuestionForm/CreateQuestionForm.jsx";
import {CreateQuizForm} from "./CreateQuizForm/CreateQuizForm.jsx";

const CreateQuiz = () => {
    const [quiz, setQuiz] = useState({});

    const handleChange = (e, type) => {
        let updatedValue = {};
        let {name, value} = e.target ? e.target : e;
        let quizName = "";
        let quizValue = "";
        switch (type) {
            case 'tags':
                quizName = 'tags';

                let tagsArr = quiz.tags !== undefined ? quiz.tags : [];
                tagsArr.push(e);

                quizValue = tagsArr;
                break;
            case 'removeTags':
                quizName = 'tags';

                quizValue = e;
                break;
            case 'gameRules':
                quizName = 'gameRules';

                const {name, value, type, checked} = e.target;
                let gameRulesObj = quiz.gameRules !== undefined ? quiz.gameRules : {};
                gameRulesObj[name] = type === "checkbox" ? checked : value;

                quizValue = gameRulesObj
                break;
            case 'timeOptions':
                quizName = 'timeOptions';

                let checkbox = e.target;
                let timeOptionsObj = quiz.timeOptions !== undefined ? quiz.timeOptions : {};
                timeOptionsObj[checkbox.name] = checkbox.checked;

                quizValue = timeOptionsObj;
                break;
            case 'isPrivate':
                quizName = 'isPrivate';

                let isPrivateVal = quiz.isPrivate !== undefined ? quiz.isPrivate : false;
                isPrivateVal = e;

                quizValue = isPrivateVal;
                break;
        }

        name = quizName ? quizName : name;
        value = quizValue ? quizValue : value;

        updatedValue = {
            [name]: value
        };
        setQuiz(quiz => ({
            ...quiz,
            ...updatedValue
        }));
    }

    const {userData} = useContext(AppContext);
    const [questions, setQuestions] = useState([{questionText: "", answers: ["", "", "", ""], correctAnswerIndex: 0}]);
    const [publicQuestions, setPublicQuestions] = useState([]);

    useEffect(() => {
        const fetchPublicQuestions = async () => {
            try {
                console.log(userData);
                const orgIds = userData.organizations ? Object.keys(userData.organizations) : [];
                console.log(orgIds);
                const fetchedQuestions = await getQuestionsByOrgIds(orgIds);
                setPublicQuestions(fetchedQuestions);
            } catch (error) {
                console.error("Error fetching public questions:", error);
            }
        };
        fetchPublicQuestions();
    }, [userData]);

    const addTag = () => {
        if (quiz.tagInput.trim() !== "") {
            handleChange(quiz.tagInput.trim(), 'tags');
        }
    };

    const removeTag = (indexToRemove) => {
        handleChange(quiz.tags.filter((_, index) => index !== indexToRemove), 'removeTags');
    };

    const handleGameRulesChange = (e) => {
        handleChange(e, 'gameRules')
    };

    const handleTimeOptionsChange = (e) => {
        handleChange(e, 'timeOptions')
    };

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].questionText = value;
        setQuestions(updatedQuestions);
    };

    const handleAnswerChange = (questionIndex, answerIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers[answerIndex] = value;
        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, {questionText: "", answers: ["", "", "", ""], correctAnswerIndex: 0}]);
    };

    const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].correctAnswerIndex = answerIndex;
        setQuestions(updatedQuestions);
    };

    const removeQuestion = (questionIndex) => {
        setQuestions(questions.filter((_, index) => index !== questionIndex));
    };

    const handleCreateQuiz = async () => {
        try {

            Object.entries(quiz).map(([key, val]) => {
                if (!val) {
                    return toast.error(`Please add a ${key} for your quiz!`);
                }
            });

            if (questions.length == 0) {
                return toast.error('Please add at least a single question to your quiz!');
            } else {
                for (let question of questions) {
                    if (!question.questionText) {
                        return toast.error('Please add a name to your question!');
                    }
                    if (!question.answers.some(Boolean)) {
                        return toast.error('Please add at least a single answer to your question!');
                    }
                }
            }

            let quizData;
            if (quiz.organisationId) {
                const x = quiz.organisationId.split('////');
                quizData = {

                    createdOn: new Date(),
                    name: quiz.quizTitle,
                    avatar: quiz.pictureUrl,
                    description: quiz.description,
                    numberOfQuestions: questions.length,
                    difficultyLevel: quiz.difficulty,
                    category: quiz.category,
                    tags: quiz.tags ? quiz.tags?.reduce((acc, tag) => ({...acc, [tag]: tag}), {}) : [],
                    ruleSet: {
                        timeLimitPerQuiz: quiz.timeOptions?.isTimeLimitPerQuizActive ? quiz.gameRules?.timeLimitPerQuiz : null,
                        timeLimitPerQuestion: quiz.timeOptions?.isTimeLimitPerQuestionActive ? quiz.gameRules?.timeLimitPerQuestion : null,
                        openDuration: quiz.timeOptions?.isOpenDurationActive ? quiz.gameRules?.openDuration : null,
                        showCorrectAnswers: quiz.gameRules?.showCorrectAnswers ? quiz.gameRules?.showCorrectAnswers : null,
                    },
                    questions: questions.map((q) => ({
                        question: q.questionText,
                        answers: q.answers,
                        correctAnswerIndex: q.correctAnswerIndex,
                    })),
                    isPublic: quiz.isPrivate,
                    creator: {
                        userId: userData.uid,
                        name: userData.username,
                    },
                    organizationID: {
                        orgID: x[0],
                        orgName: x[1],
                    }
                };
            } else {
                quizData = {

                    createdOn: new Date(),
                    name: quiz.quizTitle,
                    avatar: quiz.pictureUrl,
                    description: quiz.description,
                    numberOfQuestions: questions.length,
                    difficultyLevel: quiz.difficulty,
                    category: quiz.category,
                    tags: quiz.tags ? quiz.tags?.reduce((acc, tag) => ({...acc, [tag]: tag}), {}) : [],
                    ruleSet: {
                        timeLimitPerQuiz: quiz.timeOptions?.isTimeLimitPerQuizActive ? quiz.gameRules?.timeLimitPerQuiz : null,
                        timeLimitPerQuestion: quiz.timeOptions?.isTimeLimitPerQuestionActive ? quiz.gameRules?.timeLimitPerQuestion : null,
                        openDuration: quiz.timeOptions?.isOpenDurationActive ? quiz.gameRules?.openDuration : null,
                        showCorrectAnswers: quiz.gameRules?.showCorrectAnswers ? quiz.gameRules?.showCorrectAnswers : null,
                    },
                    questions: questions.map((q) => ({
                        question: q.questionText,
                        answers: q.answers,
                        correctAnswerIndex: q.correctAnswerIndex,
                    })),
                    isPublic: true,
                    creator: {
                        userId: userData.uid,
                        name: userData.username,
                    },
                }
            }
            console.log(quizData)
            await createQuizInFirebase(quizData);

            const promises = questions.map(async (question) => {


                if (question.addToPublicBank) {
                    const questionData = {
                        question: question.questionText,
                        category: quiz.category,
                        difficultyLevel: quiz.difficulty,
                        orgID: 'public',
                        answers: question.answers.reduce((acc, answer, index) => ({
                            ...acc,
                            [`${answer}`]: index === question.correctAnswerIndex,
                        }), {}),
                        tags: quiz.tags ? quiz.tags.reduce((acc, tag) => ({...acc, [tag]: tag}), {}) : [],
                    };
                    return addQuestionToQuestionBank(questionData);
                } else if (question.addPrivate) {
                    const questionData = {
                        question: question.questionText,
                        category: quiz.category,
                        difficultyLevel: quiz.difficulty,
                        orgID: quiz.organisationId,
                        answers: question.answers.reduce((acc, answer, index) => ({
                            ...acc,
                            [`${answer}`]: index === question.correctAnswerIndex,
                        }), {}),
                        tags: quiz.tags ? quiz.tags.reduce((acc, tag) => ({...acc, [tag]: tag}), {}) : [],
                    };
                    return addQuestionToQuestionBank(questionData);
                }
            });

            await Promise.all(promises);
            toast.success("Quiz and questions successfully created!");
        } catch (error) {
            console.error("Error creating quiz or adding questions:", error);
            toast.error("Failed to create quiz. Please try again.");
        }
    };

    const handleAddToPublicBankChange = (questionIndex, checked) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].addToPublicBank = checked;
        setQuestions(updatedQuestions);
    };

    const handleAddToBankChange = (questionIndex, checked) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].addPrivate = checked;
        setQuestions(updatedQuestions);
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredQuestions, setFilteredQuestions] = useState([]);

    const handleSearch = async (event) => {
        const searchValue = event.target.value;
        setSearchTerm(searchValue);

        if (searchValue.trim() !== "") {
            const orgIds = userData.organizations ? Object.keys(userData.organizations) : [];
            let questions = await getAllQuestionFromSearch(searchValue, orgIds);

            if (questions.length == 0) {
                questions = [{
                    'question': 'No questions available'
                }];
            }
            setFilteredQuestions(questions);
        } else {
            setFilteredQuestions([]);
        }
    };

    const [organizations, setOrganizations] = useState("");

    const handleShowOrganizations = async () => {
        handleChange(!quiz.isPrivate, 'isPrivate');

        const userOrganizations = await getUserOrganizations(userData.uid);
        let organizationsArray = [];
        Object.values(userOrganizations).forEach((org, index) => {
            organizationsArray[index] = org;
            index++
        });

        setOrganizations(organizationsArray);
    };

    const handleQuestionClick = (question) => {
        setQuestions([
            ...questions,
            {
                questionText: question.question,
                answers: Object.keys(question.answers),
                correctAnswerIndex: Object.values(question.answers).findIndex(
                    (isCorrect) => isCorrect
                ),
            },
        ]);
    };

    if (!userData) {
        return <div>Loading...</div>;
    }
    return (
        <div className="container create-quiz-wrapper">
            <div className="row">
                {/* Left Panel: Quiz Creation Form */}
               <CreateQuizForm quiz={quiz}
                               handleChange={handleChange}
                               addTag={addTag}
                               removeTag={removeTag}
                               handleGameRulesChange={handleGameRulesChange}
                               handleTimeOptionsChange={handleTimeOptionsChange}
                               handleShowOrganizations={handleShowOrganizations}
                               organizations={organizations}
               />

                {/* Right Panel: Public Questions */}
                <div className="col-md-4 question-bank-panel ms-4">
                    <div className="search-category">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search a category"
                            onChange={handleSearch}
                            value={searchTerm}
                        />
                        <div className="question-bank">
                            {filteredQuestions.length === 0 && publicQuestions.length === 0 ? (
                                <div className="question-item">
                                    <h6>No questions available</h6>
                                </div>
                            ) : filteredQuestions.length === 0 && publicQuestions.length !== 0 ? (
                                publicQuestions.map((question, index) => (
                                    <div
                                        key={index}
                                        className="question-item"
                                        onClick={() => handleQuestionClick(question)}
                                        style={{cursor: "pointer"}}
                                    >
                                        <h6>{question?.question || "No question text"}</h6>
                                    </div>
                                ))
                            ) : (
                                filteredQuestions.map((question, index) => (
                                    <div
                                        key={index}
                                        className="question-item"
                                        onClick={() => handleQuestionClick(question)}
                                        style={{cursor: "pointer"}}
                                    >
                                        <h6>{question?.question || "No question text"}</h6>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>


            </div>

            <hr/>

            {/* Create Questions Section */}
            <CreateQuestionForm
                addQuestion={addQuestion}
                quiz={quiz}
                questions={questions}
                removeQuestion={removeQuestion}
                handleQuestionChange={handleQuestionChange}
                handleAnswerChange={handleAnswerChange}
                handleCorrectAnswerChange={handleCorrectAnswerChange}
                handleAddToPublicBankChange={handleAddToPublicBankChange}
                handleAddToBankChange={handleAddToBankChange}
            />

            <div className="row d-grid mt-4">
                <div className="col-md-12 text-center">
                    <button type="button" className="btn btn-primary btn-create" onClick={handleCreateQuiz}>
                        Create Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateQuiz;
