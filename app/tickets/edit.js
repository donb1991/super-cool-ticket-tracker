import React  from 'react';
import fireBaseMethods from '../../fireBaseMethods.js';
import moment from "moment";

let Edit = React.createClass({
    getDefaultProps() {
      let ticketNumber = document.location.hash.substring(document.location.hash.lastIndexOf("/") + 1, document.location.hash.indexOf("?"));
      return {
        ticket: {
          ticketNumber: ticketNumber,
          title: "",
          notes: "",
          task: "2",
          cmFeedback: false,
          previewLink: false,
          activated: false,
          liveLink: false,
          closed: false,
          createdAt: moment().format('LLL'),
        }, 
        currentTicket: ''
      }
    },
    componentDidMount() {

      let ticketNumber = document.location.hash.substring(document.location.hash.lastIndexOf("/") + 1, document.location.hash.indexOf("?"));
      if(this.props.ticket.ticketNumber != ticketNumber) {
        let ticket = this.props.ticket;
        ticket.ticketNumber = ticketNumber;
        this.props.updateTicket(ticket, false);
      }
    },
    handleChange(e) {
      let ticket = {};
      ticket = this.props.ticket;
      ticket[e.target.id] = e.target.type == "checkbox" ? e.target.checked : e.target.value;
      this.props.updateTicket(ticket, false);
    },
    handleClick(e) {
      let target = e.target.value
      fireBaseMethods.endTimeSegement().then(() => {

        if(target == "Start Working") {
          fireBaseMethods.newTimeSegement(moment().format("LLL"), this.props.ticket.ticketNumber);
          this.props.updateCurrentTicket(this.props.ticket.ticketNumber);
        } else if(target == "Stop Working") {
          this.props.updateCurrentTicket("");
        }
      });
    },
    handleSubmit(e) {
      e.preventDefault();

      let ticket = {};
      ticket = this.props.ticket;
      if(this.props.ticket.task == "4" || this.props.ticket.task == "dynamictask") {
        ticket.closed = true;
        ticket.closedAt = moment().format("LLL");
      } else {
        ticket.task = 3;
      }
      fireBaseMethods.endTimeSegement();
      this.props.updateTicket(ticket, true);
    },
    goBack() {
      document.location.hash = document.location.hash.substring(1, document.location.hash.lastIndexOf('/'));
    },
    render() {
      let submit = "";
      if(this.props.currentTicket == this.props.ticket.ticketNumber) {
        submit = <button type="submit" className="btn btn-primary">Complete</button>
      }
      return (
        <form id="ticketForm" action="#" method="post" onSubmit={this.handleSubmit}>
          <div className="">
            <button type="button" onClick={this.goBack}>
              <i className="fa fa-angle-left fa-lg" aria-hidden="true" ></i>
            </button>
            <label for="ticketNumber" >Ticket #</label>
            <input type="text" id="ticketNumber"  placeholder="RITM #" className="form-control" value={this.props.ticket.ticketNumber} readOnly="true"/>
            <label for="title">Title</label>
            <input type="text" id="title" className="form-control" name="title" placeholder="Title" value={this.props.ticket.title} onChange={this.handleChange}/>
            <label for="notes">Notes</label>
            <textarea id="notes" rows="10" name="notes" className="form-control" value={this.props.ticket.notes} onChange={this.handleChange}></textarea>
            <label for="task">Task</label>
            <select id="task" className="form-control" value={this.props.ticket.task} onChange={this.handleChange}>
              <option value="2">Task 2</option>
              <option value="3">Task 3</option>
              <option value="4">Task 4</option>
              <option value="dynamictask">Dynamic Task</option>
            </select>
            <div className="checkbox" >
              <label><input type="checkbox" id="cmFeedback" checked={this.props.ticket.cmFeedback} onChange={this.handleChange}/>Need CM feedback</label>
            </div>
            <div className="checkbox">
              <label> <input type="checkbox" id="previewLink" checked={this.props.ticket.previewLink} onChange={this.handleChange}/>Preview Link</label>
            </div>
            <div className="checkbox">
              <label> <input type="checkbox"  id="activated" checked={this.props.ticket.activated} onChange={this.handleChange}/>Activated</label>
            </div>
            <div className="checkbox">
              <label> <input type="checkbox" id="liveLink" checked={this.props.ticket.liveLink} onChange={this.handleChange}/>Live Link Sent</label>
            </div>
            <div className="btn-toolbar">
              <input type="button" className="btn btn-primary" onClick={this.handleClick} value={this.props.currentTicket == this.props.ticket.ticketNumber ? "Stop Working" : "Start Working"} onClick={this.handleClick}/>
              {submit}
            </div>
          </div>
        </form>
      );
    }
});

export default Edit;
