import React  from 'react';
import fireBaseMethods from '../fireBaseMethods.js';

let TicketForm = React.createClass({

    componentDidMount() {
        let currentUser = fireBaseMethods.currentUser()

        if(!currentUser) {
          // document.location.hash = '#/';  
        }
    },

    render() {
        return (
          <form id="ticketForm" action="#" method="post">
            <div className="form-group">
              <label for="ticketNumber" > Ticket # </label>
              <input type="text" id="ticketNumber"  placeholder="RITM #" className="form-control"/>
              <label for="ticketTitle">Title</label>
              <input type="text" id="ticketTitle" className="form-control" name="ticketTitle" placeholder="Title" />
              <label for="ticketNotes">Notes</label>
              <textarea id="ticketNotes" rows="10" name="ticketNotes" className="form-control"></textarea>
              <label for="ticketTask">Task</label>
              <select id="ticketTask" className="form-control">
                <option value="task2">Task 2</option>
                <option value="task4">Task 4</option>
                <option value="dynamictask">Dynamic Task</option>
              </select>
              <div className="checkbox">
                <label><input type="checkbox" value="cmFeedback" />Need CM feedback</label>
              </div>
              <div className="checkbox">
                <label> <input type="checkbox" value="prevewLink" />Preview Link</label>
              </div>
              <div className="checkbox">
                <label> <input type="checkbox"  value="activated" />Activated</label>
              </div>
              <div className="checkbox">
                <label> <input type="checkbox" value="liveLink" />Live Link Sent</label>
              </div>
              <input type="button" className="btn btn-primary" value="Start" />
              <input type="button" className="btn btn-primary" value="Complete"/>
            </div>
          </form>
        );
    }
});

export default TicketForm;
