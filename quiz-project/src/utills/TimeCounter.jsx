import React, { useState, useEffect } from 'react'
import {Container, Card} from "react-bootstrap";

const TimeCounter = ({ initialSeconds, finish }) => {
    const [seconds, setSeconds] = useState(initialSeconds);

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
        <Card style={{display: "flex", justifyItems: "center", textAlign: "center"}}>
            <Card.Title as="h4" className="text-center">Timer</Card.Title>
            <Card.Text as="h4" className="text-center">{formatTime(seconds)}</Card.Text>
        </Card>
    );
};

export default TimeCounter;
