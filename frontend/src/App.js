import React, { Component } from 'react';
import './App.css';
import EfktrBody from 'efktr-body/lib';

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            latlng: undefined,
            side: undefined,
            data: []
        }
    }

    updateFields(data){
        console.log('hello');
        console.log(data);
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
                <EfktrBody back={true} onClick={this.updateFields}/>
                <div className="ui form">
                    <div className="fields">
                        <div className="field">
                            <select className="ui search dropdown">
                                {this.state.data.map( e => {
                                    return <option>{e.definition}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label>latlng</label>
                            <input type="text" disabled={true} value={this.state.latlng}/>
                        </div>
                        <div className="field">
                            <label>side</label>
                            <input type="text" disabled={true} value={this.state.side}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
