import React from 'react';
import {Bricks} from './Brick'
import Container from 'react-bootstrap/Container'
import './index.css'
import {CustomNavbar} from "./CustomNavbar";
import "firebase/auth";

function Home() {
    return (
        <div className="Home">
            <CustomNavbar active='home'/>
            <Container>
                <Bricks
                    props={[
                        {name: "Designer", description: "Enter the room designer", authenticated: true},
                        {name: "View Designs", description: "View your room designs", authenticated: true},
                    ]}
                />
            </Container>
        </div>
    );
}

export default Home;
