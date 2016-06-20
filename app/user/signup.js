import React  from 'react';
import fireBaseMethods from '../../fireBaseMethods.js';

let Signup = React.createClass({

    getInitialState() {
        return {user: 
            {email: "", password: ""}
        }
    },
    handleChange(e) {
        let state = this.state.user;
        state[e.target.id] = e.target.value;
        this.setState({user: state});
    },

    handleSumbit(e) {
        e.preventDefault();
        var user = {};
        user.email = e.target.email.value;
        user.password = e.target.password.value;
        console.log(user);
        fireBaseMethods.createUser(user);
    },

    render() {
        return (
        	<div>
            <div className="row">
                <h3 className="col-xs-8 col-xs-offset-2">Sign Up</h3>
            </div>
            <div className="row form-group">
              <form id="loginForm" className="col-xs-8 col-xs-offset-2" onSubmit={this.handleSumbit}>
                <label for="email">Email </label>
                <input type="text" id="email"  placeholder="email" className="form-control" value={this.state.email} onChange={this.handleChange}/>
                <br />
                <label for="password">Password </label>
                <input type="password" id="password"  placeholder="password" className="form-control" value={this.state.password} onChange={this.handleChange}/>
                <br />
                <input type="submit" className="btn btn-primary from-control col-xs-12" value="Login" />
              </form>
            </div>
          </div>
        );
    }
})

export default Signup;