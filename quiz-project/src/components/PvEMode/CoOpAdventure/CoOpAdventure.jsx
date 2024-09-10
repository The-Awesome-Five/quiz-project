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
import "./CoOpAdventure.css";

class Monster {
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
        return "I have been defeated! Oh no!";
    }

    doDamage() {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        return randomNumber > this.chanceToHit ? "Miss" : 1;
    }
}

const boss = new Monster("Pesho");

export const CoOpAdventure = ({ roomId }) => {
    const [resetState, setResetState] = useState(true);
    const [answers, setAnswers] = useState({});
    const { userData } = useContext(AppContext);
    const [totalPlayerHP, setTotalPlayerHP] = useState(6); 
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState();
    const [bossHP, setBossHP] = useState(boss.hp);
    const [room, setRoom1] = useState();
    const [reset, setReset] = useState(false);
    const [player1Data, setPlayer1Data] = useState(null); // Player 1 data
    const [player2Data, setPlayer2Data] = useState(null); // Player 2 data
    const [bossHitAnimation, setBossHitAnimation] = useState(false);
    const [bossMissAnimation, setBossMissAnimation] = useState(false);
    const [userHitAnimation, setUserHitAnimation] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
            const roomRef = ref(db, `room/${roomId}`);
            const unsubscribe = onValue(roomRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setRoom1(data);
                    setCurrentQuestionIndex(data.game.currentQuestion);
                    setTotalPlayerHP(data.game.playerHP);
                    setBossHP(data.game.bossHP);
                    setPlayer1Data(data.players[0]);
                    setPlayer2Data(data.players[1]);
                    setAnswers((prevAnswers) => ({
                        ...prevAnswers,
                        [data.game.currentQuestion]: prevAnswers[data.game.currentQuestion] || null,
                    }));

                    
                   

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

    const handleBossAttack = () => {
        const bossAttack = boss.doDamage();
        if (bossAttack === 1) {
            setTotalPlayerHP((prevHP) => prevHP - 1);
           
            setBossHitAnimation(true);
            setTimeout(() => {
                setBossHitAnimation(false);
            }, 1000); 
        } else {
          
            setBossMissAnimation(true);
            setTimeout(() => {
                setBossMissAnimation(false);
            }, 1000);
        }
    };

    const handleAnswer = (selectedIndex) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [currentQuestionIndex]: selectedIndex,
        }));
        setResetState(!resetState);
    };

    const submit = async (isTimeOver) => {
        let takingDamage = false;

        if (room && currentQuestionIndex !== undefined) {
            if (isTimeOver) {
                console.log("Time is over, boss attacks");
                handleBossAttack();
            } else {
                const selectedAnswer = answers[currentQuestionIndex];
                if (selectedAnswer !== undefined && Object.values(room.questions[currentQuestionIndex].answers)[selectedAnswer]) {
                    
                    boss.takeDamage();
                    setBossHP(boss.hp);
                    setUserHitAnimation(true);
                    setTimeout(() => {
                        setUserHitAnimation(false);
                    }, 1000);
                } else {
                    console.log("Incorrect answer");
                    handleBossAttack();
                }
            }

            if (boss.hp < 1) {
                await updateUserCurrency(20, userData.uid);
                navigate("/victory-screen");
                return;
            }

            if (totalPlayerHP < 1) {
                navigate("/defeat-screen");
                return;
            }

            const numberOfQuestions = room.questions.length;
            let nextQuestion = Math.floor(Math.random() * numberOfQuestions);
            while (nextQuestion === currentQuestionIndex) {
                nextQuestion = Math.floor(Math.random() * numberOfQuestions);
            }

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
                    {/* Boss Attack Animation */}
                    {bossHitAnimation && (
                        <div className="boss-hit-animation">Boss hits!</div>
                    )}

                    {bossMissAnimation && (
                        <div className="boss-miss-animation">Boss misses!</div>
                    )}

                    {userHitAnimation && (
                        <div className="user-hit-animation">Correct!</div>
                    )}

                    {/* Current Player Turn */}
                    <Col xs={12} className="">
                        <h3 className="current-player">
                            It's {room.game.nextPlayer === userData.uid ? "your" : "the other player's"} turn!
                        </h3>
                    </Col>

                    {/* Timer */}
                    <Col xs={12} className="">
                        <TimeCounter initialSeconds={room.timePerRound} reset={reset} finish={finish} />
                    </Col>

                    {/* Player 1 Visualization */}
                    <Col xs={12} md={4} className="player-box mb-4">
                        {/* Total Player HP */}
                        <Col xs={12} className="">
                            <h2 className="player-hp">Total Players HP:</h2>
                            {/* HP Bar for Total Players */}
                            <div className="progress player-hp-bar">
                                <div
                                    className={`progress-bar ${totalPlayerHP <= 1 ? "bg-danger" : "bg-success"}`}
                                    role="progressbar"
                                    style={{ width: `${(totalPlayerHP / 6) * 100}%` }}  
                                    aria-valuenow={totalPlayerHP}
                                    aria-valuemin="0"
                                    aria-valuemax="6"
                                >
                                    {totalPlayerHP} / 6
                                </div>
                            </div>
                        </Col>

                        <div className="hero-customization">
                            <img
                                src={"/img/main-charackter.png"}
                                alt="Main Body"
                                className="hero-image base-body"
                            />
                            {player1Data?.selectedHeadItem && (
                                <img
                                    src={player1Data.selectedHeadItem}
                                    alt="Head Armor"
                                    className="hero-image overlay-head"
                                />
                            )}
                            {player1Data?.selectedTorsoItem && (
                                <img
                                    src={player1Data.selectedTorsoItem}
                                    alt="Torso Armor"
                                    className="hero-image overlay-torso"
                                />
                            )}
                            {player1Data?.selectedLegsItem && (
                                <img
                                    src={player1Data.selectedLegsItem}
                                    alt="Leg Armor"
                                    className="hero-image overlay-legs"
                                />
                            )}
                        </div>
                    </Col>

                    {/* Player 2 Visualization */}
                    <Col xs={12} md={4} className="player-box">
                        <div className="hero-customization">
                            <img
                                src={"/img/main-charackter.png"}
                                alt="Main Body"
                                className="hero-image base-body"
                            />
                            {player2Data?.selectedHeadItem && (
                                <img
                                    src={player2Data.selectedHeadItem}
                                    alt="Head Armor"
                                    className="hero-image overlay-head"
                                />
                            )}
                            {player2Data?.selectedTorsoItem && (
                                <img
                                    src={player2Data.selectedTorsoItem}
                                    alt="Torso Armor"
                                    className="hero-image overlay-torso"
                                />
                            )}
                            {player2Data?.selectedLegsItem && (
                                <img
                                    src={player2Data.selectedLegsItem}
                                    alt="Leg Armor"
                                    className="hero-image overlay-legs"
                                />
                            )}
                        </div>
                    </Col>

                    {/* Boss Image */}
                    <Col xs={12} md={4} className="">
                        <div className="boss-container">
                            <Col xs={12} className="mb-3">
                                <h2 className="boss-hp">Boss HP:</h2>
                                <div className="progress boss-hp-bar">
                                    <div
                                        className={`progress-bar ${bossHP <= 1 ? "bg-danger" : "bg-success"}`}
                                        role="progressbar"
                                        style={{ width: `${(bossHP / 10) * 100}%` }}
                                        aria-valuenow={bossHP}
                                        aria-valuemin="0"
                                        aria-valuemax="10"
                                    >
                                        {bossHP} / 10
                                    </div>
                                </div>
                            </Col>

                            <img src="/img/boss.png" alt="Boss Avatar" className="boss-img" />
                        </div>
                    </Col>

                    {/* Current Question */}
                    <Col xs={12} className="mb-4 justify-content-center text-center">
                        <h2 className="question-text text-center">
                            {room?.questions[currentQuestionIndex]?.question}
                        </h2>
                    </Col>

                    {/* Answer Buttons */}
                    <Row className="answers-grid justify-content-center align-items-center text-center mb-4">
                        {room.questions[currentQuestionIndex]?.answers &&
                            Object.keys(room.questions[currentQuestionIndex]?.answers).map((answer, index) => (
                                <Col xs={12} md={6} key={index} className="answer-btn-box mb-3">
                                    <button
                                        className={`answer-btn btn btn-lg ${answers[currentQuestionIndex] === index ? "btn-primary btn-1" : "btn-success btn-2"}`}
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
                </Row>
            )}
        </>
    );
};
