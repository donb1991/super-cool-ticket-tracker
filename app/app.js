import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login.js'
import TicketForm from './form.js'
import TicketList from './ticketList.js'


class App extends React.Component {

    render() {
        return <TicketList />;
    }
}


ReactDOM.render( < App / > ,
    document.getElementById('content')
);