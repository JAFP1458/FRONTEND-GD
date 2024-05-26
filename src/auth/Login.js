// src/auth/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  Container,
  Row,
  Col
} from 'reactstrap';
import '../assets/css/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 login-container">
      <Row className="justify-content-center">
        <Col md="8" lg="6" xl="4">
          <Card className="shadow-lg">
            <CardBody className="p-4">
              <div className="text-center mb-4">
                <img
                  src="https://via.placeholder.com/100" // URL de imagen de perfil
                  alt="Profile"
                  className="rounded-circle img-thumbnail"
                />
              </div>
              <h3 className="text-center mb-4">Login Form</h3>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Input
                    type="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mb-3"
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    type="password"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mb-3"
                  />
                </FormGroup>
                <Button color="success" size="lg" block type="submit">
                  LOGIN
                </Button>
                <FormGroup check className="mt-3">
                  <Label check>
                    <Input type="checkbox" /> Keep me signed in on this device
                  </Label>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
