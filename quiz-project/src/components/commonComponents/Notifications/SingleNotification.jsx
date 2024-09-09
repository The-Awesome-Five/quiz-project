import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { updateNotificationStatus } from '../../../services/quiz.service';
import { AppContext } from '../../../appState/app.context';


const SingleNotification = ({ notification, userId, quizID }) => {
    const {userData}= useContext(AppContext);
    const handleAccept = () => {
        updateNotificationStatus(userId, quizID, 'accepted', userData.username);
    };

    const handleReject = () => {
        updateNotificationStatus(userId, quizID, 'rejected', userData.username);
    };

    return (
        <div className="notification-card">
            <p className='notification-title'>{notification.quizName}</p>
            <p className='notification-status'>Status: <span>{notification.status}</span></p>
            <Button className='btn-success me-2'  onClick={handleAccept}>Accept</Button>
            <Button className='btn-success' onClick={handleReject}>Reject</Button>
        </div>
    );
};

export default SingleNotification;