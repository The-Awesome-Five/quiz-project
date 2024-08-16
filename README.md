Here’s your updated code structure in Markdown format:

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
        organisation: {
            id:  {
                quizId: "id",
                score: "number",
                completedOn: "date"
            }
        }, 
        public: {
            categoryName: {
                difficultyTagLevel: {
                    quizId: {
                        score: "number"
                    }
                }
            }
        }
    },
    organisation: {
        id: {
            orgId: "id",
            orgName: "name"
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
                    avatar: 'img',
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
                        avatar: 'img',
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

// timer, number of lives, score > 0,

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

const organisation = {
    id: {
        orgId: "id",
        organisationAvatar: "avatar URL",
        description: "string",
        educators: {
            userId: "username"
        }, 
        owner: {
            userId: "username"
        },
        students : {
            userId: "username",
        },
        quizzesId: {
            quizId:{ 
                name:"quiz name",
                quizAvatar: 'img',
            }
        },
        leaderBoard : { 
            categoryName: {
                difficultyTagLevel: {
                    top10: {
                        numberOne: {
                            userId: "string",
                            totalScore: "number",
                            name: "username"
                        },
                        numberTwo: {
                            userId: "string",
                            totalScore: "number",
                            name: "username"
                        },
                        numberThree: {
                            userId: "string",
                            totalScore: "number",
                            name: "username"
                        }
                    }
                }
            }
        }
    }
}

// available only for public view
const globalLeaderboard = { 
    categoryName: {
        difficultyTagLevel: {
            top10: {
                numberOne: {
                    userId: "string",
                    totalScore: "number",
                    name: "username"
                },
                numberTwo: {
                    userId: "string",
                    totalScore: "number",
                    name: "username"
                },
                numberThree: {
                    userId: "string",
                    totalScore: "number",
                    name: "username"
                }
            }
        }
    }
}
```
