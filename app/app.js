import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import Login from './user/login.js';
import Signup from './user/signup.js';
import Edit from './tickets/edit.js';
import List from './tickets/list.js';
import Tickets from './tickets/tickets.js';
import fireBaseMethods from '../fireBaseMethods.js';

let history = createBrowserHistory();
let App = React.createClass({
  componentDidMount() {
    let currentUser = fireBaseMethods.currentUser();
    let location;
    if(this.state.user) {
      location = 'tickets';
      document.location.hash = "#/users/" + this.state.user + "/tickets";
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
    fireBaseMethods.login(userInfo).then((user, err) => {
      this.setState({user: user, location: 'tickets'});
      document.location.hash = "#/users/" + user + "/tickets";
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
        <ul className="nav navbar-nav" style={{paddingRight: 0, marginRight: 0}}>
          <li><a onClick={this.logout}>Log Out</a></li>
        </ul>);
    } else {
      navOptions = (
        <ul className="nav navbar-nav" style={{paddingRight: 0, marginRight: 0}}>
          <li className="pull-left"><a href="#/login" >Login</a></li>
          <li className="pull-right"><a href="#/signup">Sign up</a></li>
        </ul>
      );
    }

    let children = this.props.children;
    if(this.props.children) {
      if(this.props.children.type.displayName == "Login") {
        children = React.cloneElement(this.props.children, {
          login: this.login,
          updateLocation: this.updateLocation
        });
      } else {
        children = React.cloneElement(this.props.children, {
          user: this.state.user
        });
      }
    }

    return (
      <div>
        <nav className="navbar navbar-default">
          <div className="navbar-header pull-left">
            <span className="navbar-brand">Ticket Tracker</span>
          </div>
            <div className="navbar-header pull-right">
              {navOptions}
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
      <Route path="signup" component={Signup}></Route>
      <Route path="users/:id" component={Tickets}>
        <Route path="tickets" component={List}></Route>
        <Route path="tickets/:id" component={Edit}></Route>
      </Route>
    </Route>
  </Router>
),  document.getElementById('content'));
