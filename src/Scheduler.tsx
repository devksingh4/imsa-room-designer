import './index.css'
import { CustomNavbar } from "./CustomNavbar";
import Form from 'react-bootstrap/Form';
import ToggleButton from 'react-bootstrap/ToggleButton';
import "firebase/auth";
import Container from 'react-bootstrap/esm/Container';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Component } from 'react';


interface SchedulerProps {

}

interface SchedulerState {
    share: boolean,
    scheduleName: string,
    powerschoolSchedule: string,
    powerschoolArray: string[],
    cleanedSchedule?: any[]
}

export default class Scheduler extends Component<SchedulerProps, SchedulerState> {
    // @ts-ignore
    constructor(props: SchedulerProps) {
        super(props);
        this.state = { share: false, scheduleName: 'Semester 1 Schedule', powerschoolSchedule: '', powerschoolArray: [] };
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
        this.getModSchedule(powerschoolArray);
    }
    getModSchedule(powerschoolArray) {
        if (this.state.powerschoolSchedule === '') return null;
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
            let newDays = []
            days.forEach(day => {
                if (day.includes('-')) {
                    // @ts-ignore
                    return day.split('-').forEach(yeet => newDays.push(dayMappings[yeet]))
                }
                // @ts-ignore
                return newDays.push(dayMappings[day])
            })
            // handle courses that run all 4 days such that the range endpoints are not adjacent
            if (Math.abs(newDays[0] - newDays[1]) != 1) {
                // @ts-ignore
                newDays = [...Array(newDays[1] + 1).keys()];
                newDays = newDays.filter(item => { return item !== 2 })
            }
            mods.forEach(mod => {
                newDays.forEach(day => {
                    datastruct[mod][day] = { name: element[0], teacher: element[1], room: element[2] }
                })
            })
        })
        // @ts-ignore
        this.setState({ cleanedSchedule: datastruct })
    }
    renderHelper(mod) {
        if (!this.state.cleanedSchedule) return null;
        const modItems = this.state.cleanedSchedule[mod - 1].map((item) => {
            if (!item) return <td></td>
            return <td><a style={{ fontWeight: "bold", textAlign: "center" }}>{item.name}</a><br />{item.teacher}<br />{item.room}</td>
        })
        return (
            <tr>
                <td>{mod}</td>
                {modItems}
            </tr>
        )
    }
    render() {
        return (
            <>
                <CustomNavbar active='designer' />
                <br></br>
                <Container>
                    <h1>Input Data</h1>
                    <Form>
                        <Form.Group className="mb-3" controlId="scheduleInput">
                            <Form.Label>Schedule Name</Form.Label>
                            <Form.Control type="text" placeholder="Semester 1 Schedule" onChange={this.handleScheduleName.bind(this)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="powerschoolInput">
                            <Form.Label>PowerSchool Schedule</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder='Paste PowerSchool table from "Year Schedule" section here.' onChange={this.handlePowerschoolSchedule.bind(this)} />
                        </Form.Group>
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
                        <Button variant="primary">Create Schedule</Button>{' '}
                    </Form>
                </Container>
                <Container fluid="xl">
                    <h1>Your Schedule</h1>

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