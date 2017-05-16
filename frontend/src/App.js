import React, { Component } from 'react';
import './App.css';
import 'whatwg-fetch';
import EfktrBody from 'efktr-body';
import TSVReader from '../../dictionaries/build/TSVReader'
import dictionary from '../../dictionaries/T029Dictionary.tsv'
import $ from "jquery";
const uuid = require('uuid/v1');

const API = process.env.REACT_APP_API || 'http://localhost:3030/data';
const TOKEN = process.env.REACT_APP_TOKEN || 'superSecretTokenItIs!';

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            latlng: undefined,
            side: undefined,
            cui: undefined,
            token: undefined,
            showBack: false,
            user: localStorage.getItem('user'),
            data: []
        };

        this.updateFields = this.updateFields.bind(this);
        this.loadBodyParts = this.loadBodyParts.bind(this);
        this.saveData = this.saveData.bind(this);
        this.updateUserUUID = this.updateUserUUID.bind(this);
        this.updateToken = this.updateToken.bind(this);
    }

    componentDidMount(){
        this.loadBodyParts();
        this.updateUserUUID(localStorage.getItem('user'));
        this.updateToken(localStorage.getItem('token') || TOKEN);
    }
    
    updateToken(value){
        localStorage.setItem('token', value);

        this.setState({
            token: localStorage.getItem('token')
        });
    }

    updateUserUUID(value){
        if(value === null || value === undefined || value === ''){
            localStorage.setItem('user', uuid());

            this.setState({
                user: localStorage.getItem('user')
            });
        } else {
            localStorage.setItem('user', value);

            this.setState({
                user: localStorage.getItem('user')
            });
        }
    }

    loadBodyParts(){
        let reader = new TSVReader();

        reader.read(dictionary, null, null, () => {
            this.setState({
                data: reader.getData()
            });
        });
    }

    updateFields(data){
        this.setState({
            latlng: data.latlng,
            side: data.side
        });
    }

    saveData(){
        let payload  = {
            "type": "Point",
            "coordinates": [
                this.state.latlng.lng,
                this.state.latlng.lat
            ],
            "properties": {
                "side": this.state.side,
                "user": this.state.user,
                "cui": this.state.cui
            }
        };

        $.ajax({
            url: API,
            type: 'POST',
            data: payload,
            headers: {
                'token': localStorage.getItem('token')
            },
            dataType: 'json'
        }).done(data => {
            alert('OK!');
        }).fail((xhr, status, error) => {
            console.log(error);
            alert(error);
        });

        return;
    }

    render(){
        return (
            <div className="App">
                <div className="App-header">
                    <h3>Body Editor</h3>
                </div>

                <div id="form" className="ui form">
                    <div className="field">
                        <EfktrBody back={this.state.showBack} onClick={this.updateFields}/>
                    </div>
                    <div className="four fields">
                        <div className="field">
                            <label>What is it?</label>
                            <select value={this.state.cui} onChange={(e) => {
                                this.setState({cui: e.target.value})
                            }} className="ui search dropdown">
                                {this.state.data.map(e => {
                                    return <option key={e.cui} value={e.cui}>{e.definition}</option>
                                })}
                            </select>
                        </div>
                        <div className="field">
                            <label>Position</label>
                            <input type="text" disabled={true} value={JSON.stringify(this.state.latlng)}/>
                        </div>
                        <div className="field">
                            <label>Side</label>
                            <input type="text" disabled={true} value={this.state.side}/>
                        </div>
                        <div className="field">
                            <label>Front side?</label>
                            <input type="checkbox" onChange={e => {
                                this.setState({showBack: !this.state.showBack})
                            }} checked={!this.state.showBack}/>
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>User (plase make sure this is the same every time! [Copy-paste in a safe place])</label>
                            <input type="text" onChange={e => this.updateUserUUID(e.target.value)} value={this.state.user}/>
                        </div>
                        <div className="field">
                            <label>Access token</label>
                            <input type="text" onChange={e => this.updateToken(e.target.value)} value={this.state.token}/>
                        </div>
                    </div>
                    <div className="fields">
                        <div className="field">
                            <input className="ui button positive attached" type="button" value="Submit" onClick={this.saveData}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
