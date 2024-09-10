/* eslint-disable react/react-in-jsx-scope */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../appState/app.context";
import { onValue, ref } from "firebase/database";
import { db } from "../../../firebase/config";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { endGameCoOp, nextRoundCoOpPvE } from "../../../services/room.service";
import TimeCounter from "../../../utills/TimeCounter";
import { toast } from "react-toastify";
import { updateUserCurrency } from "../../../services/user.service";

class Monster {
    hp;
    name;
    chanceToHit;
    constructor(name, hp = 10, chanceToHit = 80) {
        this.hp = hp;
        this.chanceToHit = chanceToHit;
        this.name = name;
    }

    takeDamage() {
        this.hp -= 1;
        if (this.hp <= 0) {
            this.defeat();
        }
    }

    defeat() {
        return 'I have been defeated! Oh no!';
    }

    doDamage() {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        return randomNumber > this.chanceToHit ? 'Miss' : 1;
    }
}

const boss = new Monster('Pesho');

export const CoOpAdventure = ({ roomId }) => {
    const [resetState, setResetState] = useState(true);
    const [answers, setAnswers] = useState({});
    const { userData } = useContext(AppContext);
    const [totalPlayerHP, setTotalPlayerHP] = useState(6); 
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState();
    const [bossHP, setBossHP] = useState(boss.hp);
    const [room, setRoom1] = useState();
    const [reset, setReset] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
            const roomRef = ref(db, `room/${roomId}`);
            const unsubscribe = onValue(roomRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setRoom1(data);
                    setCurrentQuestionIndex(data.game.currentQuestion);
                    setTotalPlayerHP(data.game.playerHP)
                    setBossHP(data.game.bossHP)
                    setAnswers((prevAnswers) => ({
                        ...prevAnswers,
                        [data.game.currentQuestion]: prevAnswers[data.game.currentQuestion] || null,
                    }));

                    
                    if (data.game.bossHP <=1) {
                        const endGameWin = async()=>{
                        await endGameCoOp(roomId, 'win')
                        }
                       
                        endGameWin();
                        return;
                    }
            
                    if (data.game.playerHP <=1) {
                        const endGame = async () =>{
                            await endGameCoOp(roomId, 'lose')
                        }
                        endGame()
                        
                        return;
                    }

                    if(data.game?.finished=== 'lose')
                    {
                        navigate('/defeat-screen')
                    }
                    if(data.game?.finished=== 'win')
                        {
                            const navigation = async ()=>{
                            await updateUserCurrency(20, userData.uid);
                            navigate("/victory-screen");}
                            navigation();
                        }
                    setReset(!reset);
                }
            });

            return () => unsubscribe();
        }
    }, [userData]);

    const handleAnswer = (selectedIndex) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [currentQuestionIndex]: selectedIndex,
        }));
        setResetState(!resetState);
    };

    const submit = async (isTimeOver) => {
        let takingDamage = false; // Initialize as false
    
        if (room && currentQuestionIndex !== undefined) {
            const currentPlayer = userData.uid;
            
            if (isTimeOver) {
                const bossAttack = boss.doDamage();
                if (bossAttack === 1) {
                    takingDamage = true; // Set flag when damage occurs
                }
            } else {
                const selectedAnswer = answers[currentQuestionIndex];
                if (selectedAnswer !== undefined && Object.values(room.questions[currentQuestionIndex].answers)[selectedAnswer]) {
                    toast.success('Correct!');
                    boss.takeDamage();
                    
                } else {
                    console.log('Incorrect answer');
                    const bossAttack = boss.doDamage();
                    console.log(bossAttack);
                    if (bossAttack === 1) {
                        takingDamage = true; 
                        // Trigger visual feedback for boss attack
                    } else {
                        // Trigger visual feedback for missed attack
                    }
                }
            }
    
            if (boss.hp < 1) {
                await updateUserCurrency(20, userData.uid);
                navigate('/victory-screen');
                return;
            }
    
            if (totalPlayerHP < 1) {
                navigate('/defeat-screen');
                return;
            }
    
            const numberOfQuestions = room.questions.length;
            let nextQuestion = Math.floor(Math.random() * numberOfQuestions);
            while (nextQuestion === currentQuestionIndex) {
                nextQuestion = Math.floor(Math.random() * numberOfQuestions);
            }
    
            console.log('Flag for Flag');
            console.log(takingDamage); // Verify flag value here
    
            await nextRoundCoOpPvE(roomId, nextQuestion, takingDamage);
            setCurrentQuestionIndex(nextQuestion);
            setAnswers({});
            setReset(!reset);
        }
    };
    

    const finish = (isTimeOver) => {
        submit(isTimeOver);
    };

    return (
        <>
            {userData && room && (
                <Row className="game-container py-5 justify-content-center text-center">
                    {/* Total Player HP */}
                    <Col xs={12} className="mb-3">
                        <h2 className="player-hp">Total Player HP: <span className="text-danger">{totalPlayerHP}</span></h2>
                    </Col>

                    {/* Current Player Turn */}
                    <Col xs={12} className="mb-3">
                        <h3 className="current-player">It's {room.game.nextPlayer === userData.uid ? 'your' : 'the other player\'s'} turn!</h3>
                    </Col>

                    {/* Timer */}
                    <Col xs={12} className="mb-3">
                        <TimeCounter initialSeconds={room.timePerRound} reset={reset} finish={finish} />
                    </Col>

                    {/* Current Question */}
                    <Col xs={12} className="mb-4">
                        <h2 className="question-text">{room?.questions[currentQuestionIndex]?.question}</h2>
                    </Col>

                    {/* Answer Buttons */}
                    <Row className="answers-grid justify-content-center mb-4">
                        {room.questions[currentQuestionIndex]?.answers &&
                            Object.keys(room.questions[currentQuestionIndex]?.answers).map((answer, index) => (
                                <Col xs={12} md={6} key={index} className="mb-3">
                                    <button
                                        className={`answer-btn btn btn-lg ${
                                            answers[currentQuestionIndex] === index ? "btn-primary" : "btn-success"
                                        }`}
                                        onClick={() => handleAnswer(index)}
                                        disabled={userData.uid !== room.game.nextPlayer} 
                                    >
                                        {String.fromCharCode(65 + index)}. {answer}
                                    </button>
                                </Col>
                            ))}
                    </Row>

                    {/* Submit Button */}
                    {userData.uid === room.game.nextPlayer && (
                        <Col xs={12} className="mb-4">
                            <button className="btn btn-warning btn-lg" onClick={() => finish(false)}>
                                Submit Answer
                            </button>
                        </Col>
                    )}

                    {/* Boss HP */}
                    <Col xs={12} className="mb-3">
                        <h2 className="boss-hp">Boss HP: <span className="text-danger">{bossHP}</span></h2>
                    </Col>
                </Row>
            )}
        </>
    );
};