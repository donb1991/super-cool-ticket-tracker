import moment from "moment";
import config from "./fireBaseConfig.js"
let $ = require('jquery');


function fireBaseMethods() {
  "use strict";


  firebase.initializeApp(config);


  let fireBaseObject = {
    currentUser: function() {
      let currentUser = firebase.auth().currentUser;

      if(currentUser) {
        return currentUser.uid;
      }
      return null;
    },

    login: function(user) {
      let deferred = $.Deferred();

      firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(function(user) {
        if(user) {
          deferred.resolve(user.uid);
        }
      },function(err) {
        deferred.reject(err.code);
      });
      return deferred.promise();
    },

    logout: function() {
      ref.unauth();
    },

    getTicket: function(user, ticketNumber) {
      let deferred = $.Deferred();
      let ticketRef = new Firebase("https://sizzling-heat-8454.firebaseio.com/users/" + user + '/tickets/' + ticketNumber);

      ticketRef.once('value', function(dataSnapshot) {
        deferred.resolve(dataSnapshot.val());
      }, function(err) {
        deferred.reject(err);
      });
      return deferred;
    },

    getUserTickets: function(user) {
      let deferred = $.Deferred();

      firebase.database().ref('users/' + user).once('value').then(function(snapshot) {

        deferred.resolve(snapshot.val());
      });

      return deferred;
    },

    createTicket(ticketNumber) {
      let user = this.currentUser();
      let newTicket = {
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
      }
      this.endTimeSegement().done(function() {
        firebase.database().ref("/users/" + user).update({currentTicket: ticketNumber});
        firebase.database().ref("/users/" + user + "/tickets/" + ticketNumber).update(newTicket);
        firebase.database().ref("/users/" + user + "/tickets/" + ticketNumber + "/timeSegments").push({start: moment().format('LLL')});
      });
    },

    newTimeSegement(startTime, ticketNumber) {
      let user = this.currentUser();

      firebase.database().ref("/users/" + user + "/tickets/" + ticketNumber + "/timeSegments").push({start: startTime});
      firebase.database().ref("/users/" + user).update({currentTicket: ticketNumber});
    },

    endTimeSegement() {
      let deferred = $.Deferred();
      let user = this.currentUser();
      let currentTicket = "";


      firebase.database().ref("/users/" + user).once('value', function(dataSnapshot) {
        currentTicket = dataSnapshot.val().currentTicket;

        if(currentTicket) {
          let ticket = dataSnapshot.val().tickets[currentTicket];
          let keys = Object.keys(ticket.timeSegments);

          for(var i = 0; i < keys.length; i++) {

            if(ticket.timeSegments[keys[i]].end === undefined) {
              console.log('updates?')
              firebase.database().ref("/users/" + user + '/tickets/' + currentTicket + '/timeSegments/' + keys[i]).update({end: moment().format("LLL")});
              let timeWorked = ticket.timeWorked || 0;

              timeWorked += moment(ticket.timeSegments[keys[i]].end).diff(ticket.timeSegments[keys[i]].start) / 60000
              firebase.database().ref('/users/' + user + '/tickets/' + currentTicket).update({timeWorked: timeWorked});
              firebase.database().ref("/users/" + user).update({currentTicket: ""});
              deferred.resolve(true);
              return;
            }
          }
        } else {
          deferred.resolve(false);
        }

      });

      return deferred;
    },

    updateTicket: function(ticketNumber, ticketInfo) {
      let user = this.currentUser();

      if(!user) {
        thorw("Must be logged in to make changes to a ticket");
      }
      let newTicket = {};
      for(var key in ticketInfo) {
        if(key != "timeSegments") {
          newTicket[key] = ticketInfo[key];
        }
      }

      firebase.database().ref('/users/' + user + '/tickets/' + ticketNumber).update(newTicket);
    },

    createUser: function(user) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password).catch(function(error) {
        console.log(error);
      })
    }
  };

  return fireBaseObject;
}

module.exports = fireBaseMethods();
