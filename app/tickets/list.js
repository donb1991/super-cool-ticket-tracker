import React from 'react';
import fireBaseMethods from '../../fireBaseMethods.js';

let List = React.createClass({
  getInitialState() {
    return null;
  },
  handleChange(e) {
    this.props.updateNewTicket(e.target.value)
  },
  handleSubmit(e) {
    e.preventDefault();
    fireBaseMethods.createTicket(this.props.newTicket);
    this.props.updateCurrentTicket(this.props.newTicket);
    this.props.updateTicket({ticketNumber: this.props.newTicket});
    document.location.hash = 'users/' + this.props.user + '/tickets/' + this.props.newTicket;
  },
  createli(tickets) {
    let newli = "";
    if(tickets) {
      newli = tickets.map((ticket, index) => {
        return <li key={index}>
          <p><a href={"#/users/" + this.props.user + "/tickets/" + ticket.ticketNumber}>{ticket.ticketNumber}</a></p>
          <p>&emsp;{ticket.title}</p>
        </li>
      });
    }
    return newli;
  },
  render() {
    let productionUL = "";
    let cmFeedbackUL = "";
    let inQAUL = "";
    let closedUL = "";
    let previewLinkSentUL = "";
    let activatedUL = "";
    let currentTicketUL = "";
    let ticketArrays = {};
    ticketArrays.currentTicket = [];
    ticketArrays.inProduction = [];
    ticketArrays.waitingForCMFeedback = [];
    ticketArrays.inQA = [];
    ticketArrays.closed = [];
    ticketArrays.activated = [];
    ticketArrays.previewLink = [];

    if(this.props.tickets) {
      for(let ticket in this.props.tickets) {       
        if(ticket == this.props.currentTicket) {
          ticketArrays.currentTicket.push(this.props.tickets[ticket]);
        } else if(this.props.tickets[ticket].closed) {
          ticketArrays.closed.push(this.props.tickets[ticket]);
        } else if(this.props.tickets[ticket].task == "3") {
          ticketArrays.inQA.push(this.props.tickets[ticket]);
        } else if(this.props.tickets[ticket].cmFeedback) {
          ticketArrays.waitingForCMFeedback.push(this.props.tickets[ticket]);
        } else if(this.props.tickets[ticket].activated) {
          ticketArrays.activated.push(this.props.tickets[ticket]);
        } else if(this.props.tickets[ticket].previewLink) {
          ticketArrays.previewLink.push(this.props.tickets[ticket]);
        } else {
          ticketArrays.inProduction.push(this.props.tickets[ticket]);
        }
      }
 
      currentTicketUL = this.createli(ticketArrays.currentTicket);
      productionUL = this.createli(ticketArrays.inProduction);
      cmFeedbackUL = this.createli(ticketArrays.waitingForCMFeedback);
      inQAUL = this.createli(ticketArrays.inQA);
      closedUL = this.createli(ticketArrays.closed);
      activatedUL = this.createli(ticketArrays.activated);
      previewLinkSentUL = this.createli(ticketArrays.previewLink);
    }

    return (
      <div>
        <form className="input-group" onSubmit={this.handleSubmit}>
          <input type="text" name="search" className="form-control" value={this.props.newTicket} onChange={this.handleChange}/>
          <span className="input-group-btn">
            <button type="submit" className="btn btn-primary" onClick={this.handleClick}>New Ticket</button>
          </span>
        </form> 
        <div className="input-group">
          <span className="input-group-addon">Search</span>
          <input type="text" name="search" className="form-control"/>
        </div> 

        <hr />
        <h4>Current Ticket</h4>
          <ul>
            {currentTicketUL}
          </ul>
        <hr />

        <h4>Production</h4>
        <ul>
          {productionUL}
        </ul>
        <hr />

        <h4>Preview Link sent</h4>
        <ul>
          {previewLinkSentUL}
        </ul>
        <hr />

        <h4>Activated</h4>
        <ul>
          {activatedUL}
        </ul>
        <hr />

        <h4>Waiting on CM feedback</h4>
        <ul>
          {cmFeedbackUL}
        </ul>
        <hr />

        <h4>In QA</h4>
        <ul>
          {inQAUL}
        </ul>
        <hr />

        <h4>Closed</h4>
        <ul>
          {closedUL}
        </ul>
        <hr />
      </div>
    );
  }
});

export default List;