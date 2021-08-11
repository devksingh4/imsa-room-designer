import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import {FirebaseAuthConsumer, FirebaseAuthProvider} from "@react-firebase/auth";
import firebase from "firebase/app";
import "firebase/auth";
import {config} from "./FirebaseConfig";

interface BricksProps {
    props: Record<string, any>,
}

export class Bricks extends Component<BricksProps> {
    createGroup = () => {
        let group: any[] = []
        for (let i = 0; i < this.props.props.length; i++) {
            if (this.props.props[i].authenticated) {
                group.push(<FirebaseAuthProvider {...config} firebase={firebase}>
                    <div>
                        <FirebaseAuthConsumer>
                            {({isSignedIn, firebase}) => {
                                if (isSignedIn === true) {
                                    return (
                                        <Link key={`${this.props.props[i].name.toLowerCase()}.Link`}
                                              to={this.props.props[i].name.toLowerCase().replace(' ', '-')} style={{textDecoration: 'none', color: 'inherit'}}>
                                            <Card key={`${this.props.props[i].name.toLowerCase()}`}
                                                  style={{margin: 20}}>
                                                <Card.Body>
                                                    <Card.Title key={this.props.props[i].name.toLowerCase().Title}
                                                                style={{color: '#005faf'}}>{this.props.props[i].name.replace(/([A-Z])/g, ' $1')}</Card.Title>
                                                    <Card.Text key={this.props.props[i].name.toLowerCase().Text}
                                                               style={{color: '#005faf'}}>{this.props.props[i].description}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Link>
                                    );
                                } else {
                                    return (
                                        <a style={{textDecoration: 'none', color: 'inherit'}} onClick={() => {
                                            const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                                            firebase.auth().signInWithPopup(googleAuthProvider);
                                        }} href="javascript:;">
                                            <Card key={`${this.props.props[i].name.toLowerCase()}`}
                                                  style={{margin: 20}}>
                                                <Card.Body>
                                                    <Card.Title key={this.props.props[i].name.toLowerCase().Title}
                                                                style={{color: '#005faf'}}>{this.props.props[i].name.replace(/([A-Z])/g, ' $1')}</Card.Title>
                                                    <Card.Text key={this.props.props[i].name.toLowerCase().Text}
                                                               style={{color: '#005faf'}}>{this.props.props[i].description}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </a>
                                    );
                                }
                            }}
                        </FirebaseAuthConsumer>
                    </div>
                </FirebaseAuthProvider>)
            } else {
                group.push(<Link key={`${this.props.props[i].name.toLowerCase()}.Link`}
                                 to={this.props.props[i].name.toLowerCase().replace(" ", "-")}>
                    <Card key={`${this.props.props[i].name.toLowerCase()}`} style={{margin: 20}}>
                        <Card.Body>
                            <Card.Title key={this.props.props[i].name.toLowerCase().Title}
                                        style={{color: '#005faf'}}>{this.props.props[i].name.replace(/([A-Z])/g, ' $1')}</Card.Title>
                            <Card.Text key={this.props.props[i].name.toLowerCase().Text}
                                       style={{color: '#005faf'}}>{this.props.props[i].description}</Card.Text>
                        </Card.Body>
                    </Card>
                </Link>)
            }

        }
        return group
    }

    render() {
        return (
            <div aria-label="Property chooser" key={'opts'}>
                {this.createGroup()}
            </div>
        );
    }
}

