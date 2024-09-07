import React from "react";

export const CreateQuizForm = ({
    handleChange,
    quiz,
    addTag,
    handleTimeOptionsChange,
    handleGameRulesChange,
    organizations,
    removeTag,
    handleShowOrganizations,
    handleIsInvitesOnly
}) => {


    return (
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
                
                 <label htmlFor="Passing Score" className="form-label">
                   Passing Score
                </label>
                <input
                    type="number"
                     className="form-control"
                    onChange={(e) => handleChange(e.target.value, 'passingScore')}
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
                { quiz.organisationId && <div className="mb-3">
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
                }

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
                            ) : (organizations.map((organization, index) => (
                                <option key={index}
                                    value={`${organization.organizationID}////${organization.organizationName}`}>{organization.organizationName}</option>
                            ))
                            )}
                        </select>
                        <input
                        type="checkbox"
                        className="form-check-input isInvites"
                        id="isInvites"
                        name="isInvites"
                        defaultChecked={quiz.isInvites}
                        onChange={handleIsInvitesOnly}
                    />
                        <label className="form-check-label" htmlFor="isInvites"
                        onChange={(e) => handleIsInvitesOnly()}
                        >
                        Invites Only
                    </label>
                    </div>
                </div>
            </div>
        </div>
    )
}