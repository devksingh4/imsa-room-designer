import './index.css'
import { CustomNavbar } from "./CustomNavbar";
import Form from 'react-bootstrap/Form';
import ToggleButton from 'react-bootstrap/ToggleButton';
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Component } from 'react';
import { config } from './FirebaseConfig';
import copy from 'copy-to-clipboard';
import { FirebaseAuthConsumer, FirebaseAuthProvider } from "@react-firebase/auth";


interface SchedulerProps {
    hide?: boolean
    edit?: boolean
}

interface SchedulerState {
    share: boolean,
    scheduleName: string,
    powerschoolSchedule: string,
    powerschoolArray: string[],
    cleanedSchedule?: any[],
    firebase: any,
    humanSchedule?: any[],
    surl: string,
    copied?: string,
    userId?: string,
    id: string
}

export default class Scheduler extends Component<SchedulerProps, SchedulerState> {
    // @ts-ignore
    constructor(props: SchedulerProps) {
        super(props);
        this.state = { share: false, scheduleName: '', powerschoolSchedule: '', powerschoolArray: [], firebase: firebase.apps.length !== 0 ? firebase.app() : firebase.initializeApp(config), surl: '', id: '0' };
    }
    componentDidMount() {
        const id = this.getParameterByName('id');
        const userId = this.getParameterByName('user');
        if (!id) return;
        if (!userId) return;

        this.state.firebase.database().ref('schedules/' + userId).get().then(snapshot => {
            if (snapshot.exists()) {
                const item = snapshot.val()[id]
                this.setState({ powerschoolArray: item['powerschoolArray'], scheduleName: item['scheduleName'], powerschoolSchedule: item['powerschoolSchedule'] })
                this.getModSchedule(this.state.powerschoolArray);
            } else {
                alert("No matching schedule available!");
            }
        })
    }
    getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    handleScheduleName(event) {
        this.setState({ scheduleName: event?.target.value })
    }
    getTableEntries(datastruct) {
        datastruct.forEach(mod => {

        })
        return null;
    }
    handlePowerschoolSchedule(event) {
        this.setState({ powerschoolSchedule: event?.target.value })
        if (this.state.powerschoolSchedule === '') return null;
        let powerschool = this.state.powerschoolSchedule;
        let powerschoolArray: any = powerschool.split("\n");
        // filter out lines that do not start with numbers as they cannot possibly be valid expressions.
        // this allows headers to be pasted.
        powerschoolArray = powerschoolArray.filter((entry: any) => {
            return !isNaN(entry[0]);
        })
        powerschoolArray = powerschoolArray.map(function (entry) {
            return entry.split("\t");
        });
        this.setState({ powerschoolArray })
        this.getModSchedule(powerschoolArray);
    }
    range(a, b) {
        if (b === undefined) {
            b = a;
            a = 1;
        }
        return [...Array(b - a + 1).keys()].map(x => x + a);
    }

