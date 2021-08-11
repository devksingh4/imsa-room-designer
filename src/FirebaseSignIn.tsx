import {FirebaseAuthConsumer, FirebaseAuthProvider} from "@react-firebase/auth";
import firebase from "firebase/app";
import "firebase/auth";
import {config} from "./FirebaseConfig";
import NavDropdown from "react-bootstrap/NavDropdown";

import React, {Component} from "react";
import {FirebaseSignOut} from "./FirebaseSignOut";

export class FirebaseSignIn extends Component {
    render() {
        return (
            <FirebaseAuthProvider {...config} firebase={firebase}>
                <div>
                    <FirebaseAuthConsumer>
                        {({isSignedIn, firebase}) => {
                            if (isSignedIn === true) {
                                return (
                                    <NavDropdown title={`Signed in as: ${firebase.auth().currentUser.displayName}`}
                                                 id="navbarScrollingDropdown">
                                        <FirebaseSignOut/>
                                    </NavDropdown>
                                );
                            } else {
                                return (
                                    <NavDropdown title="Sign in" id="navbarScrollingDropdown">
                                        <NavDropdown.Item onClick={() => {
                                            console.log(firebase.auth)
                                            const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                                            firebase.auth().signInWithPopup(googleAuthProvider);
                                        }}>
                                            with Google
                                        </NavDropdown.Item>
                                        <NavDropdown.Item disabled={true} onClick={() => {
                                            console.log(firebase.auth)
                                            const authProvider = new firebase.auth.OAuthProvider('microsoft.com');
                                            firebase.auth().signInWithPopup(authProvider);
                                        }}>
                                            with Microsoft
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                );
                            }
                        }}
                    </FirebaseAuthConsumer>
                </div>
            </FirebaseAuthProvider>
        )
    }
}
