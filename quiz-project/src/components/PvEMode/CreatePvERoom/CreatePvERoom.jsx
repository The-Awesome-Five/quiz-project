import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import { createRoomPvE } from '../../../services/room.service';

export const CreateRoomPvE = () => {

    const [room, setRoom] = useState({
        name: '',
        players: [],
        category: 'science',
        timePerRound: '30'
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRoom({ ...room, [name]: value ? value : '' });
    };

    const createRoomHandler = async (e) => {

        e.preventDefault()

        if (Object.values(room).some(x => x === null || x === '')) {
         return toast.error('Please fill out all fields');
        }

        try {
            const roomId = await createRoomPvE(room);

            if (roomId) {
                toast.success('Room created:', roomId);
                navigate(`/room-pve/${roomId}`);
            }

        } catch (e) {
            toast.error(e.message);
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



            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};
