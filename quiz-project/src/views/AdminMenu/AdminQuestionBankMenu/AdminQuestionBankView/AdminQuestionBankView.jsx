import {React, useEffect, useState} from "react";
import {toast} from "react-toastify";
// import {getAllQuestionBanks, getAllQuestionFromBank} from "../../../../services/quizBank.service.js";
import {Col, Container, Row} from "react-bootstrap";
import {loginUser} from "../../../../services/auth.service.js";
import {
    AdminQuestionItem
} from "../../../../components/adminComponents/AdminQuestionManagement/AdminQuestionItem/AdminQuestionItem.jsx";
import {getAllQuestionBanks} from "../../../../services/quizBank.service.js";

export const AdminQuestionBankView = () => {


    const [questions, setQuestions] = useState([]);

    useEffect(() => {

        const fetchAllQuestionFromBank = async () => {
            try {

                const questionBank = await getAllQuestionBanks();

                setQuestions(questionBank);

            } catch (e) {
                toast.error(e);
            }
        }

        fetchAllQuestionFromBank();

    }, []);

    console.log(questions)

    return (
        <Container>
            <Row>
                {
                    questions.map(question => {
                        return (
                            <Row key={question.id}>
                               <AdminQuestionItem question={question} />
                            </Row>
                        )
                    })
                }
            </Row>
        </Container>
    )

}
