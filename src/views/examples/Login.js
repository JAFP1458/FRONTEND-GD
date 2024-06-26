import React, { useState, useRef } from "react";
import { Button, Card, CardBody, FormGroup, Form, Input, InputGroupAddon, InputGroupText, InputGroup } from "reactstrap";
import { useNavigate } from "react-router-dom";
import '../../assets/css/custom-styles.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Importa la función jwtDecode correctamente

const Login = ({ setToken }) => {
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
  const navigate = useNavigate();
  const mainRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage(''); // Limpiar el mensaje de error al enviar el formulario
    axios.post('http://localhost:5000/login', { correoElectronico, contraseña })
      .then(response => {
        const token = response.data.token;
        localStorage.setItem('token', token);
        setToken(token);
        const decodedToken = jwtDecode(token); // Usa jwtDecode correctamente
        const userRole = decodedToken.userRole;

        // Redirigir según el rol del usuario
        if (userRole === 'Gestor') {
          navigate('/user-roles');
        } else if (userRole === 'Operador') {
          navigate('/landing-page');
        } else {
          navigate('/login');
        }
      })
      .catch(error => {
        console.error('There was an error logging in!', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          setErrorMessage(error.response.data.message || 'Error en el inicio de sesión');
        } else if (error.request) {
          console.error('Error request:', error.request);
          setErrorMessage('Error en el servidor. Inténtalo de nuevo más tarde.');
        } else {
          console.error('Error message:', error.message);
          setErrorMessage('Error en el inicio de sesión');
        }
      });
  };

  return (
    <>
      <main ref={mainRef} className="custom-background">
        <Card className="custom-card">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center mb-4">
              <h1>SENESCYT</h1>
            </div>
            {errorMessage && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className="form-control"
                    placeholder="Email"
                    type="email"
                    value={correoElectronico}
                    onChange={(e) => setCorreoElectronico(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className="form-control"
                    placeholder="Password"
                    type="password"
                    autoComplete="off"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id="customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label form-check-label"
                  htmlFor="customCheckLogin"
                >
                  <span>Acuerdate de mi</span>
                </label>
              </div>
              <div className="text-center">
                <Button
                  className="my-4 btn"
                  type="submit"
                >
                  Login
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </main>
    </>
  );
};

export default Login;