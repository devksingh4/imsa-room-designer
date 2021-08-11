import React from 'react';
import './index.css'
import {CustomNavbar} from "./CustomNavbar";
import "firebase/auth";

function Designer() {
    return (
        <div className="Home">
            <CustomNavbar active='designer'/>
        </div>
    );
}

export default Designer;
