import React, { useContext, useState, useEffect } from "react";
import "./CreateQuiz.css";
import { createQuizInFirebase } from "../../../services/quiz.service";
import { AppContext } from "../../../appState/app.context.js";
import { toast } from "react-toastify";
import {
    getQuestionsByOrgIds,
    getAllQuestionFromSearch,
    addQuestionToQuestionBank
} from "../../../services/quizBank.service.js";
import { getUserOrganizations } from "../../../services/organization.service.js";
import { CreateQuestionForm } from "./CreateQuestionForm/CreateQuestionForm.jsx";
import { CreateQuizForm } from "./CreateQuizForm/CreateQuizForm.jsx";
import { PublicQuestionForm } from "./PublicQuestionForm/PublicQuestionForm.jsx";
import { QuestionsAIForm } from "./QuestionsAIForm/QuestionsAIForm.jsx";

const CreateQuiz = () => {


    const [quiz, setQuiz] = useState({
        isPublic: true,
    });

    const handleChange = (e, type) => {
        let updatedValue = {};
        let { name, value } = e.target ? e.target : e;
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

                const { name, value, type, checked } = e.target;
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
            case 'passingScore':
                quizName = 'passingScore';
                quizValue = e;
                console.log(quiz)
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

    const { userData } = useContext(AppContext);
    const [questions, setQuestions] = useState([{ question: "", answers: ["", "", "", ""], correctAnswerIndex: 0, points: 0, isMultiple: true }]);
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

    
    const handleIsInvitesOnlyChange = (e) => {
        if(quiz.isInvites===false || quiz.isInvites===undefined){
            quiz.isInvites=true;
        }
        else{
            quiz.isInvites=false;
        }
        console.log(quiz)
    };

    const handleQuestionChange = (index, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question = value;
        setQuestions(updatedQuestions);
    };
    const handlePointsChange = (index, value) => {
        console.log('Updating Points')
        const updatedQuestions = [...questions];
        updatedQuestions[index].points = value;
        setQuestions(updatedQuestions);
    };


    const handleAnswerChange = (questionIndex, answerIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answers[answerIndex] = value;
        setQuestions(updatedQuestions);
    };

    const addMultipleChoiceQuestion = () => {
        setQuestions([...questions, { question: "", answers: ["", "", "", ""], correctAnswerIndex: 0, points: 0, isMultiple: true }]);
    };
    const addOpenQuestion = () => {
        setQuestions([...questions, { question: "", points: 0, isMultiple: false }]);
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

            if (questions.length === 0) {
                return toast.error('Please add at least a single question to your quiz!');
            } else {
                for (let question of questions) {
                    if (!question.question) {
                        return toast.error('Please add a name to your question!');
                    }
                    if (question.isMultiple) {
                        if (!question.answers.some(Boolean)) {
                            return toast.error('Please add at least a single answer to your question!');
                        }
                    }
                }
            }
            let date = Date()
            let x='';
            let quizData;
            const hours = quiz.timeOptions?.isOpenDurationActive ? quiz.gameRules?.openDuration : null;  
            if(hours){
            const openTime = new Date();
            var closeTime = new Date(openTime.getTime() + hours * 60 * 60 * 1000);
            }
            if (quiz.organisationId) {
                x = quiz.organisationId.split('////');
            }
          
                if (quiz.organisationId) {

                    quizData = {

                        createdOn: date,
                        name: quiz.quizTitle,
                        avatar: quiz.pictureUrl,
                        description: quiz.description,
                        numberOfQuestions: questions.length,
                        difficultyLevel: quiz.difficulty,
                        category: quiz.category,
                        tags: quiz.tags ? quiz.tags?.reduce((acc, tag) => ({ ...acc, [tag]: tag }), {}) : [],
                        ruleSet: {
                            timeLimitPerQuiz: quiz.timeOptions?.isTimeLimitPerQuizActive ? quiz.gameRules?.timeLimitPerQuiz : null,
                            timeLimitPerQuestion: quiz.timeOptions?.isTimeLimitPerQuestionActive ? quiz.gameRules?.timeLimitPerQuestion : null,
                            openDuration: closeTime,
                            showCorrectAnswers: quiz.gameRules?.showCorrectAnswers ? quiz.gameRules?.showCorrectAnswers : null,
                        },
                        passingScore: quiz.passingScore,
                        questions: questions.map((q) => ({
                            question: q.question,
                            points: q.points,
                            answers: q.isMultiple ? q.answers : [],
                            correctAnswerIndex: q.isMultiple ? q.correctAnswerIndex : null
                        })),
                        isPublic: quiz.isPrivate,
                        creator: {
                            userId: userData.uid,
                            name: userData.username,
                        },
                        isInvites: quiz.isInvites ? true : false ,
                        organizationID: {
                            orgID: x[0],
                            orgName: x[1],
                        }
                    };
                } else {
                    quizData = {

                        createdOn: date,
                        name: quiz.quizTitle,
                        avatar: quiz.pictureUrl,
                        description: quiz.description,
                        numberOfQuestions: questions.length,
                        difficultyLevel: quiz.difficulty,
                        category: quiz.category,
                        tags: quiz.tags ? quiz.tags?.reduce((acc, tag) => ({ ...acc, [tag]: tag }), {}) : [],
                        ruleSet: {
                            timeLimitPerQuiz: quiz.timeOptions?.isTimeLimitPerQuizActive ? quiz.gameRules?.timeLimitPerQuiz : null,
                            timeLimitPerQuestion: quiz.timeOptions?.isTimeLimitPerQuestionActive ? quiz.gameRules?.timeLimitPerQuestion : null,
                            showCorrectAnswers: quiz.gameRules?.showCorrectAnswers ? quiz.gameRules?.showCorrectAnswers : null,
                        },
                        passingScore: quiz.passingScore,
                        questions: questions.map((q) => ({
                            question: q.question,
                            points: q.points,
                            answers: q.isMultiple ? q.answers : [],
                            correctAnswerIndex: q.isMultiple ? q.correctAnswerIndex : null
                        })),
                        isPublic: true,
                        creator: {
                            userId: userData.uid,
                            name: userData.username,
                        },
                    }
                }
            console.log(quizData);

            await createQuizInFirebase(quizData);

            const promises = questions.map(async (question) => {


                if (question.addToPublicBank) {
                    const questionData = {
                        question: question.question,
                        category: quiz.category,
                        difficultyLevel: quiz.difficulty,
                        orgID: 'public',
                        answers: question.answers.reduce((acc, answer, index) => ({
                            ...acc,
                            [`${answer}`]: index === question.correctAnswerIndex,
                        }), {}),
                        tags: quiz.tags ? quiz.tags.reduce((acc, tag) => ({ ...acc, [tag]: tag }), {}) : [],
                        isMultiple: true,
                    };
                    return addQuestionToQuestionBank(questionData);
                } else if (question.addPrivate) {
                    const questionData = {
                        question: question.question,
                        category: quiz.category,
                        difficultyLevel: quiz.difficulty,
                        orgID: x[0],
                        answers: question.answers.reduce((acc, answer, index) => ({
                            ...acc,
                            [`${answer}`]: index === question.correctAnswerIndex,
                        }), {}),
                        tags: quiz.tags ? quiz.tags.reduce((acc, tag) => ({ ...acc, [tag]: tag }), {}) : [],
                        isMultiple: true,
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

       // handleChange(!quiz.isPrivate, 'isPrivate');

        if (quiz.isPublic) {
            const userOrganizations = await getUserOrganizations(userData.uid);
            let organizationsArray = [];
            Object.values(userOrganizations).forEach((org, index) => {
                organizationsArray[index] = org;
                index++
            });

            setOrganizations(organizationsArray);
            setQuiz(quiz => ({
                ...quiz,
                isPublic: false
            }));

        } else {
            setOrganizations("");
            setQuiz(quiz => ({
                ...quiz,
                isPublic: true,
                organisationId: null
            }));

        }
    };

    const handleQuestionClick = (question) => {

        console.log('isPublic:')
        console.log(quiz);

        setQuestions([
            ...questions,
            {
                question: question.question,
                answers: Object.keys(question.answers),
                correctAnswerIndex: Object.values(question.answers).findIndex(
                    (isCorrect) => isCorrect
                ),
                isMultiple: true,
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
                    handleIsInvitesOnly={handleIsInvitesOnlyChange}
                    organizations={organizations}

                />

                {/* Right Panel: Public Questions */}
                <PublicQuestionForm handleSearch={handleSearch}
                    searchTerm={searchTerm}
                    filteredQuestions={filteredQuestions}
                    publicQuestions={publicQuestions}
                    handleQuestionClick={handleQuestionClick} />

            </div>

            <hr />

            {/* Create Questions Section */}


            <CreateQuestionForm
                addMultipleChoiceQuestion={addMultipleChoiceQuestion}
                addOpenQuestion={addOpenQuestion}
                quiz={quiz}
                questions={questions}
                setQuestions={setQuestions}
                removeQuestion={removeQuestion}
                handleQuestionChange={handleQuestionChange}
                handleAnswerChange={handleAnswerChange}
                handleCorrectAnswerChange={handleCorrectAnswerChange}
                handleAddToPublicBankChange={handleAddToPublicBankChange}
                handleAddToBankChange={handleAddToBankChange}
                handlePointsChange={handlePointsChange}
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
