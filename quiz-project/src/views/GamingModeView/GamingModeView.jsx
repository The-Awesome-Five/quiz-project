import {Button, Container, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {CreateRoom} from "../../components/gamingComponents/roomComponents/CreateRoom.jsx";
import {toast} from "react-toastify";
import {CreateRoomPvE} from "../../components/PvEMode/CreatePvERoom/CreatePvERoom.jsx";

export const GamingModeView = () => {

    const [isCreateRoom, setIsCreateRoom] = useState(false);
    const [isJoinRoom, setIsJoinRoom] = useState(false);

    const [isCreateRoomPvE, setIsCreateRoomPvE] = useState(false);
    const [isJoinRoomPvE , setIsJoinRoomPvE] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [roomPVEId, setRoomPVEId] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = () => {

        if (roomId === '') {
            toast.error('Please enter a room ID');
        }

        navigate(`/room/${roomId}`);

    }

    const handleJoinRoomPvE = () => {

        if (roomPVEId === '') {
            toast.error('Please enter a room ID');
        }

        navigate(`/room-pve/${roomPVEId}`);

    }


    return (
        <Container className="d-flex flex-row align-items-center justify-content-center">
            <div className="card-container d-flex align-items-center ms-4">
                <div className="circle" style={{"--clr": "#00819b"}}>
                    <img
                        src="../../../../public/img/join-room-icon.png"
                        alt="Quiz Icon"
                        className="logo"
                    />
                </div>
                <div className="content text-start ms-4">

                    {isJoinRoom &&
                        <>
                            <h3 className="text-start mb-3">
                                <strong>Join a PVP game</strong>
                            </h3>
                            <p>to test your skills and friendship</p>

                            <input
                                type="text"
                                value={roomId}
                                className="input-id form-control pin-input ms-5 mt-3"
                                placeholder="Enter Room Id:"
                                onChange={(e) => setRoomId(e.target.value)}
                            />
                            <div className="d-flex flex-row">
                            <button
                                className="btn create-btn btn-info mt-2"
                                onClick={handleJoinRoom}
                            >
                                Join
                            </button>
                            <button
                                className="btn create-btn btn-info mt-2"
                                onClick={() => {
                                setIsJoinRoom(false);}
                                }
                            >
                                Back
                            </button>
                            </div>
                        </>
                    }
                    {!isCreateRoom && !isJoinRoom && <>
                        <button
                            className="btn create-btn btn-info mt-2"
                            onClick={() => {
                                setIsJoinRoom(true);
                                setIsCreateRoom(false)
                            }}
                        >
                            Join a PVP game
                        </button>
                        <button
                            className="btn create-btn btn-info mt-2"
                            onClick={() => {
                                setIsJoinRoom(false);
                                setIsCreateRoom(true)
                            }}
                        >
                            Create a PVP game
                        </button>
                    </>
                    }
                    {isCreateRoom &&
                        <CreateRoom setIsCreateRoom={setIsCreateRoom}/>
                    }

                </div>
                <img
                    src="../../../../public/img/pvp-icon.png"
                    alt="Brain Icon"
                    className="product_img ms-3"
                />
            </div>

            <div className="card-container d-flex align-items-center ms-4">
                <div className="circle" style={{"--clr": "#00819b"}}>
                    <img
                        src="/img/bot.svg"
                        alt="Quiz Icon"
                        className="logo"
                    />
                </div>
                <div className="content text-start ms-4">

                    {isJoinRoomPvE &&
                        <>
                            <h3 className="text-start mb-3">
                                <strong>Join a PVE game</strong>
                            </h3>
                            <p>to face the mighty AI</p>

                            <input
                                type="text"
                                value={roomPVEId}
                                className="input-id form-control pin-input ms-5 mt-3"
                                placeholder="Enter Room Id:"
                                onChange={(e) => setRoomPVEId(e.target.value)}
                            />
                            <div className="d-flex flex-row">
                                <button
                                    className="btn create-btn btn-info mt-2"
                                    onClick={handleJoinRoomPvE}
                                >
                                    Join
                                </button>
                                <button
                                    className="btn create-btn btn-info mt-2"
                                    onClick={() => {
                                        setIsJoinRoomPvE(false);
                                    }
                                    }
                                >
                                    Back
                                </button>
                            </div>
                        </>
                    }
                    {!isCreateRoomPvE && !isJoinRoomPvE && <>
                        <button
                            className="btn create-btn btn-info mt-2"
                            onClick={() => {
                                setIsJoinRoomPvE(true);
                                setIsCreateRoomPvE(false)
                            }}
                        >
                            Join a PVE game
                        </button>
                        <button
                            className="btn create-btn btn-info mt-2"
                            onClick={() => {
                                setIsJoinRoomPvE(false);
                                setIsCreateRoomPvE(true)
                            }}
                        >
                            Create a PVE game
                        </button>
                    </>
                    }
                    {isCreateRoomPvE &&
                        <CreateRoomPvE setIsCreateRoomPvE={setIsCreateRoomPvE}></CreateRoomPvE>
                    }

                </div>
                <img
                    src="../../../../public/img/pvp-icon.png"
                    alt="Brain Icon"
                    className="product_img ms-3"
                />
            </div>

        </Container>
    )

    /*return (
        <Container>
            {!isCreateRoom && !isJoinRoom &&
                <>
                    <Button onClick={() => {
                        setIsJoinRoom(true);
                        setIsCreateRoom(false);
                    }}>Join Game</Button>
                    <Button onClick={() => {
                        setIsJoinRoom(false);
                        setIsCreateRoom(true);
                    }}>Create Game</Button>
                </>
            }

            {isCreateRoom && <>
                <CreateRoom/>
                <Button onClick={() => setIsCreateRoom(false)}>Cancel</Button></>}


            {isJoinRoom && <>
            <Form onSubmit={handleJoinRoom}>

                <Form.Group controlId="formName">
                    <Form.Label>Room ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="roomId"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter room id"
                    />
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form.Group>
            </Form>
            </>}


                <hr/>
            {!isCreateRoomPvE && !isJoinRoomPvE &&
                <>
                    <Button onClick={() => {
                        setIsJoinRoomPvE(true);
                        setIsCreateRoomPvE(false);
                    }}>Join Game</Button>
                    <Button onClick={() => {
                        setIsJoinRoomPvE(false);
                        setIsCreateRoomPvE(true);
                    }}>Create Game</Button>
                </>
            }

            {isCreateRoomPvE && <>
                <CreateRoomPvE/>
                <Button onClick={() => setIsCreateRoomPvE(false)}>Cancel</Button></>}


            {isJoinRoomPvE && <>
            <Form onSubmit={handleJoinRoomPvE}>

                <Form.Group controlId="formName">
                    <Form.Label>Room ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="roomId"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter room id"
                    />
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form.Group>
            </Form>
            </>}
        </Container>
    )*/
}
