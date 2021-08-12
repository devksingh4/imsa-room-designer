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
                        {name: "Scheduler", description: "Enter the schedule creator", authenticated: true},
                        {name: "View Schedules", description: "View your saved schedules", authenticated: true},
                    ]}
                />
            </Container>
        </div>
    );
}

export default Home;
