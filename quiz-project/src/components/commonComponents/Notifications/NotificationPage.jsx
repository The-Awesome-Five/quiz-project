import React, { useContext, useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import SingleNotification from './SingleNotification.jsx';

import { AppContext } from '../../../appState/app.context';
import { db } from '../../../firebase/config';
import FeedbackNotification from './FeedbackNotifications.jsx';

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
        <div>
            <h4>Pending Notifications</h4>
            {pendingNotifications.length > 0 ? (
                pendingNotifications.map((notification) => (
                    <SingleNotification
                        key={notification.quizID}
                        notification={notification}
                        userId={userData.uid}
                        quizID={notification.quizID}
                    />
                ))
            ) : (
                <p>No pending notifications</p>
            )}

            <h4>Feedback Notifications</h4>
            {feedbackNotifications.length > 0 ? (
                feedbackNotifications.map((notification) => (
                    <FeedbackNotification
                        key={notification.quizID}
                        notification={notification}
                    />
                ))
            ) : (
                <p>No feedback available</p>
            )}
        </div>
    );
};

export default NotificationPage;