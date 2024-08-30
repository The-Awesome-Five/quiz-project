import {React, useEffect, useState} from "react";
import {toast} from "react-toastify";
// import {getAllQuestionBanks, getAllQuestionFromBank} from "../../../../services/quizBank.service.js";
import {Col, Container, Row} from "react-bootstrap";
import {loginUser} from "../../../../services/auth.service.js";
import {
    AdminQuestionItem
} from "../../../../components/adminComponents/AdminQuestionManagement/AdminQuestionItem/AdminQuestionItem.jsx";

export const AdminQuestionBankView = () => {


    const [questions, setQuestions] = useState([]);

    // useEffect(() => {

    //     const fetchAllQuestionFromBank = async () => {
    //         try {

    //             const questionBank = await getAllQuestionBanks();

    //             setQuestions(questionBank);

    //         } catch (e) {
    //             toast.error(e);
    //         }
    //     }

    //     fetchAllQuestionFromBank();

    // }, []);

    console.log(questions)

    return (
        <Container>
            <Row>
                {
                    questions.map(([accessId, access]) => {
                        return (
                            <Row key={accessId}>
                                <h1>{accessId}</h1>
                                {accessId === 'organization' ?
                                    Object.entries(access).map(([orgId, organization]) => {

                                        return (<div>
                                            <h2>{orgId}</h2>

                                            {Object.entries(organization).map(([categoryId, category]) =>
                                                Object.entries(category).map(([diffId, difficulty]) =>
                                                    Object.entries(difficulty).map(([questionId, question]) => {
                                                        return <AdminQuestionItem
                                                            question={question}
                                                            orgId={orgId}
                                                            categoryId={categoryId}
                                                            diffId={diffId}
                                                        />
                                                    })))
                                            }</div>)
                                    })
                                    : Object.entries(access).map(([categoryId, category]) =>
                                        Object.entries(category).map(([diffId, difficulty]) =>
                                            Object.entries(difficulty).map(([questionId, question]) => {
                                                    return <AdminQuestionItem
                                                        question={question}
                                                        categoryId={categoryId}
                                                        diffId={diffId}
                                                    />
                                                }
                                            )))}
                            </Row>
                        )
                    })
                }
            </Row>
        </Container>
    )

}
