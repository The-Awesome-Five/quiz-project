import {Container, ListGroup} from "react-bootstrap";
import {useEffect, useState} from "react";

import {toast} from "react-toastify";
import React from "react";
import {getAllQuizzes} from "../../../../services/quiz.service.js";
import {
    AdminQuizItem
} from "../../../../components/adminComponents/AdminQuizManagement/AdminQuizItem/AdminQuizItem.jsx";
import {AdminQuizHeader} from "../../../../components/adminComponents/AdminQuizManagement/AdminQuizHeader.jsx";

export const AdminQuizMenuView = () => {

    const [quizData, setQuizData] = useState([]);

    const [editQuizId, setEditQuizId] = useState(null);

    useEffect(() => {

        const fetchQuizzes = async () => {
            const quizzes = await getAllQuizzes();
            setQuizData(prevState => [...prevState, ...quizzes]);
            console.log(quizData);
        }

        try {
            fetchQuizzes();
        } catch (e) {
            toast.error(e);
        }

    }, []);

    const handleEditClick = (quizId) => {
        setEditQuizId(quizId);
    };

    const handleInputChange = (e, quizId, field) => {
        const newQuizData = quizData.map(quiz => {
            if (quiz.id === quizId) {
                return {...quiz, [field]: e.target.value};
            }
            return quiz;
        });
        setQuizData(newQuizData);
    };

    const handleSave = async (quizId) => {

        const quizToBeEdited = quizData.filter(quiz => quiz.uid === quizId)[0];

        setEditQuizId(null);

        try {
            await editQuizById(quizId, quizToBeEdited);
        } catch (e) {
            toast.error(e)
        }
    };

    return (
        <Container>
            <ListGroup>
                <AdminQuizHeader/>
                {quizData.map((quiz) => (
                    <AdminQuizItem key={quiz.id} quiz={quiz} editQuizId={editQuizId} handleInputChange={handleInputChange}
                                   handleSave={handleSave} handleEditClick={handleEditClick}/>
                ))}
            </ListGroup>
        </Container>
    )
}
