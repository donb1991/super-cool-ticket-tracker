import React  from 'react';
import fireBaseMethods from '../fireBaseMethods.js';

let TicketForm = React.createClass({
    getInitialState() {
      let ticketNumber = document.location.hash.substring(document.location.hash.lastIndexOf("/") + 1, document.location.hash.indexOf("?"));
      let ticket = {};
      ticket.ticketNumber = ticketNumber;
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
      ticket.currentlyWorking = "";
      ticket.totalTimeWorked;
      return {ticket: ticket};
    },

    componentDidMount() {
      let ticketNumber = document.location.hash.substring(document.location.hash.lastIndexOf("/") + 1, document.location.hash.indexOf("?"));
      fireBaseMethods.getTicket(this.props.user, ticketNumber).then((data) => {
        if(data) {
          this.setState({ticket: data});
        }
      });
      this.props.updateLocation('ticket');
    },
    handleClick(e) {

    },
    handleChange(e) {
      let newState = {};
      newState.ticket = this.state.ticket;
      newState.ticket[e.target.id] = e.target.type == "checkbox" ? e.target.checked : e.target.value;
      this.setState(newState);
      fireBaseMethods.updateTicket(this.state.ticket.ticketNumber, this.state.ticket);
    },

    handleSubmit(e) {
      e.preventDefault();
      let newState = {};
      newState.ticket = this.state.ticket;
      if(this.state.task == "4" || this.state.task == "dynamictask") {
        newState.task++;

      }
      fireBaseMethods.updateTicket(this.state.ticket.ticketNumber, this.state.ticket);
    },
    render() {
      let submit = "";
      if(this.state.currentlyWorking == this.state.ticket.ticketNumber) {
        submit = <button type="submit" className="btn btn-primary">Complete</button>
      }
      return (
        <form id="ticketForm" action="#" method="post" onSubmit={this.handleSubmit}>
          <span>{this.state.totalTimeWorked} time spent on this ticket</span>
          <div className="form-group">
            <label for="ticketNumber" > Ticket # </label>
            <input type="text" id="ticketNumber"  placeholder="RITM #" className="form-control" value={this.state.ticket.ticketNumber} readOnly="true"/>
            <label for="title">Title</label>
            <input type="text" id="title" className="form-control" name="title" placeholder="Title" value={this.state.ticket.title} onChange={this.handleChange}/>
            <label for="notes">Notes</label>
            <textarea id="notes" rows="10" name="notes" className="form-control" value={this.state.ticket.notes} onChange={this.handleChange}></textarea>
            <label for="task">Task</label>
            <select id="task" className="form-control" value={this.state.ticket.task} onChange={this.handleChange}>
              <option value="2">Task 2</option>
              <option value="3">Task 3</option>
              <option value="4">Task 4</option>
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
            <div className="btn-toolbar">
              <input type="button" className="btn btn-primary" value={this.state.currentlyWorking == this.state.ticket.ticketNumber ? "Stop Working" : "Start Working"} onClick={this.handleClick}/>
              {submit}
            </div>
          </div>
        </form>
      );
    }
});

export default TicketForm;
