import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import {createRoom} from "../../../services/room.service.js";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export const CreateRoom = () => {

    const [room, setRoom] = useState({
        name: '',
        players: [],
        category: 'science',
        difficulty: 'easy',
        timePerRound: ''
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoom({ ...room, [name]: typeof value === 'string' ? value.toLowerCase() : value });
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
            } else {
                toast.error('Failed to create room');

            }


        } catch (e) {
            toast.error('Failed to create room:', e);
        }


    }

        return (

            <Form onSubmit={createRoomHandler}>

                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={room.name}
                        onChange={handleInputChange}
                        placeholder="Enter room name"
                    />
                </Form.Group>

            <Form.Group controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                    as="select"
                    name="category"
                    value={room.category}
                    onChange={handleInputChange}
                >
                    <option>Science</option>
                    <option>Math</option>
                    <option>History</option>
                </Form.Control>
            </Form.Group>


            <Form.Group controlId="formDifficulty">
                <Form.Label>Difficulty</Form.Label>
                <Form.Control
                    as="select"
                    name="difficulty"
                    value={room.difficulty}
                    onChange={handleInputChange}
                >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>High</option>
                </Form.Control>
            </Form.Group>


            <Form.Group controlId="formTimePerRound">
                <Form.Label>Time per Round (minutes)</Form.Label>
                <Form.Control
                    type="number"
                    name="timePerRound"
                    value={room.timePerRound}
                    onChange={handleInputChange}
                    placeholder="Enter time per round"
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};
