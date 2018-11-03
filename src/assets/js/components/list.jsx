import React, { Component } from 'react';
import '../../styles/list.scss';
import { queryEngine } from '../../../lib/queryEngine.js';

const API_URL = 'http://charette11.ing.puc.cl';

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = { filterText: null };
    this.handleChange = this.handleChange.bind(this);
    this.showChats = this.showChats.bind(this);
  }

  handleChange(event) {
    this.setState({ filterText: event.target.value });
  }

  // async searchResults() {
  //   const searchResults = await queryEngine.fetchUsernameSearch(API_URL, )
  //   this.setState({ results: })
  // }

  showChats() {
    if (this.state.filterText) {
      return (
        <div className="search">
          <p>{this.state.filterText}</p>
        </div>
      );
    }
    return (
      <div className="search">
        <p>Groups</p>
        <p>Users</p>
      </div>
    );
  }

  render() {
    return (
      <div className="search">
        <form>
          <input
            type="text"
            placeholder="Search people, groups, tags.."
            onChange={this.handleChange}
          />
        </form>
        {this.showChats()}
      </div>
    );
  }
}
