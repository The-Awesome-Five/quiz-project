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
import "./SoloAdventurePvE.css";


class Monster {
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
    return "I have been defeated! Oh no!";
  }

  doDamage() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    return randomNumber > this.chanceToHit ? "Miss" : 1;
  }
}

const boss = new Monster("Pesho");


export const SoloAdventure = ({ roomId, setRoom }) => {
  const [resetState, setResetState] = useState(true);
  const [answers, setAnswers] = useState({});
  const { userData } = useContext(AppContext);
  const [playerHP, setPlayerHP] = useState(3);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState();
  const [bossHP, setBossHP] = useState(boss.hp);
  const [room, setRoom1] = useState();
  const navigate = useNavigate();
  const [reset, setReset] = useState(false);
  const [playerData, setPlayerData] = useState(null); // To store player armor and items
  const [bossHitAnimation, setBossHitAnimation] = useState(false);
  const [bossMissAnimation, setBossMissAnimation] = useState(false);
  const [userHitAnimation, setUserAnimation] = useState(false);
  const resetBossHP = () => {
    boss.hp = 5; 
    setBossHP(boss.hp);
  };

  useEffect(() => {
    if (userData) {
      resetBossHP();
      const roomRef = ref(db, `room/${roomId}`);
      const unsubscribe = onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setRoom1(data);
          setCurrentQuestionIndex(data.game.currentQuestion);
          setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [data.game.currentQuestion]:
              prevAnswers[data.game.currentQuestion] || null,
          }));

   
          setPlayerData(userData);

          if (data.game.finished) {
            navigate("/game-over", { state: { room: data } });
          }
        }
      });

      return () => unsubscribe();
    }
  }, [userData]);

  const handleBossAttack = () => {
    const bossAttack = boss.doDamage();
    if (bossAttack === 1) {
      setPlayerHP(playerHP - 1);
      toast.error("Boss hits!");

      
      setBossHitAnimation(true);
      setTimeout(() => {
        setBossHitAnimation(false);
      }, 1000); 
    } else {
      toast.info("Boss misses!");

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
    if (room && currentQuestionIndex !== undefined) {
      if (isTimeOver) {
        console.log("Time is over, boss attacks");
        handleBossAttack();
      } else {
        const selectedAnswer = answers[currentQuestionIndex];
        if (
          selectedAnswer !== undefined &&
          Object.values(room.questions[currentQuestionIndex].answers)[
            selectedAnswer
          ]
        ) {
          toast.success("Correct!");
          setUserAnimation(true);
          setTimeout(() => {
            setUserAnimation(false);
          }, 1000);
          boss.takeDamage();
          setBossHP(boss.hp);
        } else {
          console.log("Incorrect answer");
          handleBossAttack(); 
        }
      }

      if (bossHP <= 1) {
        await updateUserCurrency(20, userData.uid);
        navigate("/victory-screen");
        return;
      }

      if (playerHP <=1) {
        navigate("/defeat-screen");
        return;
      }

      const numberOfQuestions = room.questions.length;
      let nextQuestion = Math.floor(Math.random() * numberOfQuestions);
      while (nextQuestion === currentQuestionIndex) {
        nextQuestion = Math.floor(Math.random() * numberOfQuestions);
      }

      await nextRoundSoloPvE(roomId, room, nextQuestion);
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
            <div className="boss-miss-animation">Boss miss!</div>
          )}

          {userHitAnimation && (
            <div className="user-hit-animation">Correct!</div>
          )}

          {/* Timer */}
          <Col xs={12} className="mb-1">
            <TimeCounter
              initialSeconds={room.timePerRound}
              reset={reset}
              finish={finish}
            />
          </Col>

          <Col>
            {/* Player HP Display */}
            <Col xs={12} className="pl-hp mb-3">
              <h2 className="player-hp">Player HP:</h2>
              <div className="progress player-hp-bar">
                <div
                  className={`progress-bar ${
                    playerHP <= 1 ? "bg-danger" : "bg-success"
                  }`}
                  role="progressbar"
                  style={{ width: `${(playerHP / 3) * 100}%` }}
                  aria-valuenow={playerHP}
                  aria-valuemin="0"
                  aria-valuemax="3"
                >
                  {playerHP} / 3
                </div>
              </div>
            </Col>

            {/* Player Image and Armor */}
            <Col xs={12} md={4} className="player-box mb-4">
              <div className="hero-customization">
                {/* Основно тяло на героя */}
                <img
                  src={"/img/main-charackter.png"}
                  alt="Main Body"
                  className="hero-image base-body"
                />

                {/* Display the player's armor */}
                {playerData?.selectedHeadItem && (
                  <img
                    src={playerData.selectedHeadItem}
                    alt="Head Armor"
                    className="hero-image overlay-head"
                  />
                )}
                {playerData?.selectedTorsoItem && (
                  <img
                    src={playerData.selectedTorsoItem}
                    alt="Torso Armor"
                    className="hero-image overlay-torso"
                  />
                )}
                {playerData?.selectedLegsItem && (
                  <img
                    src={playerData.selectedLegsItem}
                    alt="Leg Armor"
                    className="hero-image overlay-legs"
                  />
                )}
              </div>
            </Col>
          </Col>

          {/* Boss Image */}
          <Col xs={12} md={4} className="mb-4">
            <div className="boss-container">
              {/* Boss HP Display */}
              <Col xs={12} className="mb-3">
                <h2 className="boss-hp">Boss HP:</h2>
                <div className="progress boss-hp-bar">
                  <div
                    className={`progress-bar ${
                      bossHP <= 1 ? "bg-danger" : "bg-success"
                    }`}
                    role="progressbar"
                    style={{ width: `${(bossHP / 5) * 100}%` }}
                    aria-valuenow={bossHP}
                    aria-valuemin="0"
                    aria-valuemax="5"
                  >
                    {bossHP} / 5
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
              Object.keys(room.questions[currentQuestionIndex]?.answers).map(
                (answer, index) => (
                  <Col xs={12} md={6} key={index} className=" answer-btn-box mb-3">
                    <button
                      className={`answer-btn btn btn-lg ${
                        answers[currentQuestionIndex] === index
                          ? "btn-primary btn-1"
                          : "btn-success btn-2"
                      }`}
                      onClick={() => handleAnswer(index)}
                    >
                      {String.fromCharCode(65 + index)}. {answer}
                    </button>
                  </Col>
                )
              )}
          </Row>

          {/* Submit Button */}
          <Col xs={12} className="mb-4">
            <button
              className="btn btn-warning btn-lg"
              onClick={() => submit(false)}
            >
              Submit Question
            </button>
          </Col>
        </Row>
      )}
    </>
  );
};
