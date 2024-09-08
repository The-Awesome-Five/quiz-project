import React, { useState, useEffect } from 'react'
import {Container, Card} from "react-bootstrap";

const TimeCounter = ({ initialSeconds, finish, reset }) => {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {

       setSeconds(initialSeconds);

    }, [reset])

    useEffect(() => {
// Exit early if countdown is finished
        if (seconds <= 0) {

            return finish();
        }

// Set up the timer
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);

// Clean up the timer
        return () => clearInterval(timer);
    }, [seconds]);

// Format the remaining time (e.g., “00:05:10” for 5 minutes and 10 seconds)
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60)
            .toString()
            .padStart(2, '0');
        const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <Card className={seconds / initialSeconds > 0.5 ? "bg-warning-subtle" : "bg-danger"} style={{display: "flex", justifyItems: "center", textAlign: "center"}}>
            <Card.Text as="h4" className="text-center">Time left: {formatTime(seconds)}</Card.Text>
            {reset}
        </Card>
    );
};

export default TimeCounter;
