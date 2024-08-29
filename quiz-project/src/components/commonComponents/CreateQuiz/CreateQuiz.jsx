import React, { useContext, useState, useEffect } from "react";
import "./CreateQuiz.css";
import { createQuizInFirebase } from "../../../services/quiz.service";
import { AppContext } from "../../../appState/app.context.js";
import { toast } from "react-toastify";
import { addQuestionToPublicBank, addQuestionToOrgBank, getAllQuestionFromBank, getAllQuestionFromSearch } from "../../../services/quizBank.service.js";
const CreateQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [organisationId, setOrganisationId] = useState("12345");
  const [difficultyLevel, setDifficultyLevel] = useState("easy");
  const [timeOptions, setTimeOptions] = useState({
    isTimeLimitPerQuizActive: false,
    isTimeLimitPerQuestionActive: false,
    isOpenDurationActive: false,
  });
  const [gameRules, setGameRules] = useState({
    timeLimitPerQuiz: "",
    timeLimitPerQuestion: "",
    openDuration: "",
    maxAttempts: "",
    showCorrectAnswers: false,
  });

  const { userData } = useContext(AppContext);
  const [questions, setQuestions] = useState([{ questionText: "", answers: ["", "", "", ""], correctAnswerIndex: 0 }]);
  const [publicQuestions, setPublicQuestions] = useState([]);

  
  useEffect(() => {
    const fetchPublicQuestions = async () => {
      try {
        const fetchedQuestions = await getAllQuestionFromBank();
        setPublicQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching public questions:", error);
      }
    };
    fetchPublicQuestions();
  }, []);

  const addTag = () => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleGameRulesChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGameRules({
      ...gameRules,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTimeOptionsChange = (e) => {
    const { name, checked } = e.target;
    setTimeOptions({
      ...timeOptions,
      [name]: checked,
    });
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
      const quizData = {
        quizId: `quiz_${Date.now()}`,
        name: quizTitle,
        avatar: pictureUrl,
        description: description,
        numberOfQuestions: questions.length,
        tags: tags.reduce((acc, tag) => ({ ...acc, [tag]: tag }), {}),
        ruleSet: {
          timeLimitPerQuiz: timeOptions.isTimeLimitPerQuizActive ? gameRules.timeLimitPerQuiz : null,
          timeLimitPerQuestion: timeOptions.isTimeLimitPerQuestionActive ? gameRules.timeLimitPerQuestion : null,
          openDuration: timeOptions.isOpenDurationActive ? gameRules.openDuration : null,
          showCorrectAnswers: gameRules.showCorrectAnswers,
        },
        questions: questions.map((q) => ({
          question: q.questionText,
          answers: q.answers,
          correctAnswerIndex: q.correctAnswerIndex,
        })),
        isPublic: isPrivate,
        creator: {
          userId: userData.uid,
          name: userData.username,
        },
      };

      await createQuizInFirebase(quizData, isPrivate, organisationId, category, difficultyLevel);

      const promises = questions.map(async (question) => {
        const questionData = {
          questionId: `question_${Date.now()}`,
          question: question.questionText,
          answers: question.answers.reduce((acc, answer, index) => ({
            ...acc,
            [`answer${String.fromCharCode(65 + index)}`]: index === question.correctAnswerIndex,
          }), {}),
          tags: tags.reduce((acc, tag) => ({ ...acc, [tag]: tag }), {}),
        };

        if (question.addToPublicBank) {
          return addQuestionToPublicBank(questionData, category, difficultyLevel);
        } else {
          return addQuestionToOrgBank(questionData, organisationId, category, difficultyLevel);
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

 
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  const handleSearch = async (event) => {
      const searchValue = event.target.value;  
      setSearchTerm(searchValue);  

      if (searchValue.trim() !== "") {
          const questions = await getAllQuestionFromSearch(searchValue);
          setFilteredQuestions(questions);
      } else {
          setFilteredQuestions([]);  
      }
  };
  

  return (
    <div className="container create-quiz-wrapper">
      <div className="row">
        {/* Left Panel: Quiz Creation Form */}
        <div className="col-md-8 form-panel">
          <div className="quiz-form">
            <label htmlFor="quizTitle" className="form-label">
              Quiz Title
            </label>
            <input
              type="text"
              name="quizTitle"
              id="quizTitle"
              className="form-control"
              placeholder="Enter quiz title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="science">Science</option>
              <option value="history">History</option>
              <option value="math">Math</option>
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
              value={pictureUrl}
              onChange={(e) => setPictureUrl(e.target.value)}
            />

            {/* Time Limit for Quiz */}
            <div className="mb-3">
              <input
                type="checkbox"
                name="isTimeLimitPerQuizActive"
                id="isTimeLimitPerQuizActive"
                checked={timeOptions.isTimeLimitPerQuizActive}
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
                value={gameRules.timeLimitPerQuiz}
                onChange={handleGameRulesChange}
                disabled={!timeOptions.isTimeLimitPerQuizActive}
              />
            </div>

            {/* Time Limit per Question */}
            <div className="mb-3">
              <input
                type="checkbox"
                name="isTimeLimitPerQuestionActive"
                id="isTimeLimitPerQuestionActive"
                checked={timeOptions.isTimeLimitPerQuestionActive}
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
                value={gameRules.timeLimitPerQuestion}
                onChange={handleGameRulesChange}
                disabled={!timeOptions.isTimeLimitPerQuestionActive}
              />
            </div>

            {/* Quiz Open Duration */}
            <div className="mb-3">
              <input
                type="checkbox"
                name="isOpenDurationActive"
                id="isOpenDurationActive"
                checked={timeOptions.isOpenDurationActive}
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
                value={gameRules.openDuration}
                onChange={handleGameRulesChange}
                disabled={!timeOptions.isOpenDurationActive}
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
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
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
              {tags.map((tag, index) => (
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
                className="form-check-input"
                id="isPublic"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
              />
              <label className="form-check-label" htmlFor="isPublic">
                Private Quiz (Uncheck for Public)
              </label>
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
    <p>No questions available</p>
  ) : filteredQuestions.length === 0 && publicQuestions.length !== 0 ? (
    publicQuestions.map((question, index) => (
      <div key={index} className="question-item">
        <h6>{question?.question || "No question text"}</h6>
        
      </div>
    ))
  ) : (
    filteredQuestions.map((question, index) => (
      <div key={index} className="question-item">
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
