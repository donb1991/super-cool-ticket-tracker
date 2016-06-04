import React  from 'react';
import fireBaseMethods from '../fireBaseMethods.js';

let TicketForm = React.createClass({
    getInitialState() {
      let ticket = {};
      ticket.ticketNumber = "";
      ticket.title = "" ;
      ticket.notes = "";
      ticket.task = "";
      ticket.cmFeedback = false;
      ticket.previewLink = false;
      ticket.activated = false;
      ticket.liveLink = false;
      ticket.caching = false;
      ticket.closed = false;
      ticket.createdAt = Date.now();
      return {ticket: ticket};
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
      newState.ticket[e.target.id] = e.target.type == "checkbox" ? e.target.checked : e.target.value;
      this.setState(newState);;
    },

    handleSubmit(e) {
      e.preventDefault();
      fireBaseMethods.updateTicket(this.state.ticket.ticketNumber, this.state.ticket);
    },

    render() {
      return (
        <form id="ticketForm" action="#" method="post" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label for="ticketNumber" > Ticket # </label>
            <input type="text" id="ticketNumber"  placeholder="RITM #" className="form-control" value={this.state.ticket.ticketNumber} onChange={this.handleChange}/>
            <label for="title">Title</label>
            <input type="text" id="title" className="form-control" name="title" placeholder="Title" value={this.state.ticket.title} onChange={this.handleChange}/>
            <label for="notes">Notes</label>
            <textarea id="notes" rows="10" name="notes" className="form-control" value={this.state.ticket.notes} onChange={this.handleChange}></textarea>
            <label for="task">Task</label>
            <select id="task" className="form-control" value={this.state.ticket.task} onChange={this.handleChange}>
              <option value="task2">Task 2</option>
              <option value="task3">Task 3</option>
              <option value="task4">Task 4</option>
              <option value="dynamictask">Dynamic Task</option>
            </select>
            <div className="checkbox" >
              <label><input type="checkbox" id="cmFeedback" checked={this.state.ticket.cmFeedback} onChange={this.handleChange}/>Need CM feedback</label>
            </div>
            <div className="checkbox">
              <label> <input type="checkbox" id="previewLink" checked={this.state.ticket.previewLink} onChange={this.handleChange}/>Preview Link</label>
            </div>
            <div className="checkbox">
              <label> <input type="checkbox"  id="activated" checked={this.state.ticket.activated} onChange={this.handleChange}/>Activated</label>
            </div>
            <div className="checkbox">
              <label> <input type="checkbox" id="liveLink" checked={this.state.ticket.liveLink} onChange={this.handleChange}/>Live Link Sent</label>
            </div>
            <input type="button" className="btn btn-primary" value="Start" />
            <button type="submit" className="btn btn-primary">Complete</button>
          </div>
        </form>
      );
    }
});

export default TicketForm;
