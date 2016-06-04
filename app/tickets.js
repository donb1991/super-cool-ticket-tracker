import React from 'react';
import fireBaseMethods from '../fireBaseMethods.js';

let Tickets = React.createClass({

  componentDidMount() {
    let currentUser = fireBaseMethods.currentUser();

    if(!currentUser) {
      // document.location.hash = '#/';
    }
  },

  handleClick(e) {
    this.props.updateLocation('users/1/tickets/new', 'tickets');
  },

  render() {
    return (
      <div>
        <div className="form-group">
          <form>
            <label>Search<br /><input type="text" name="search" className="form-control"/></label><br />
            <input type="button" className="btn btn-primary form-control" value="New Ticket" onClick={this.handleClick}/>
            <hr />
          </form>
        </div>

        <h4>Current Ticket</h4>
        <ul>
          <li>
            <p>RITM3528330</p>
            <p>&emsp;Launch: Broadwell-E > Core i7-6950x animation</p>
          </li>
        </ul>
        <hr />

        <h4>Production</h4>
        <ul>
          <li>
            <p>RITM3528330</p>
            <p>&emsp;Launch: Broadwell-E > Core i7-6950x animation</p>
          </li>
          <li>
            <p>RITM3528330</p>
            <p>&emsp;Launch: Broadwell-E > Core i7-6950x animation</p>
          </li>
        </ul>
        <hr />

        <h4>Waiting on CM feedback</h4>
        <ul>
          <li>
            <p>RITM3528330</p>
            <p>&emsp;Launch: Broadwell-E > Core i7-6950x animation</p>
          </li>
          <li>
            <p>RITM3528330</p>
            <p>&emsp;Launch: Broadwell-E > Core i7-6950x animation</p>
          </li>
        </ul>
        <hr />

        <h4>In QA</h4>
        <ul>
          <li>
            <p>RITM3528330</p>
            <p>&emsp;Launch: Broadwell-E > Core i7-6950x animation</p>
          </li>
        </ul>
        <hr />

        <h4>Closed</h4>
        <ul>
          <li>
            <p>RITM3528330</p>
            <p>&emsp;Launch: Broadwell-E > Core i7-6950x animation</p>
          </li>
        </ul>
        <hr />
      </div>
    );
  }
});

export default Tickets;
