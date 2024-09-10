import React, { useState } from 'react';
import { addItemsToShop } from '../../../services/shop.service'; // Import the service
import { uploadImage } from '../../../services/storage.service'; // Import the image upload service
import { toast } from 'react-toastify';
import { Form, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminShopItem = () => {
  const [itemData, setItemData] = useState({
    name: '',
    type: 'head', // Default type
    description: '',
    price: '',
    image: '',
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === 'image') {
      value = e.target.files[0];
    }

    setItemData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // First, upload the image to Firebase Storage
      const imageUrl = await uploadImage(itemData.image, itemData.name);
      itemData.image = imageUrl;
      // Now, add the item to Firebase Realtime Database with the image URL
      await addItemsToShop(itemData); // Call your service
      toast.error('Item successfully added');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Add Shop Item</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="itemName" className="mb-3">
          <Form.Label>Item Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter item name"
            value={itemData.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="itemType" className="mb-3">
          <Form.Label>Item Type</Form.Label>
          <Form.Select
            name="type"
            defaultValue={itemData.type}
            onChange={handleInputChange}
            required
          >
            <option selected value="head">Head</option>
            <option value="torso">Torso</option>
            <option value="legs">Legs</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="itemDescription" className="mb-3">
          <Form.Label>Item Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            placeholder="Enter item description"
            value={itemData.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="itemPrice" className="mb-3">
          <Form.Label>Item Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            placeholder="Enter item price"
            value={itemData.price}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="itemImage" className="mb-3">
          <Form.Label>Item Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            accept="image/*"
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Item
        </Button>
      </Form>
    </Container>
  );
};

export default AdminShopItem;
