import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { updateNotificationStatus } from '../../../services/quiz.service';
import { AppContext } from '../../../appState/app.context';


const Notification = ({ notification, userId, quizID }) => {
    const {userData}= useContext(AppContext);
    const handleAccept = () => {
        updateNotificationStatus(userId, quizID, 'accepted', userData.username);
    };

    const handleReject = () => {
        updateNotificationStatus(userId, quizID, 'rejected', userData.username);
    };

    return (
        <div className="notification">
            <p>{notification.quizName}</p>
            <p>Status: {notification.status}</p>
            <Button variant="success" onClick={handleAccept}>Accept</Button>
            <Button variant="danger" onClick={handleReject}>Reject</Button>
        </div>
    );
};

export default Notification;