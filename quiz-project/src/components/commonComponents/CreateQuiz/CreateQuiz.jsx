import React, { useContext, useState, useEffect } from "react";
import "./CreateQuiz.css";
import { createQuizInFirebase } from "../../../services/quiz.service";
import { AppContext } from "../../../appState/app.context.js";
import { toast } from "react-toastify";
import { getQuestionsByOrgIds, getAllQuestionFromSearch, addQuestionToQuestionBank } from "../../../services/quizBank.service.js";
import { getUserOrganizations } from "../../../services/organization.service.js";
const CreateQuiz = () => {
  const [quiz, setQuiz] = useState({});

  const handleChange = (e, type) => {
    let updatedValue = {};
    let { name, value } = e.target ? e.target : e;
    let quizName = "";
    let quizValue = "";
    switch(type) {
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
  const [questions, setQuestions] = useState([{ questionText: "", answers: ["", "", "", ""], correctAnswerIndex: 0 }]);
  const [publicQuestions, setPublicQuestions] = useState([]);
  
  useEffect(() => {
    const fetchPublicQuestions = async () => {
      try {
        console.log(userData);
        const orgIds= userData.organizations? Object.keys(userData.organizations): [];
        console.log(orgIds);
        const fetchedQuestions = await getQuestionsByOrgIds( orgIds);
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
    setQuestions([...questions, { questionText: "", answers: ["", "", "", ""], correctAnswerIndex: 0 }]);
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
      
      if(questions.length == 0){
        return toast.error('Please add at least a single question to your quiz!');
      } else {
        for (let question of questions) {
            if (!question.questionText) {
              return toast.error('Please add a name to your question!');
            }
            if(!question.answers.some(Boolean)) {
              return toast.error('Please add at least a single answer to your question!');
            }
        }
      }

      let quizData;
      if(quiz.organisationId){
        const x= quiz.organisationId.split('////');
      quizData = {
        
        createdOn: new Date(),
        name: quiz.quizTitle,
        avatar: quiz.pictureUrl,
        description: quiz.description,
        numberOfQuestions: questions.length,
        difficultyLevel: quiz.difficulty,
        category: quiz.category,
        tags:quiz.tags ? quiz.tags?.reduce((acc, tag) => ({ ...acc, [tag]: tag }), {}) : [],
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
          orgID:x[0],
          orgName:x[1],
        }
      };
    }
    else {
      quizData = {
          
        createdOn: new Date(),
        name: quiz.quizTitle,
        avatar: quiz.pictureUrl,
        description: quiz.description,
        numberOfQuestions: questions.length,
        difficultyLevel: quiz.difficulty,
        category: quiz.category,
        tags:quiz.tags ? quiz.tags?.reduce((acc, tag) => ({ ...acc, [tag]: tag }), {}) : [],
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
            orgID:'public',
            answers: question.answers.reduce((acc, answer, index) => ({
              ...acc,
              [`${answer}`]: index === question.correctAnswerIndex,
            }), {}),
            tags: quiz.tags ? quiz.tags.reduce((acc, tag) => ({ ...acc, [tag]: tag }), {}) : [],
          };
          return addQuestionToQuestionBank(questionData);
        } else if (question.addPrivate){
          const questionData = {
            question: question.questionText,
            category: quiz.category,
            difficultyLevel: quiz.difficulty,
            orgID:quiz.organisationId,
            answers: question.answers.reduce((acc, answer, index) => ({
              ...acc,
              [`${answer}`]: index === question.correctAnswerIndex,
            }), {}),
            tags: quiz.tags ? quiz.tags.reduce((acc, tag) => ({ ...acc, [tag]: tag }), {}) : [],
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
          const orgIds= userData.organizations? Object.keys(userData.organizations): [];
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
  
  if (!userData ) {
    return <div>Loading...</div>; 
}
  return (
    <div className="container create-quiz-wrapper">
      <div className="row">
        {/* Left Panel: Quiz Creation Form */}
        <div className="col-md-8 form-panel">
          <div className="p0pform">
            <label htmlFor="quizTitle" className="form-label">
              Quiz Title
            </label>
            <input
              type="text"
              name="quizTitle"
              id="quizTitle"
              className="form-control"
              placeholder="Enter quiz title"
              defaultValue={quiz.quizTitle}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              className="form-control"
              placeholder="Enter description"
              defaultValue={quiz.description}
              onChange={(e) => handleChange(e)}
            />

            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              defaultValue={quiz.category}
              onChange={(e) => handleChange(e)}
            >
              <option value="" selected disabled>Select Category</option>
              <option value="science">Science</option>
              <option value="history">History</option>
              <option value="math">Math</option>
            </select>
            
            <label htmlFor="difficulty" className="form-label">
              Difficulty
            </label>
            <select
              name="difficulty"
              id="difficulty"
              className="form-select"
              defaultValue={quiz.difficulty}
              onChange={(e) => handleChange(e)}
            >
              <option value="" disabled selected>Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <label htmlFor="pictureUrl" className="form-label">
              Picture URL
            </label>
            <input
              type="text"
              name="pictureUrl"
              id="pictureUrl"
              className="form-control"
              placeholder="Enter picture URL"
              defaultValue={quiz.pictureUrl}
              onChange={(e) => handleChange(e)}
            />

            {/* Time Limit for Quiz */}
            <div className="mb-3">
              <input
                type="checkbox"
                name="isTimeLimitPerQuizActive"
                id="isTimeLimitPerQuizActive"
                checked={quiz.timeOptions?.isTimeLimitPerQuizActive}
                onChange={handleTimeOptionsChange}
              />
              <label htmlFor="isTimeLimitPerQuizActive" className="ms-2">
                Enable Total Time Limit for Quiz
              </label>
              <input
                type="number"
                name="timeLimitPerQuiz"
                id="timeLimitPerQuiz"
                className="form-control mt-2"
                placeholder="Enter total time limit for the quiz (minutes)"
                value={quiz.gameRules?.timeLimitPerQuiz}
                onChange={handleGameRulesChange}
                disabled={!quiz.timeOptions?.isTimeLimitPerQuizActive}
              />
            </div>

            {/* Time Limit per Question */}
            <div className="mb-3">
              <input
                type="checkbox"
                name="isTimeLimitPerQuestionActive"
                id="isTimeLimitPerQuestionActive"
                checked={quiz.timeOptions?.isTimeLimitPerQuestionActive}
                onChange={handleTimeOptionsChange}
              />
              <label htmlFor="isTimeLimitPerQuestionActive" className="ms-2">
                Enable Time Limit per Question
              </label>
              <input
                type="number"
                name="timeLimitPerQuestion"
                id="timeLimitPerQuestion"
                className="form-control mt-2"
                placeholder="Enter time limit per question (minutes)"
                value={quiz.gameRules?.timeLimitPerQuestion}
                onChange={handleGameRulesChange}
                disabled={!quiz.timeOptions?.isTimeLimitPerQuestionActive}
              />
            </div>

            {/* Quiz Open Duration */}
            <div className="mb-3">
              <input
                type="checkbox"
                name="isOpenDurationActive"
                id="isOpenDurationActive"
                checked={quiz.timeOptions?.isOpenDurationActive}
                onChange={handleTimeOptionsChange}
              />
              <label htmlFor="isOpenDurationActive" className="ms-2">
                Enable Quiz Open Duration
              </label>
              <input
                type="number"
                name="openDuration"
                id="openDuration"
                className="form-control mt-2"
                placeholder="Enter how long the quiz will be open (hours)"
                value={quiz.gameRules?.openDuration}
                onChange={handleGameRulesChange}
                disabled={!quiz.timeOptions?.isOpenDurationActive}
              />
            </div>

            <label htmlFor="tagInput" className="form-label">
              Tags
            </label>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter a tag"
                name="tagInput"
                defaultValue={quiz.tagInput}
                onChange={(e) => handleChange(e)}
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={addTag}
              >
                Add Tag
              </button>
            </div>

            <div className="tag-list">
              {quiz.tags?.map((tag, index) => (
                <span key={index} className="badge bg-secondary me-2">
                  {tag}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    aria-label="Close"
                    onClick={() => removeTag(index)}
                  />
                </span>
              ))}
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input isPrivate"
                id="isPrivate"
                name="isPrivate"
                defaultChecked={quiz.isPrivate}
                onChange={handleShowOrganizations}
              />
              <label className="form-check-label" htmlFor="isPrivate">
                Private Quiz (Uncheck for Public)
              </label>

              <div className="mb-3 mt-3 organizationsTab">
                <label htmlFor="organization" className="form-label">
                  Organization
                </label>
                <select
                  name="organisationId"
                  id="organisationId"
                  className="form-select"
                  value={quiz.organisationId}
                  onChange={(e) => handleChange(e)}
                >
                  <option value="" selected disabled>Please select an organization!</option>
                  {organizations.length === 0 ? (
                    <option value="">You are not a part of any organizations!</option>
                  ) : ( organizations.map((organization, index) => (
                    <option key={index} value={`${organization.organizationID}////${organization.organizationName}`}>{organization.organizationName}</option>
                   ))
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>

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
            style={{ cursor: "pointer" }}
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
            style={{ cursor: "pointer" }}
          >
            <h6>{question?.question || "No question text"}</h6>
          </div>
        ))
      )}
    </div>
  </div>
</div>


      </div>

      <hr />

      {/* Create Questions Section */}
      <div className="row mt-4">
        <div className="col-md-12">
          <h4>Create Questions</h4>
          {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="mb-4 question-box">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label">
                  Question {questionIndex + 1}
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
                className="form-control"
                placeholder="Enter your question"
                value={question.questionText}
                onChange={(e) =>
                  handleQuestionChange(questionIndex, e.target.value)
                }
              />

              <div className="row mt-3">
                {question.answers.map((answer, answerIndex) => (
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
                        checked={question.correctAnswerIndex === answerIndex}
                        onChange={() =>
                          handleCorrectAnswerChange(questionIndex, answerIndex)
                        }
                      />
                      <label className="form-check-label">
                        Mark as Correct Answer
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-check mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`addToPublicBank${questionIndex}`}
                  checked={question.addToPublicBank || false}
                  onChange={(e) =>
                    handleAddToPublicBankChange(questionIndex, e.target.checked)
                  }
                />
                <label className="form-check-label" htmlFor={`addToPublicBank${questionIndex}`}>
                  Add this question to the public bank
                </label>
                
           </div>
           { quiz.organisationId? 
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
                <label className="form-check-label" htmlFor={`addToPrivateBank${questionIndex}`}>
                  Add this question to the private question bank
                </label>
                
              </div> : <></>}
            </div>
          ))}

          <button className="btn btn-secondary" onClick={addQuestion}>
            Add Another Question
          </button>
        </div>
      </div>

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
