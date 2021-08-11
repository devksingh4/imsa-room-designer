import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import React, {Component} from "react";
import {FirebaseSignIn} from "./FirebaseSignIn";

interface CustomNavbarProps {
    active: string
}

export class CustomNavbar extends Component<CustomNavbarProps> {
    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">
                        IMSA Room Designer
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/#/">Home</Nav.Link>
                            <Nav.Link href="/#/designer">Designer</Nav.Link>
                            <Nav.Link href="/#/view-designs">View Designs</Nav.Link>
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