    getModSchedule(powerschoolArray) {
        try {
            this.setState({ userId: this.state.firebase.auth().currentUser.uid })
        } catch {
            console.warn("Could not get user.")
        }
        console.log(this.state.userId)
        let interim: any[][] = [];
        powerschoolArray.forEach(element => {
            let expression: string = element[0]
            let name: string = element[3]
            let teacher: string = element[4]
            let room: string = element[5]
            // process expression (some taken from George Moe's IMSA Scheduler)
            expression = expression.replace(/ +/g, "");
            let expressionArray: string[] = expression.split(/\),*(?=[0-9])/g);
            expressionArray = expressionArray.map(function (v, i, a) {
                if (i < a.length - 1) return v + ")"; else return v;
            });
            // end George Moe code
            expression = expressionArray.filter((item) => !item.includes('Sp'))[0]
            let mods = expression.split('(')[0]
            let days = expression.split('(')[1].substring(0, expression.split('(')[1].length - 1)
            const arr = [name, teacher, room, mods.split('-').map(item => { return parseInt(item, 10) - 1 }), days.split(',')]
            interim.push(arr)
        });
        let datastruct: any = []
        for (let i = 0; i < 8; i++) {
            datastruct.push([null, null, null, null, null])
        }
        let dayMappings = { "A": 0, "B": 1, "I": 2, "C": 3, "D": 4 }
        // now convert to datastruct containing table data
        interim.forEach(element => {
            let mods = element[3]
            let days = element[4]
            let newDays: any[] = []
            days.forEach(day => {
                if (day.includes('-')) {
                    let split = day.split('-')
                    split = split.map(item => dayMappings[item]);
                    let rg = this.range(split[0], split[1])
                    rg = rg.filter(item => item !== 2)
                    // @ts-ignore
                    return rg.forEach(item => newDays.push(item))
                }
                // @ts-ignore
                return newDays.push(dayMappings[day])
            })
            days = newDays
            mods.forEach(mod => {
                days.forEach(day => {
                    datastruct[mod][day] = { name: element[0], teacher: element[1], room: element[2] }
                });
            });
        })
        // @ts-ignore
        this.setState({ cleanedSchedule: datastruct, humanSchedule: interim })
    }

    renderHelper(mod) {
        if (!this.state.cleanedSchedule) return null;
        const modItems = this.state.cleanedSchedule[mod - 1].map((item) => {
            if (!item) return <td></td>
            return <td><a style={{ fontWeight: "bold", textAlign: "center" }}>{item.name}</a><br />{item.teacher}<br />{item.room}</td>
        })
        return (
            <tr>
                <td key={'mod-' + mod}>{mod}</td>
                {modItems}
            </tr>
        )
    }
    handleSaveSchedule() {
        if (!this.state.powerschoolArray) return null;
        if (this.props.edit) {
            const userId = this.state.firebase.auth().currentUser.uid;
            const id = this.getParameterByName('id');
            this.setState({ userId, id: id || '' })
            this.state.firebase.database().ref('schedules/' + userId + '/' + id).set({
                powerschoolArray: this.state.powerschoolArray,
                scheduleName: this.state.scheduleName
            });
            this.setState({ surl: `${window.location.origin}/imsa-schedule-share/#/view?id=${id}&user=${userId}` })
            this.setState({ copied: this.state.surl })
            return;
        }
        const userId = this.state.firebase.auth().currentUser.uid;
        const postref = this.state.firebase.database().ref('schedules/' + userId).push({
            powerschoolArray: this.state.powerschoolArray,
            powerschoolSchedule: this.state.powerschoolSchedule,
            scheduleName: this.state.scheduleName
        })
        this.setState({ surl: `${window.location.origin}/imsa-schedule-share/#/view?id=${postref.key}&user=${userId}` })
        this.setState({ copied: this.state.surl })
    }
    render() {
        return (
            <>
                <CustomNavbar active='designer' />
                <br></br>
                {this.props.hide ? null : <Container>
                    <h1>Input Data</h1>
                    <Form>
                        <Form.Group className="mb-3" controlId="scheduleInput">
                            <Form.Label>Schedule Name</Form.Label>
                            <Form.Control type="text" placeholder="Semester 1 Schedule" value={this.state.scheduleName} onChange={this.handleScheduleName.bind(this)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="powerschoolInput">
                            <Form.Label>PowerSchool Schedule</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder='Paste PowerSchool table from "Year Schedule" section here.' value={this.state.powerschoolSchedule} onChange={this.handlePowerschoolSchedule.bind(this)} />
                        </Form.Group>
                        <FirebaseAuthProvider {...config} firebase={firebase}>
                            <FirebaseAuthConsumer>
                                {({ isSignedIn, firebase }) => {
                                    if (isSignedIn) {
                                        return (
                                            <>
                                                <ToggleButton
                                                    className="mb-2"
                                                    id="toggle"
                                                    type="checkbox"
                                                    variant="outline-primary"
                                                    checked={this.state.share}
                                                    value="share"
                                                    onChange={(e) => this.setState({ share: e.currentTarget.checked })}
                                                >
                                                    Share Schedule
                                                </ToggleButton>
                                                <br></br>
                                                <Button variant="primary" onClick={() => { this.handleSaveSchedule.bind(this); this.handleSaveSchedule(); }}>{this.state.copied ? "Copied to clipboard!" : "Save Schedule"}</Button>
                                            </>
                                        );
                                    } else {
                                        return (
                                            <Button variant="secondary" disabled>Sign in to share and save schedules</Button>
                                        );
                                    }
                                }}
                            </FirebaseAuthConsumer>
                        </FirebaseAuthProvider>
                        <a>{this.state.copied}</a>
                    </Form>
                </Container>}
                <Container>
                    <h1>{this.props.hide ? this.state.scheduleName : "Your Schedule"}</h1>
                    <FirebaseAuthProvider {...config} firebase={firebase}>
                        <FirebaseAuthConsumer>
                            {({ isSignedIn, firebase }) => {
                                if (isSignedIn) {
                                    if (!this.getParameterByName('user')) return null;
                                    return this.state.userId === this.getParameterByName('user') && this.props.hide ? <><Button variant='primary' href={window.location.href.replace('view', 'scheduler/edit')}>Edit schedule</Button><br></br><br></br></> : <i>Sign in to manage schedule</i>
                                } else {
                                    return this.props.hide ? <i>Sign in to manage schedule</i> : null
                                }
                            }}
                        </FirebaseAuthConsumer>
                    </FirebaseAuthProvider>
                </Container>
                <Container fluid="xl">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Mod</th>
                                <th>A</th>
                                <th>B</th>
                                <th>I</th>
                                <th>C</th>
                                <th>D</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderHelper(1)}
                            {this.renderHelper(2)}
                            {this.renderHelper(3)}
                            {this.renderHelper(4)}
                            {this.renderHelper(5)}
                            {this.renderHelper(6)}
                            {this.renderHelper(7)}
                            {this.renderHelper(8)}
                        </tbody>
                    </Table>
                </Container>

            </>
        );
    }
}
