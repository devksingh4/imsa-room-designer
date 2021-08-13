import './index.css'
import {CustomNavbar} from "./CustomNavbar";
import firebase from "firebase/app";
import Container from 'react-bootstrap/esm/Container';
import "firebase/database";
import "firebase/auth";
import { Component } from 'react';
import { config } from './FirebaseConfig';
import { FirebaseAuthConsumer, FirebaseAuthProvider } from "@react-firebase/auth";
import {Bricks} from './Brick'

interface ViewScheduleProps {
}

interface ViewScheduleState {
    firebase?: any,
    userId?: string,
    data?: any
}

export default class ViewSchedule extends Component<ViewScheduleProps, ViewScheduleState> {
    // @ts-ignore
    constructor(props: ViewScheduleProps) {
        super(props);
        this.state = { firebase: firebase.apps.length !== 0 ? firebase.app() : firebase.initializeApp(config) };
    }
    componentDidMount() {

    }
    getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    getUserInfo() {
        const userId =  this.state.firebase.auth().currentUser.uid 
        if (!userId) return;
        this.state.firebase.database().ref('schedules/' + userId).get().then(snapshot => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                this.setState({data})
            }
        })
    }
    createBricks(data) {
        let items = []
        const userId =  this.state.firebase.auth().currentUser.uid 
        for (const entry in data) {
            // @ts-ignore
            items.push({name: data[entry]['scheduleName'], authenticated: true, href: `view?id=${entry}&user=${userId}`})
        }
        if (items.length === 0) {
            return <p>No schedules available!</p>
        }
        return (<Bricks props={items} />);
    }
    render() {
        this.getUserInfo()
        return (
            <>
                <CustomNavbar active='designer' />
                <br></br>                    
                <Container>
                    <h1>Your Schedules</h1>
                    {this.createBricks(this.state.data)}
                </Container>
            </>
        );
    }
}

