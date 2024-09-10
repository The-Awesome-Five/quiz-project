import React, {useState} from 'react';
import {Form, Button} from 'react-bootstrap';
import {createRoom} from "../../../services/room.service.js";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export const CreateRoom = ({
                               setIsCreateRoom
                           }) => {

    const [room, setRoom] = useState({
        name: '',
        players: [],
        category: 'science',
        difficulty: 'easy',
        timePerRound: ''
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setRoom({...room, [name]: value ? value : ''});
    };

    const createRoomHandler = async (e) => {

        e.preventDefault()

        if (Object.values(room).some(x => x === null || x === '')) {
            return toast.error('Please fill out all fields');
        }

        try {
            const roomId = await createRoom(room);

            if (roomId) {
                toast.success('Room created:', roomId);
                navigate(`/room/${roomId}`);
            }

        } catch (e) {
            toast.error(e.message);
        }


    }

    return (

        <Form onSubmit={createRoomHandler}>

            <Form.Group controlId="formName">
                <Form.Control
                    type="text"
                    name="name"
                    value={room.name}
                    onChange={handleInputChange}
                    placeholder="Enter room name"
                />
            </Form.Group>

            <Form.Group controlId="formCategory">
                <Form.Control
                    as="select"
                    name="category"
                    value={room.category}
                    onChange={handleInputChange}
                    placeholder="Select category"
                >
                    <option>Science</option>
                    <option>Math</option>
                    <option>History</option>
                </Form.Control>
            </Form.Group>


            <Form.Group controlId="formDifficulty">
                <Form.Control
                    as="select"
                    name="difficulty"
                    value={room.difficulty}
                    onChange={handleInputChange}
                    placeholder="Select difficulty"
                >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                </Form.Control>
            </Form.Group>


            <Form.Group controlId="formTimePerRound">
                <Form.Control
                    type="number"
                    name="timePerRound"
                    value={room.timePerRound}
                    onChange={handleInputChange}
                    placeholder="Enter minutes per round"
                />
            </Form.Group>

            <div className="d-flex flex-row align-items-center">
                <button
                    className="btn create-btn btn-info m-auto"
                    type="submit"
                >
                    Submit
                </button>
                <button
                    className="btn create-btn btn-info mt-auto"
                    onClick={() => setIsCreateRoom(false)}
                >
                    Cancel
                </button>

            </div>
        </Form>
    );
};
