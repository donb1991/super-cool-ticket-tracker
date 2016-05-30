import React  from 'react';
import fireBaseMethods from '../fireBaseMethods.js';

let Login = React.createClass({

    getInitialState() {
        return {user: 
            {email: "", password: ""}
        }
    },

    componentDidMount() {
        // let currentUser = fireBaseMethods.currentUser()

        // if(!currentUser) {
        //   document.location.hash = '#/';  
        // }
    },

    handleChange(e) {
        let state = this.state.user;
        state[e.target.id] = e.target.value;
        this.setState({user: state});
    },

    handleSumbit(e) {
        e.preventDefault();
        console.log(this.state.user);
        this.props.login(this.state.user);
    },

    render() {
        return (
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
        );
    }
})

export default Login;