import {FirebaseAuthConsumer, FirebaseAuthProvider} from "@react-firebase/auth";
import firebase from "firebase/app";
import "firebase/auth";
import {config} from "./FirebaseConfig";

import React, {Component} from "react";
import NavDropdown from "react-bootstrap/NavDropdown";

export class FirebaseSignOut extends Component {
    render() {
        return (
            <FirebaseAuthProvider {...config} firebase={firebase}>
                <div>
                    <FirebaseAuthConsumer>
                        {({isSignedIn, firebase}) => {
                            if (isSignedIn === true) {
                                return (
                                    <div>
                                        <NavDropdown.Item disabled={true}>
                                            Email: {firebase.auth().currentUser.email}
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => {
                                            firebase.auth().signOut().then(() => {
                                                window.location.reload();
                                            })
                                        }}>
                                            Sign Out
                                        </NavDropdown.Item>
                                    </div>

                                );
                            } else {
                                return null;
                            }
                        }}
                    </FirebaseAuthConsumer>
                </div>
            </FirebaseAuthProvider>
        )
    }
}
