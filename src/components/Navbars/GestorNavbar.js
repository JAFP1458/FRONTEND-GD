import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Container,
  Button,
} from "reactstrap";
import "../../assets/css/GestorNavbar.css";

const DemoNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarScrolled(true);
      } else {
        setNavbarScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar
      className={`navbar-main ${navbarScrolled ? "navbar-scrolled" : ""}`}
      expand="lg"
      fixed="top"
    >
      <Container>
        <NavbarBrand >
          <img
            alt="..."
            src={require("assets/img/brand/senescyt-logo.png")}
          />
        </NavbarBrand>
        
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Button color="danger" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
};

export default DemoNavbar;
