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
import "../../assets/css/DemoNavbar.css";

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
        <NavbarBrand tag={Link} to="/">
          <img
            alt="..."
            src={require("assets/img/brand/argon-react-white.png")}
          />
        </NavbarBrand>
        <NavbarToggler onClick={toggle}>
          <span className="navbar-toggler-icon" />
        </NavbarToggler>
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/components">
                Components
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/examples">
                Examples
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/profile-page">
                Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/login-page">
                Login
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/register-page">
                Register
              </NavLink>
            </NavItem>
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
