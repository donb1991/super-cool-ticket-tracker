import React from 'react';
import Link from 'react-router/lib/Link'
import fireBaseMethods from '../../fireBaseMethods.js';
import moment from 'moment';

let List = React.createClass({
  getInitialState() {
    return null;
  },
  handleChange(e) {
    this.props.updateNewTicket(e.target.value)
  },
  handleSubmit(e) {
    e.preventDefault();
    let newTicket = {
      ticketNumber: this.props.newTicket,
      title: "",
      notes: "",
      task: "2",
      cmFeedback: false,
      previewLink: false,
      activated: false,
      liveLink: false,
      closed: false,
      createdAt: moment().format("LLL")
    }
    fireBaseMethods.createTicket(this.props.newTicket);
    this.props.updateCurrentTicket(this.props.newTicket);
    this.props.updateTicket(newTicket);
    document.location.hash = 'users/' + this.props.user + '/tickets/' + this.props.newTicket;
  },
  render() {
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

        <UnorderList items={ticketArrays.currentTicket} user={this.props.user} title="Current Ticket"  />
        <UnorderList items={ticketArrays.inProduction} user={this.props.user} title="In Production" />
        <UnorderList items={ticketArrays.previewLink} user={this.props.user} title="Preview Link" />
        <UnorderList items={ticketArrays.waitingForCMFeedback} user={this.props.user} title="Waiting For CM FeedBack" />
        <UnorderList items={ticketArrays.inQA} user={this.props.user} title="In QA" />
        <UnorderList items={ticketArrays.closed} user={this.props.user} title="Closed" />
    
      </div>
    );
  }
});

let UnorderList = React.createClass({
  getInitialState() {
    let state = JSON.parse(localStorage.getItem(this.props.title)) || {hide: false};
    return state;
  },
  handleClick(e) {
    localStorage.setItem(this.props.title, JSON.stringify({hide: !this.state.hide}));
    this.setState({hide: !this.state.hide});
  },
  render() {
    let list = this.props.items.map((ticket, index) => {
      return <li key={index}>
        <p><Link to={"/users/" + this.props.user + "/tickets/" + ticket.ticketNumber}>{ticket.ticketNumber}</Link></p>
        <p>&emsp;{ticket.title}</p>
      </li>
    });
    return (
      <div>
        <div className="row">
          <h4 className="col-xs-11">{this.props.title}</h4>
          <span onClick={this.handleClick}>{this.state.hide ? <i className="fa fa-chevron-up" aria-hidden="true"></i> : <i className="fa fa-chevron-down" aria-hidden="true"></i>}</span>
        </div>
        <ul>
          {this.state.hide ? null : list}
        </ul>
        <hr />
      </div>
    );
  }
});

export default List;