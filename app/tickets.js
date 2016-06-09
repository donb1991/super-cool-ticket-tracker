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
        newState.inProduction = [];
        newState.waitingForCMFeedback = [];
        newState.inQA = [];
        newState.closed = [];
        newState.activated = [];
        newState.previewLink = []
        for(let ticket in data) {
          if(data[ticket].closed) {
            newState.closed.push(data[ticket]);
          } else if(data[ticket].task == "task3") {
            newState.inQA.push(data[ticket]);
          } else if(data[ticket].cmFeedback) {
            newState.waitingForCMFeedback.push(data[ticket]);
          } else if(data[ticket].activated) {
            newState.activated.push(data[ticket]);
          } else if(data[ticket].previewLink) {
            newState.previewLink.push(data[ticket]);
          } else {
            newState.inProduction.push(data[ticket]);
          }
        }
        this.setState({tickets: newState});
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
    if(this.state) {
      production = this.createli(this.state.tickets.inProduction);
      cmFeedback = this.createli(this.state.tickets.waitingForCMFeedback);
      inQA = this.createli(inQA);
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
