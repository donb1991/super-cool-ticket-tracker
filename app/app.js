import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import Login from './login.js';
import TicketForm from './form.js';
import Tickets from './tickets.js';
import fireBaseMethods from '../fireBaseMethods.js';

let history = createBrowserHistory();
let App = React.createClass({
  componentDidMount() {
    let currentUser = fireBaseMethods.currentUser();
    let location;
    if(this.state.user) {
      location = 'tickets';
      document.location.hash = "#/users/" + this.state.user;
    } else {
      location = 'login';
      document.location.hash = 'login';
    }
    this.setState({location: location});
  },

  getInitialState() {
    let currentUser = fireBaseMethods.currentUser();
    return {user: currentUser, location: ''};
  },

  logout(e) {
    e.preventDefault();
    fireBaseMethods.logout();
    this.setState({user: undefined, location: "login"});
    document.location.hash = '#/login';
  },

  login(userInfo) {
    fireBaseMethods.login(userInfo).then((user) => {
      this.setState({user: user.uid, location: 'tickets'});
      document.location.hash = "#/users/" + user.uid;
    }, function(err) {
      console.log(err);
    });
  },

  updateLocation(url, location) {
     this.setState({location: location});
  },

  render() {

    let navOptions;
    if(this.state.user) {
      navOptions = (
        <ul className="nav navbar-nav">
          <li className={this.state.location === "tickets" ? "active" : ""}><a href={"#/users/" + this.state.user}>All Tickets</a></li>
          <li className={this.state.location === "ticket" ? "active" : ""}><a href={"#/users/" + this.state.user + "/tickets/new"}>New Ticket</a></li>
          <li><a onClick={this.logout}>Log Out</a></li>
        </ul>);
    } else {
      navOptions = (
        <ul className="nav navbar-nav">
          <li className={this.state.location === "login" ? "active" : ""}><a href="#/login" >Login</a></li>
          <li className={this.state.location === "signup" ? "active" : ""}><a>Sign up</a></li>
        </ul>);
    }

    let children = this.props.children;
    if(this.props.children) {
      children = React.cloneElement(this.props.children, {
        login: this.login,
        updateLocation: this.updateLocation,
        user: this.state.user
      });
    }

    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <span className="navbar-brand">Ticket Tracker</span>
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            <div className="collapse navbar-collapse">
              {navOptions}
            </div>
          </div>
        </nav>
        <div className="container">
          {children}
        </div>
      </div>
      );
  }
});


render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="login" component={Login}> </Route>
      <Route path="users/:id" component={Tickets}></Route>
      <Route path="users/:id/tickets/:id" component={TicketForm}></Route>
    </Route>
  </Router>
),  document.getElementById('content'));
