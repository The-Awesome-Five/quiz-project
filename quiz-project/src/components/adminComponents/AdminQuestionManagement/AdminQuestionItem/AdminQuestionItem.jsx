import {Col, Row} from "react-bootstrap";

export const AdminQuestionItem = ({question}) => {


    return (
        <Row>
        <Col className="border">{question.question}</Col>
            {Object.entries(question.answers).map(([answer, isCorrect]) => {
                return (
                    <Col style={isCorrect ? {background: 'green'}
                    : {background: 'red'}}>{answer}</Col>
                )
            })}
        </Row>
    )

}
