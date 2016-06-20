import moment from "moment";
let $ = require('jquery');


function fireBaseMethods() {
  "use strict";

  let config = {
    apiKey: "",
    authDomain: "sizzling-heat-8454.firebaseapp.com",
    databaseURL: "https://sizzling-heat-8454.firebaseio.com",
    storageBucket: "sizzling-heat-8454.appspot.com"
  };
  firebase.initializeApp(config);

  // let ref = new Firebase("https://sizzling-heat-8454.firebaseio.com/");
  let fireBaseObject = {
    currentUser: function() {
      let currentUser = firebase.auth().currentUser;
      console.log(currentUser);
      if(currentUser) {
        return currentUser.uid;
      }
      return null;
    },

    login: function(user) {
      let deferred = $.Deferred();
      console.log('hello?')
      var test = firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(function(user) {
        console.log(user.u, 'user');
        if(user) {
          deferred.resolve(user.u);
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
      let userRef = new Firebase("https://sizzling-heat-8454.firebaseio.com/users/" + user);

      userRef.once('value', function(dataSnapshot) {
        deferred.resolve(dataSnapshot.val());
      }, function(err) {
        deferred.reject(err);
      });

      return deferred;
    },

    createTicket(ticketNumber) {
      let user = this.currentUser();
      let userRef = new Firebase("https://sizzling-heat-8454.firebaseio.com/users/" + user);
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
        userRef.update({currentTicket: ticketNumber});
        userRef.child('tickets').child(ticketNumber).update(newTicket);
        userRef.child('tickets').child(ticketNumber).child("timeSegments").push({start: moment().format('LLL')});
      });
    },

    newTimeSegement(startTime, ticketNumber) {
      let user = this.currentUser();
      let userRef = new Firebase("https://sizzling-heat-8454.firebaseio.com/users/" + user);
      let ticketRef = new Firebase("https://sizzling-heat-8454.firebaseio.com/users/" + user + "/tickets/" + ticketNumber);
      ticketRef.child("timeSegments").push({start: startTime});
      userRef.update({currentTicket: ticketNumber});
    },

    endTimeSegement() {
      let deferred = $.Deferred();
      let user = this.currentUser();
      let userRef = new Firebase("https://sizzling-heat-8454.firebaseio.com/users/" + user);
      let currentTicket = "";

      userRef.once('value', function(dataSnapshot) {
        currentTicket = dataSnapshot.val().currentTicket;

        if(currentTicket) {
          let ticket = dataSnapshot.val().tickets[currentTicket];
          let keys = Object.keys(ticket.timeSegments);


          for(var i = 0; i < keys.length; i++) {

            if(ticket.timeSegments[keys[i]].end === undefined) {
              userRef.child('tickets').child(currentTicket).child('timeSegments').child(keys[i]).update({end: moment().format("LLL")});

              if(ticket.timeWorked) { 
                let timeWorked =  ticket.timeWorked + (moment(ticket.timeSegments[keys[i]].end).diff(ticket.timeSegments[keys[i]].start) / 60000)
                userRef.child('tickets').child(currentTicket).update({timeWorked: timeWorked});
              } else {
                let timeWorked = moment(ticket.timeSegments[keys[i]].end).diff(ticket.timeSegments[keys[i]].start) / 60000
                userRef.child('tickets').child(currentTicket).update({timeWorked: timeWorked});
              }

              userRef.update({currentTicket: ""});
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

      ref.child("users").child(user).child('tickets').child(ticketNumber).update(newTicket);
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
