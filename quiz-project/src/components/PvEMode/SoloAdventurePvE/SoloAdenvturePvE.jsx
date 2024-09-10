/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../appState/app.context";
import { onValue, ref } from "firebase/database";
import { db } from "../../../firebase/config";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { nextRoundSoloPvE } from "../../../services/room.service";
import TimeCounter from "../../../utills/TimeCounter";
import { toast } from "react-toastify";
import { updateUserCurrency } from "../../../services/user.service";

class Monster {
    hp;
    name;
    chanceToHit;
    constructor(name, hp = 5, chanceToHit = 80) {
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

export const SoloAdventure = ({
    roomId,
    setRoom
}) => {
    const [resetState, setResetState] = useState(true);
    const [answers, setAnswers] = useState({});
    const { userData } = useContext(AppContext);
    const [playerHP, setPlayerHP] = useState(3);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState();
    const [bossHP, setBossHP] = useState(boss.hp);
    const [room, setRoom1] = useState();
    const navigate = useNavigate();
    const [reset, setReset] = useState(false);

    useEffect(() => {
        if (userData) {
            const roomRef = ref(db, `room/${roomId}`);
            const unsubscribe = onValue(roomRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setRoom1(data);
                    setCurrentQuestionIndex(data.game.currentQuestion);
                    setAnswers(prevAnswers => ({
                        ...prevAnswers,
                        [data.game.currentQuestion]: prevAnswers[data.game.currentQuestion] || null
                    }));

                    if (data.game.finished) {
                        navigate('/game-over', { state: { room: data } });
                    }
                }
            });

            return () => unsubscribe();
        }
    }, [userData]);

    const handleAnswer = (selectedIndex) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [currentQuestionIndex]: selectedIndex
        }));
        setResetState(!resetState);
    };

    const submit = async (isTimeOver) => {
        if (room && currentQuestionIndex !== undefined) {
            
            
            if (isTimeOver) {
                console.log('Time is over, boss attacks');
                const bossAttack = boss.doDamage();
                if (bossAttack === 1) {
                    setPlayerHP(playerHP - 1);
                    // Trigger visual feedback for boss attack
                } else {
                    // Trigger visual feedback for missed attack
                }
            } else {
                const selectedAnswer = answers[currentQuestionIndex];
            

                if (selectedAnswer !== undefined && Object.values(room.questions[currentQuestionIndex].answers)[selectedAnswer]) {
                    toast.success('Correct!');
                    boss.takeDamage();
               
                    setBossHP(boss.hp); 
                } else {
                    console.log('Incorrect answer');
                    const bossAttack = boss.doDamage();
                    if (bossAttack === 1) {
                        setPlayerHP(playerHP - 1);
                        // Trigger visual feedback for boss attack
                    } else {
                        // Trigger visual feedback for missed attack
                    }
                }
            }

            if (boss.hp <= 0) {
                await updateUserCurrency(20, userData.uid);
                navigate('/victory-screen');
                return;
            }

            if (playerHP <= 0) {
                navigate('/defeat-screen');
                return;
            }

            const numberOfQuestions = room.questions.length;
            let nextQuestion = Math.floor(Math.random() * numberOfQuestions);
            while (nextQuestion === currentQuestionIndex) {
                nextQuestion = Math.floor(Math.random() * numberOfQuestions);
            }
            

            await nextRoundSoloPvE(roomId, room, nextQuestion);
            setCurrentQuestionIndex(nextQuestion);
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
                    {/* Player HP Display */}
                    <Col xs={12} className="mb-3">
                        <h2 className="player-hp">Player HP: <span className="text-danger">{playerHP}</span></h2>
                    </Col>

                    {/* Timer */}
                    <Col xs={12} className="mb-3">
                        <TimeCounter
                            initialSeconds={room.timePerRound}
                            reset={reset}
                            finish={finish}
                        />
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
                                    >
                                        {String.fromCharCode(65 + index)}. {answer}
                                    </button>
                                </Col>
                            ))}
                    </Row>

                    {/* Submit Button */}
                    <Col xs={12} className="mb-4">
                        <button className="btn btn-warning btn-lg" onClick={() => submit(false)}>
                            Submit Question
                        </button>
                    </Col>

                    {/* Boss HP Display */}
                    <Col xs={12} className="mb-3">
                        <h2 className="boss-hp">Boss HP: <span className="text-danger">{bossHP}</span></h2>
                    </Col>
                </Row>
            )}
        </>
    );
};