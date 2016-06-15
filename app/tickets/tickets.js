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
		if(newState.tickets) {
			newState.tickets[ticket.ticketNumber] = ticket;
			if(close) {
				newState.currentTicket = "";
			}
		} else {
			newState.tickets = {};
			newState.tickets[ticket.ticketNumber] = ticket;
		}
		this.setState(newState);
		fireBaseMethods.updateTicket(ticket.ticketNumber, ticket);
	},
	updateNewTicket(newTicket) {
		this.setState({newTicket: newTicket.trim()});
	},
	updateCurrentTicket(currentTicket) {
		this.setState({currentTicket: currentTicket.trim()});
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
        updateCurrentTicket: this.updateCurrentTicket,
        user: this.props.user,
        updateNewTicket: this.updateNewTicket,
     		newTicket: this.state.newTicket,
     		updateView: this.updateView,
     		updateTicket: this.updateTicket
      });
		} else {
			let ticketNumber = document.location.hash.substring(document.location.hash.lastIndexOf("/") + 1, document.location.hash.indexOf("?"));
			let ticket;
			if(this.state.tickets) {
				ticket = this.state.tickets[ticketNumber];
			} else {
				ticket = {ticketNumber: ticketNumber};
			}
			children = React.cloneElement(this.props.children, {
        ticket: ticket,
        currentTicket: this.state.currentTicket,
        updateTicket: this.updateTicket,
        updateCurrentTicket: this.updateCurrentTicket,
        newTicket: this.state.newTicket
      });
		}
		return <div>{children}</div>
	}
});

export default Tickets;