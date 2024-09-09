import React, { useContext, useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import SingleNotification from './SingleNotification.jsx';

import { AppContext } from '../../../appState/app.context';
import { db } from '../../../firebase/config';
import FeedbackNotification from './FeedbackNotifications.jsx';
import './NotificationPage.css'


const NotificationPage = () => {
    const [pendingNotifications, setPendingNotifications] = useState([]);
    const [feedbackNotifications, setFeedbackNotifications] = useState([]);
    const { userData } = useContext(AppContext);

    useEffect(() => {
        if (userData) {
            const pendingRef = ref(db, `users/${userData.uid}/notifications/pending`);
            const unsubscribePending = onValue(pendingRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setPendingNotifications(Object.entries(data).map(([quizID, notification]) => ({
                        quizID,
                        ...notification,
                    })));
                } else {
                    setPendingNotifications([]);
                }
            });
            const feedbackRef = ref(db, `users/${userData.uid}/notifications/feedback`);
            const unsubscribeFeedback = onValue(feedbackRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setFeedbackNotifications(Object.entries(data).map(([quizID, notification]) => ({
                        quizID,
                        ...notification,
                    })));
                } else {
                    setFeedbackNotifications([]);
                }
            });

            return () => {
                unsubscribePending();
                unsubscribeFeedback();
            };
        }
    }, [userData]);

    return (
        <div className="notification-container">
            <h4 className="notification-heading">Pending Notifications</h4>
            {pendingNotifications.length > 0 ? (
                pendingNotifications.map((notification) => (
                    <div className="notification-card" key={notification.quizID}>
                        <SingleNotification
                            notification={notification}
                            userId={userData.uid}
                            quizID={notification.quizID}
                        />
                    </div>
                ))
            ) : (
                <p className="empty-message">No pending notifications</p>
            )}

            <h4 className="notification-heading">Feedback Notifications</h4>
            {feedbackNotifications.length > 0 ? (
                feedbackNotifications.map((notification) => (
                    <div className="notification-card" key={notification.quizID}>
                        <FeedbackNotification notification={notification} />
                    </div>
                ))
            ) : (
                <p className="empty-message">No feedback available</p>
            )}
        </div>
    );
};

export default NotificationPage;