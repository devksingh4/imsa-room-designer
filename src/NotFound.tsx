import React from 'react';
import Container from 'react-bootstrap/Container'
import './index.css'
import {CustomNavbar} from "./CustomNavbar";
import "firebase/auth";

function NotFound() {
    return (
        <div className="Home">
            <CustomNavbar active='home'/>
            <Container>
                <h1>404 Not Found</h1>
            </Container>
        </div>
    );
}

export default NotFound;
