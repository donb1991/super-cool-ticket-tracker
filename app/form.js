import React  from 'react';
import fireBaseMethods from '../fireBaseMethods.js';

let TicketForm = React.createClass({
    getInitialState() {
      let ticket = {};
      ticket.ticketNumber = "";
      ticket.ticketTitle = "" ;
      ticket.ticketNotes = "";
      ticket.ticketTask = "";
      ticket.cmFeedback = false;
      ticket.previewLink = false;
      ticket.activated = false;
      ticket.liveLink = false;
      ticket.closed = false;
      return {ticket: ticket, buttonVal: "Send to QA"};
    },

    componentDidMount() {
      let currentUser = fireBaseMethods.currentUser();
      if(document.location.hash.indexOf("new") == -1) {
        let ticketNumber = document.location.hash.substring(document.location.hash.lastIndexOf("/") + 1, document.location.hash.indexOf("?"));
        fireBaseMethods.getTicket(currentUser, ticketNumber).then((data) => {
          this.setState({ticket: data});
        });
      }
    },

    handleChange(e) {
      let newState = {};
      newState.ticket = this.state.ticket;
      newState.ticket[e.target.id] = e.target.val;
      if(e.target.id == "ticketTask") {
        newState.buttonVal = e.target.value == "task2" ? "Send to QA" : "Close"
      }
      this.setState(newState);;
    },

    render() {
      return (
        <form id="ticketForm" action="#" method="post">
          <div className="form-group">
            <label for="ticketNumber" > Ticket # </label>
            <input type="text" id="ticketNumber"  placeholder="RITM #" className="form-control" value={this.state.ticket.ticketNumber} onChange={this.handleChange}/>
            <label for="ticketTitle">Title</label>
            <input type="text" id="ticketTitle" className="form-control" name="ticketTitle" placeholder="Title" value={this.state.ticket.ticketTitle} onChange={this.handleChange}/>
            <label for="ticketNotes">Notes</label>
            <textarea id="ticketNotes" rows="10" name="ticketNotes" className="form-control" value={this.state.ticket.ticketNotes} onChange={this.handleChange}></textarea>
            <label for="ticketTask">Task</label>
            <select id="ticketTask" className="form-control" value={this.state.ticket.ticketTask} onChange={this.handleChange}>
              <option value="task2">Task 2</option>
              <option value="task4">Task 4</option>
              <option value="dynamictask">Dynamic Task</option>
            </select>
            <div className="checkbox" >
              <label><input type="checkbox" id="cmFeedback" value={this.state.ticket.cmFeedback} onChange={this.handleChange}/>Need CM feedback</label>
            </div>
            <div className="checkbox">
              <label> <input type="checkbox" id="previewLink" value={this.state.ticket.previewLink} onChange={this.handleChange}/>Preview Link</label>
            </div>
            <div className="checkbox">
              <label> <input type="checkbox"  id="activated" value={this.state.ticket.activated} onChange={this.handleChange}/>Activated</label>
            </div>
            <div className="checkbox">
              <label> <input type="checkbox" id="liveLink" value={this.state.ticket.liveLink} onChange={this.handleChange}/>Live Link Sent</label>
            </div>
            <input type="button" className="btn btn-primary" value="Start" />
            <input type="button" className="btn btn-primary" value={this.state.buttonVal} />
          </div>
        </form>
      );
    }
});

export default TicketForm;
