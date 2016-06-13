import React from 'react';
import createFragment from "react-addons-create-fragment";
import fireBaseMethods from '../../fireBaseMethods.js';

let Tickets = React.createClass({
  getInitialState() {
  	return {tickets: {}, currentTicket: "", newTicket: ""};
  },

	componentWillMount() {
		let newState = {};
		if(this.props.user) {
		  fireBaseMethods.getUserTickets(this.props.user).then((data) => {
		  	newState.tickets = data.tickets;
		  	newState.currentTicket = data.currentTicket;
		    this.setState(newState);
		  });
		}
	},
	updateTicket(ticket, close) {
		let newState = {};
		newState.tickets = this.state.tickets;
		newState.tickets[ticket.ticketNumber] = ticket;
		if(close) {
			newState.currentTicket = "";
		}
		this.setState(newState);
		fireBaseMethods.updateTicket(ticket.ticketNumber, ticket);
	},
	updateNewTicket(newTicket) {
		this.setState({newTicket: newTicket});
	},
	updateView(ticketNumber) {
		updateNewTicket(ticketNumber);
		document.location.hash = "#/users/" + this.props.user + "/tickets/" + ticketNumber;
	},

	render() {
		let children;
		if(this.props.children.type.displayName == "List") {
			children = React.cloneElement(this.props.children, {
        tickets: this.state.tickets,
        currentTicket: this.state.currentTicket,
        user: this.props.user,
        updateNewTicket: this.updateNewTicket,
     		newTicket: this.state.newTicket,
     		updateView: this.updateView
      });
		} else {
			let ticketNumber = document.location.hash.substring(document.location.hash.lastIndexOf("/") + 1, document.location.hash.indexOf("?")); 
			children = React.cloneElement(this.props.children, {
        ticket: this.state.tickets[ticketNumber],
        currentTicket: this.state.currentTicket,
        updateTicket: this.updateTicket,
        newTicket: this.state.newTicket
      });
		}
		return <div>{children}</div>
	}
});

export default Tickets;