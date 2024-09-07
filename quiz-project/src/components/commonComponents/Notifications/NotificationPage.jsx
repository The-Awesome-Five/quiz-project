import React, { useContext, useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import SingleNotification from './SingleNotification.jsx';
import { AppContext } from '../../../appState/app.context';
import { db } from '../../../firebase/config';

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const {userData}= useContext(AppContext)

    useEffect(() => {
        if(userData){
        const notificationsRef = ref(db, `users/${userData.uid}/notifications/pending`);
        const unsubscribe = onValue(notificationsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setNotifications(Object.entries(data).map(([quizID, notification]) => ({
                    quizID,
                    ...notification
                })));
            } else {
                setNotifications([]);
            }
        });

        return () => unsubscribe();
    }
    }, [userData]);

    return (
        <div>
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <SingleNotification
                        key={notification.quizID} 
                        notification={notification} 
                        userId={userData.uid} 
                        quizID={notification.quizID} 
                    />
                ))
            ) : (
                <p>No notifications</p>
            )}
        </div>
    );
};

export default NotificationPage;