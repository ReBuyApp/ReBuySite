import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import firebaseConfig from "./Config";
import { AuthContext } from "./Auth";
import api from "../../API/API";
import { Form, Col, Row, Button } from "react-bootstrap";

export default function SignUp({ setRegistered }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, email, password } = e.target.elements;

    try {
      console.log(name.value + phone.value + email.value);
      let data = new FormData();
      data.append("name", name.value);
      data.append("phone", phone.value);
      data.append("email", email.value);

      await api
        .insertUser(data)
        .then((res) => {
          window.alert(`User inserted successfully`);
          firebaseConfig
            .auth()
            .createUserWithEmailAndPassword(email.value, password.value);
        })
        .catch((error) => {
          console.log(error);
          alert(error);
        });
    } catch (error) {
      alert(error);
    }
    // const createUser = async () => {

    // }
  };

  const { currentUser } = useContext(AuthContext);
  if (currentUser) {
    return <Redirect to="/" />;
  }
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Label as="h1">Sign Up</Form.Label>
      <Form.Group as={Row} controlId="formPlaintextEmail">
        <Form.Label column sm="4">
          Full Name
        </Form.Label>
        <Col sm="8">
          <Form.Control type="text" name="name" placeholder="Name" />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="formPlaintextEmail">
        <Form.Label column sm="4">
          Phone
        </Form.Label>
        <Col sm="8">
          <Form.Control type="number" name="phone" placeholder="Phone Number" />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="formPlaintextEmail">
        <Form.Label column sm="4">
          Email
        </Form.Label>
        <Col sm="8">
          <Form.Control type="email" name="email" placeholder="Email" />
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="formPlaintextPassword">
        <Form.Label column sm="4">
          Password
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
          />
        </Col>
      </Form.Group>
      {/* <Form.Group as={Row} controlId="formPlaintextPassword">
              <Form.Label column sm="4">
                Confirm Password
              </Form.Label>
              <Col sm="8">
                <Form.Control type="password" placeholder="Confirm Password" />
              </Col>
            </Form.Group> */}

      <Button variant="primary" type="submit" size="lg">
        Sign Up
      </Button>
      <div style={{ margin: "1rem" }}>
        Already Registered?{" "}
        <Button onClick={() => setRegistered(true)}>Login?</Button>
      </div>
    </Form>
  );
}
