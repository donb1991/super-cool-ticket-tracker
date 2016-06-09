import React from 'react';
import fireBaseMethods from '../fireBaseMethods.js';

let Tickets = React.createClass({
  getInitialState() {
    return {tickets: [], newTicket: ""};
  },
  componentDidMount() {
    if(this.props.user) {
      fireBaseMethods.getUserTickets(this.props.user).then((data) => {
        let newState = {};
        newState.currentTicket = [];
        newState.inProduction = [];
        newState.waitingForCMFeedback = [];
        newState.inQA = [];
        newState.closed = [];
        newState.activated = [];
        newState.previewLink = []
        for(let ticket in data.tickets) {
          if(data.tickets[ticket].ticketNumber == data.currentTicket) {
            newState.currentTicket.push(data.tickets[ticket]);
          } else if(data.tickets[ticket].closed) {
            newState.closed.push(data.tickets[ticket]);
          } else if(data.tickets[ticket].task == "3") {
            newState.inQA.push(data.tickets[ticket]);
          } else if(data.tickets[ticket].cmFeedback) {
            newState.waitingForCMFeedback.push(data.tickets[ticket]);
          } else if(data.tickets[ticket].activated) {
            newState.activated.push(data.tickets[ticket]);
          } else if(data.tickets[ticket].previewLink) {
            newState.previewLink.push(data.tickets[ticket]);
          } else {
            newState.inProduction.push(data.tickets[ticket]);
          }
        }
        this.setState({tickets: newState, currentTicket: data.currentTicket});
      });
    }
  },
  handleChange(e) {
    this.setState({newTicket: e.target.value});
  },
  handleClick(e) {
    this.props.updateLocation('tickets');
    document.location.hash = 'users/' + this.props.user + '/tickets/' + this.state.newTicket;
  },
  createli(tickets) {
    let newli = "";
    if(tickets) {
      newli = tickets.map((ticket, index) => {
        return <li key={index}>
          <p><a href={"#/users/" + this.props.user + "/tickets/" + ticket.ticketNumber} >{ticket.ticketNumber}</a></p>
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
    let currentTicket = "";
    if(this.state.tickets) {
      currentTicket = this.createli(this.state.tickets.currentTicket);
      production = this.createli(this.state.tickets.inProduction);
      cmFeedback = this.createli(this.state.tickets.waitingForCMFeedback);
      inQA = this.createli(this.state.tickets.inQA);
      closed = this.createli(this.state.tickets.closed);
      activated = this.createli(this.state.tickets.activated);
      previewLinkSent = this.createli(this.state.tickets.previewLink);
    }

    return (
      <div>
            <div className="input-group">
              <input type="text" name="search" className="form-control" value={this.state.newTicket} onChange={this.handleChange}/>
              <span className="input-group-btn">
                <button type="button" className="btn btn-primary" onClick={this.handleClick}>New Ticket</button>
              </span>
            </div> 
            <div className="input-group">
              <span className="input-group-addon">Search</span>
              <input type="text" name="search" className="form-control"/>
            </div> 

        <hr />
        <h4>Current Ticket</h4>
          <ul>
            {currentTicket}
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
