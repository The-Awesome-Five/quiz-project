import React from 'react';

const FeedbackNotification = ({ notification }) => {
    const { quizName, score, totalScore, feedback } = notification;

    const renderFeedback = (feedback) => {
        if (typeof feedback === 'object') {

            return Object.entries(feedback).map(([key, value]) => (
                <div key={key}>
                {value}
                </div>
            ));
        }
        return feedback; 
    };

    return (
        <div className="notification">
            <h5>{quizName}</h5>
            <p>Score: {typeof score === 'object' ? JSON.stringify(score) : score} / {totalScore}</p>
            <p>Feedback: {renderFeedback(feedback)}</p>
        </div>
    );
};

export default FeedbackNotification;