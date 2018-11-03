import React, { Component } from 'react';
import '../../styles/chat.scss';
import List from './list';
//import { queryEngine } from '../../../lib/queryEngine.js';

const API_URL = 'http://charette11.ing.puc.cl';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = { chatName: null, chat: null, text: null };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onChangeChat(newChat) {
    this.setState({ chatName: newChat });
  }

  //async getMessagesGroup(groupName) {
    //messages = await fetchGroup();

    //this.setState({ chat: })
  //}

  //async getMes

  handleChange(event) {
    this.setState({ text: event.target.value });
  }

  handleSubmit() {
    this.setState({ chatName: this.state.text });
  }

  render() {
    return (
      <div>
        <List />
        <div className="chatWindow">
          <p className="chatName">{this.state.chatName}</p>
          <div className="chatContent" />
          <div>
            <textarea placeholder="Type a message here..." onChange={this.handleChange} />
            <button onClick={this.handleSubmit}>SEND</button>
          </div>
        </div>
      </div>
    );
  }
}
