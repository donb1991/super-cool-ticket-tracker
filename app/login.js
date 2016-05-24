import React  from 'react';

class Login extends React.Component {

    render() {
        return (
            <div className="row form-group">
              <form id="loginForm" className="col-xs-8 col-xs-offset-2">
                <label for="email">Email </label>
                <input type="text" id="email"  placeholder="email" className="form-control"/>
                <br />
                <label for="password">Password </label>
                <input type="password" id="password"  placeholder="password" className="form-control"/>
                <br />
                <input type="submit" className="btn btn-primary from-control col-xs-12" value="Login" />
              </form>
            </div>
        );
    }
}

export default Login;