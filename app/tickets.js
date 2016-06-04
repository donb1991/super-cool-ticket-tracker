import React from 'react';
import fireBaseMethods from '../fireBaseMethods.js';

let Tickets = React.createClass({

  componentDidMount() {
    let currentUser = fireBaseMethods.currentUser();

    if(!currentUser) {
      document.location.hash = '#/login';
    }
    fireBaseMethods.getUserTickets(currentUser).then((data) => {
      let newState = {};
      newState.inProduction = [];
      newState.waitingForCMFeedback = [];
      newState.inQA = [];
      newState.closed = [];
      newState.activated = [];
      newState.previewLink = []
      for(let ticket in data) {
        if(data[ticket].closed) {
          newState.closed.push(data[ticket]);
        } else if(data[ticket].task == "task3"){
          newState.inQA.push(data[ticket]);
        } else if(data[ticket].cmFeedback) {
          newState.waitingForCMFeedback.push(data[ticket]);
        } else if(data[ticket].activated) {
          newState.activated.push(data[ticket]);
        } else if(data[ticket].previewLink) {
          newState.previewLink.push(data[ticket]);
        }
        else {
          newState.inProduction.push(data[ticket]);
        }
      }
      this.setState({tickets: newState});
    });
  },

  handleClick(e) {
    this.props.updateLocation('users/1/tickets/new', 'tickets');
  },

  createli(tickets) {
    let newli = "";
    if(tickets) {
      newli = tickets.map((ticket, index) => {
        return <li key={index}>
          <p>{ticket.ticketNumber}</p>
          <p>&emsp;{ticket.title}</p>
        </li>
      });
    }
    return newli;
  },
  render() {
    let production = "";
    let cmFeedback = "";
    let inQA = "";
    let closed = "";
    let previewLinkSent = "";
    let activated = "";
    if(this.state) {
      production = this.createli(this.state.tickets.inProduction);
      cmFeedback = this.createli(this.state.tickets.waitingForCMFeedback);
      inQA = this.createli(inQA);
      closed = this.createli(this.state.tickets.closed);
      activated = this.createli(this.state.tickets.closed);
      previewLinkSent = this.createli(this.state.tickets.closed);
    }

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
          {production}
        </ul>
        <hr />

        <h4>Preview Link sent</h4>
        <ul>
          {previewLinkSent}
        </ul>
        <hr />

        <h4>Activated</h4>
        <ul>
          {activated}
        </ul>
        <hr />

        <h4>Waiting on CM feedback</h4>
        <ul>
          {cmFeedback}
        </ul>
        <hr />

        <h4>In QA</h4>
        <ul>
          {inQA}
        </ul>
        <hr />

        <h4>Closed</h4>
        <ul>
          {closed}
        </ul>
        <hr />
      </div>
    );
  }
});

export default Tickets;
