import React from "react";

export const PublicQuestionForm = ({
                                       handleSearch,
                                       searchTerm,
                                       filteredQuestions,
                                       publicQuestions,
                                       handleQuestionClick,

                                   }) => {

    return (
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

    )

}
