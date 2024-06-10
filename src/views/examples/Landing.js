import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Table, Button } from "reactstrap";
import DemoNavbar from "../../components/Navbars/DemoNavbar.js";
import axios from 'axios';
import "../../assets/css/DemoNavbar.css";

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
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/documents', {
      headers: {
        Authorization: `Bearer ${token}`
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
    const token = localStorage.getItem('token');
    axios.post('http://localhost:5000/documents/descargar', { documentUrl }, {
      headers: {
        Authorization: `Bearer ${token}`
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
        <Container className="pt-lg-7">
          <Row className="justify-content-center">
            <Col lg="12">
              <Table className="mt-1" responsive>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Fecha de Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(document => (
                    <tr key={document.documentoid}>
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
