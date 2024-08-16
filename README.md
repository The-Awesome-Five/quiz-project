Here's your code structure formatted in Markdown:

```javascript
const users = {
    uid: "id",
    username: "username",
    firstName: 'firstName',
    lastName: "lastName",
    email: "email",
    phoneNumber: "phoneNumber",
    role: "Admin/Educator/Student",
    address: "optional address",
    avatarUrl: "image url",
    activeQuizzesIds: {
        id: {
            quizId: "id",
            score: "number"
        }
    },
    ongoingQuizzesIds: {
        id:  {
            quizId: "id",
            score: "number"
        }
    },
    completedQuizzesIds: {
        id:  {
            quizId: "id",
            score: "number",
            completedOn: "date"
        }
    },
    group: {
        id: {
            groupId: "id",
            groupName: "name"
        }
    },
    quizzesLeader: {
        quizId: "id"
    }
}

// we define the score of a question by its tag

const questionBank = {
    organisation: {
        id: {
           tagName: {
                difficultyTagLevel :{
                    questionId: {
                        questionId: "id",
                        question: "question name",
                        answers: {
                            //answer === the answer itself as a key
                            answerA: true,
                            answerB: false,
                            answerC: false,
                            answerD: false
                        },
                        // id as a key
                        tags: {
                            id: "tag name"
                        },
                        organisation: {
                            // id of the organisation as a key
                            id: "name"
                        }
                    }
                }
           }
        }
    },
    public: {
        tagName: {
            difficultyTagLevel : {
                questionId: {
                    questionId: "id",
                    question: "question name",
                    answers: {
                        //answer === the answer itself as a key
                        answerA: true,
                        answerB: false,
                        answerC: false,
                        answerD: false
                    },
                    // id as a key
                    tags: {
                        id: "tag name"
                    },
                }
            }
        }
    }
}

const quizzes = {
    organisation:{
        id: {
            categoryTagName: {
                quizId: {
                    quizId: "id",
                    name: "name",
                    description: "description",
                    numberOfQuestions: "number",
                    tags :{ 
                        tagName: 'name'
                    },
                    ruleSet: {
                        ruleId1: {
                            name: "string",
                            choice: "string"
                        },
                        ruleId2: {
                            name: "string",
                            choice: "string"
                        },
                        ruleId3: {
                            name: "string",
                            choice: "string"
                        }
                    },
                    totalScore: "number",
                    passingScore: "number",
                    leader: {
                        userId: "id",
                        username: "username",
                        score: "number"
                    },
                    organisationId: "string",
                    questions: {
                        id: {
                            question: "question name",
                            answers: {
                                //answer === the answer itself as a key
                                answerA: true,
                                answerB: false,
                                answerC: false,
                                answerD: false
                            },
                            // id as a key
                            tags: {
                                id: "tag name"
                            },
                        }
                    },
                    participants: {
                        userId: {
                            userId: "id",
                            username: "username",
                            score: "number"
                        }
                    },
                    correctShowAtTheEnd: false
                }
            }
        }
    },
    public: {
        categoryTagName: {
            difficultyTagLevel: {
                id: {
                    quizId: {
                        quizId: "id",
                        name: "name",
                        description: "description",
                        numberOfQuestions: "number",
                        tags: {
                            // the tag id as a key
                            id: "tag name"
                        },
                        ruleSet: {
                            ruleId1: {
                                name: "string",
                                choice: "string"
                            },
                            ruleId2: {
                                name: "string",
                                choice: "string"
                            },
                            ruleId3: {
                                name: "string",
                                choice: "string"
                            }
                        },
                        totalScore: "number",
                        passingScore: "number",
                        leader: {
                            userId: "id",
                            username: "username",
                            score: "number"
                        },
                        organisationId: "string",
                        questions: {
                            id: {
                                question: "question name",
                                answers: {
                                    //answer === the answer itself as a key
                                    answerA: true,
                                    answerB: false,
                                    answerC: false,
                                    answerD: false
                                },
                                // id as a key
                                tags: {
                                    id: "tag name"
                                },
                            }
                        },
                        participants: {
                            userId: {
                                userId: "id",
                                username: "username",
                                score: "number"
                            }
                        },
                        correctShowAtTheEnd: false
                    }
                }
            }
        }
    }
}

const rules = {
    timerId: {
        name: "timer",
        totalMinutes: "number",
        secondsPerQuestion: "number"
    },
    liveId: {
        name: "lives",
        lives: "minutes",
    },
    scoreId: {
        name: "score",
        maxScore: "number",
        penalty: "number"
    }
}

// timer, number of lives, score > 0,
```
