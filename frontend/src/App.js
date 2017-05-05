import React, { Component } from 'react';
import './App.css';
import EfktrBody from 'efktr-body/lib';
import data from '../../body/data/T029Dictionary.json';

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            latlng: undefined,
            side: undefined,
            data: data
        };

        this.updateFields = this.updateFields.bind(this);
    }

    updateFields(data){
        this.setState({
            latlng: data.latlng,
            side: data.side
        });
    }

    render(){
        return (
            <div className="App">
                <div className="App-header">
                    <h3>Body Editor</h3>
                </div>
                <EfktrBody back={this.state.side} onClick={this.updateFields}/>
                <div className="ui form">
                    <div className="fields">
                        <div className="field">
                            <select className="ui search dropdown">
                                {this.state.data.map( e => {
                                    return <option value={e.cui}>{e.definition}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>Position</label>
                            <input type="text" disabled={true} value={JSON.stringify(this.state.latlng)}/>
                        </div>
                        <div className="field">
                            <label>side</label>
                            <input type="text" disabled={true} value={this.state.side}/>
                        </div>
                    </div>
                    <div className="fields">
                        <div className="field">
                            <input className="ui button positive attached" type="button" value="Submit"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
