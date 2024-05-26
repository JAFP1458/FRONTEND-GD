import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Table, Button } from "reactstrap";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import axios from 'axios';

const Landing = ({ token }) => {
  const [documents, setDocuments] = useState([]);
  const mainRef = useRef(null);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    fetchDocuments();
  }, []);

  const fetchDocuments = () => {
    const token = localStorage.getItem('token'); // Obtén el token del localStorage
    axios.get('http://localhost:5000/documents', {
      headers: {
        Authorization: `Bearer ${token}` // Asegúrate de incluir 'Bearer '
      }
    })
    .then(response => {
      setDocuments(response.data);
    })
    .catch(error => {
      console.error('There was an error fetching the documents!', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    });
  };

  const downloadDocument = (documentUrl) => {
    const token = localStorage.getItem('token'); // Obtén el token del localStorage
    axios.post('http://localhost:5000/documents/descargar', { documentUrl }, {
      headers: {
        Authorization: `Bearer ${token}` // Asegúrate de incluir 'Bearer '
      },
      responseType: 'blob'
    })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const decodedFileName = decodeURIComponent(documentUrl.split('/').pop());
      link.href = url;
      link.setAttribute('download', decodedFileName);
      document.body.appendChild(link);
      link.click();
    })
    .catch(error => {
      console.error('There was an error downloading the document!', error);
    });
  };

  return (
    <>
      <DemoNavbar />
      <main ref={mainRef}>
        <Container className="mt-5">
          <Row>
            <Col lg="12">
              <h1 className="display-3 text-center">Documentos</h1>
              <Table className="mt-4" responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Fecha de Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(document => (
                    <tr key={document.documentoid}>
                      <td>{document.documentoid}</td>
                      <td>{document.titulo}</td>
                      <td>{document.descripcion}</td>
                      <td>{document.fechacreacion}</td>
                      <td>
                        <Button color="primary" onClick={() => downloadDocument(document.url)}>Descargar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
};

export default Landing;
