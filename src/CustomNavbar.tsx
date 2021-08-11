import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import React, {Component} from "react";
import {FirebaseSignIn} from "./FirebaseSignIn";
import {Link} from 'react-router-dom';

interface CustomNavbarProps {
    active: string
}

export class CustomNavbar extends Component<CustomNavbarProps> {
    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#">
                        IMSA Room Designer
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link>
                                <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                                    Home
                                </Link>
                            </Nav.Link>
                            <Nav.Link> <Link to="/designer" style={{textDecoration: 'none', color: 'inherit'}}>
                                Designer
                            </Link></Nav.Link>
                            <Nav.Link> <Link to="/view-designs" style={{textDecoration: 'none', color: 'inherit'}}>
                                View Designs
                            </Link></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Navbar.Collapse className="justify-content-end">
                        <FirebaseSignIn/>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}
