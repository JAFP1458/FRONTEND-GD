import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GestorNavbar from './Navbars/GestorNavbar';
import '../assets/css/UserRolesComponent.css';

const UserRolesComponent = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newUser, setNewUser] = useState({ nombre: '', correoElectronico: '', contraseña: '', rolID: '' });
  const [errors, setErrors] = useState({});
  const [updateErrors, setUpdateErrors] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [newRole, setNewRole] = useState({ nombreRol: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchAssignments();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/roles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchAssignments = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/roles/asignaciones', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const fetchUserDetails = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5000/users/details/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };





  const handleUserChange = (e) => {
    const { name, value } = e.target;
    let errorMessages = { ...errors };

    if (name === 'nombre') {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        errorMessages.nombre = 'El nombre debe contener solo letras y espacios';
      } else {
        delete errorMessages.nombre;
      }
    }

    if (name === 'correoElectronico') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMessages.correoElectronico = 'El correo electrónico no es válido';
      } else {
        delete errorMessages.correoElectronico;
      }
    }

    if (name === 'contraseña') {
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(value)) {
        errorMessages.contraseña = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial';
      } else {
        delete errorMessages.contraseña;
      }
    }

    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors(errorMessages);
  };

  const handleUpdateUserChange = (e) => {
    const { name, value } = e.target;
    let errorMessages = { ...updateErrors };

    if (name === 'nombre') {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        errorMessages.nombre = 'El nombre debe contener solo letras y espacios';
      } else {
        delete errorMessages.nombre;
      }
    }

    if (name === 'correoElectronico') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMessages.correoElectronico = 'El correo electrónico no es válido';
      } else {
        delete errorMessages.correoElectronico;
      }
    }

    if (name === 'contraseña' && value) {
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(value)) {
        errorMessages.contraseña = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial';
      } else {
        delete errorMessages.contraseña;
      }
    }

    setSelectedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setUpdateErrors(errorMessages);
  };






  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    setNewRole((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addUser = async () => {
    if (Object.keys(errors).length > 0) {
      return; // Prevent form submission if there are validation errors
    }

    const token = localStorage.getItem('token');
    try {
      const userResponse = await axios.post('http://localhost:5000/register', newUser, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchUsers();
      fetchAssignments();
      toggleModal();
    } catch (error) {
      console.error('Error adding user and assigning role:', error);
    }
  };

  const updateUser = async () => {
    if (Object.keys(updateErrors).length > 0) {
      return; // Prevent form submission if there are validation errors
    }
  
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/users/${selectedUser.usuarioid}`, {
        nombre: selectedUser.nombre,
        correoElectronico: selectedUser.correoelectronico,
        contraseña: selectedUser.contraseña || '', // Enviar la contraseña solo si se ha cambiado
        rolID: selectedUser.rolid
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      fetchUsers();
      fetchAssignments();
      toggleUpdateModal();
    } catch (error) {
      console.error('Error updating user and role:', error);
    }
  };
  




  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    toggleDeleteConfirmModal();
  };

  const deleteUser = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/delete/${userToDelete.usuarioid}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchUsers();
      fetchAssignments();
      toggleDeleteConfirmModal();
    } catch (error) {
      console.error('Error deleting user and role:', error);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleUpdateModal = () => {
    setUpdateModal(!updateModal);
  };

  const toggleDeleteConfirmModal = () => {
    setDeleteConfirmModal(!deleteConfirmModal);
  };

  const openUpdateModal = (user) => {
    fetchUserDetails(user.usuarioid); // Obtener los detalles del usuario incluyendo el rol
    toggleUpdateModal(); // Abrir el modal de actualización
  };


  const getRoleName = (userID) => {
    const assignment = assignments.find(assignment => assignment.usuarioid === userID);
    if (assignment) {
      const role = roles.find(role => role.rolid === assignment.rolid);
      return role ? role.nombrerol : 'Sin rol';
    }
    return 'Sin rol';
  };

  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.correoelectronico.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <GestorNavbar />
      <Container className="user-roles-container">
        <Row className="mt-6">
          <Col md="6">
            <Form inline className="user-roles-form">
              <FormGroup>
                <Label for="search" className="mr-2">Buscar</Label>
                <Input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Nombre o correo"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </FormGroup>
            </Form>
          </Col>
          <Col md="6" className="text-right">
            <Button color="primary" onClick={toggleModal}>+ Agregar Usuario</Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md="12">
            {loading ? (
              <Spinner color="primary" />
            ) : (
              <Table responsive className="user-roles-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo Electrónico</th>
                    <th>Rol</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.usuarioid}
                      onClick={() => openUpdateModal(user)}
                      className={user.usuarioid === hoveredRow ? 'hovered-row' : ''}
                      onMouseEnter={() => setHoveredRow(user.usuarioid)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td>{user.nombre}</td>
                      <td>{user.correoelectronico}</td>
                      <td>{getRoleName(user.usuarioid)}</td>
                      <td>
                        <Button color="danger" onClick={(e) => { e.stopPropagation(); confirmDeleteUser(user); }}>Eliminar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </Table>
            )}
          </Col>
        </Row>

        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Agregar Usuario</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="nombre">Nombre</Label>
                <Input type="text" name="nombre" id="nombre" value={newUser.nombre} onChange={handleUserChange} />
                {errors.nombre && <p className="text-danger">{errors.nombre}</p>}
              </FormGroup>
              <FormGroup>
                <Label for="correoElectronico">Correo Electrónico</Label>
                <Input type="email" name="correoElectronico" id="correoElectronico" value={newUser.correoElectronico} onChange={handleUserChange} />
                {errors.correoElectronico && <p className="text-danger">{errors.correoElectronico}</p>}
              </FormGroup>
              <FormGroup>
                <Label for="contraseña">Contraseña</Label>
                <Input type="text" name="contraseña" id="contraseña" value={newUser.contraseña} onChange={handleUserChange} />
                {errors.contraseña && <p className="text-danger">{errors.contraseña}</p>}
                <small className="form-text text-muted">
                  La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.
                </small>
              </FormGroup>
              <FormGroup>
                <Label for="rolID">Rol</Label>
                <Input type="select" name="rolID" id="rolID" value={newUser.rolID} onChange={handleUserChange}>
                  <option value="">Seleccionar Rol</option>
                  {roles.map((role) => (
                    <option key={role.rolid} value={role.rolid}>
                      {role.nombrerol}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button className="button-primary" onClick={addUser} disabled={Object.keys(errors).length > 0}>Agregar</Button>{' '}
            <Button className="button-secondary" onClick={toggleModal}>Cancelar</Button>
          </ModalFooter>
        </Modal>

        {selectedUser && (
          <Modal isOpen={updateModal} toggle={toggleUpdateModal}>
            <ModalHeader toggle={toggleUpdateModal}>Actualizar Usuario</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="nombre">Nombre</Label>
                  <Input type="text" name="nombre" id="nombre" value={selectedUser.nombre} onChange={handleUpdateUserChange} />
                  {updateErrors.nombre && <p className="text-danger">{updateErrors.nombre}</p>}
                </FormGroup>
                <FormGroup>
                  <Label for="correoElectronico">Correo Electrónico</Label>
                  <Input type="email" name="correoElectronico" id="correoElectronico" value={selectedUser.correoelectronico} onChange={handleUpdateUserChange} />
                  {updateErrors.correoElectronico && <p className="text-danger">{updateErrors.correoElectronico}</p>}
                </FormGroup>
                <FormGroup>
                  <Label for="contraseña">Contraseña (dejar en blanco si no desea cambiarla)</Label>
                  <Input type="text" name="contraseña" id="contraseña" onChange={handleUpdateUserChange} />
                  {updateErrors.contraseña && <p className="text-danger">{updateErrors.contraseña}</p>}
                  <small className="form-text text-muted">
                    La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.
                  </small>
                </FormGroup>
                <FormGroup>
                  <Label for="rolID">Rol</Label>
                  <Input type="select" name="rolID" id="rolID" value={selectedUser.rolid || ''} onChange={handleUpdateUserChange}>
                    <option value="">Seleccionar Rol</option>
                    {roles.map((role) => (
                      <option key={role.rolid} value={role.rolid}>
                        {role.nombrerol}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button className="button-primary" onClick={updateUser} disabled={Object.keys(updateErrors).length > 0}>Actualizar</Button>{' '}
              <Button className="button-secondary" onClick={toggleUpdateModal}>Cancelar</Button>
            </ModalFooter>
          </Modal>



        )}

        <Modal isOpen={deleteConfirmModal} toggle={toggleDeleteConfirmModal}>
          <ModalHeader toggle={toggleDeleteConfirmModal}>Confirmar Eliminación</ModalHeader>
          <ModalBody>
            ¿Está seguro que desea eliminar al usuario {userToDelete ? userToDelete.nombre : ''}?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={deleteUser}>Eliminar</Button>{' '}
            <Button className="button-secondary" onClick={toggleDeleteConfirmModal}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </Container>
    </>
  );
};

export default UserRolesComponent;
