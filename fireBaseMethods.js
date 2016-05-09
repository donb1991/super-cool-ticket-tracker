let $ = require('jquery');

function fireBaseMethods() {
  "use strict";

  let ref = new Firebase("https://sizzling-heat-8454.firebaseio.com/");
  let fireBaseObject = {
    currentUser: function() {
      let authData = ref.getAuth();
      return authData.uid;
    },

    login: function(userObj) {
      let deferred = $.Deferred();
      console.log('test');
      ref.authWithPassword(userObj, function(err, user) {
        if(err) {
          deferred.reject(err);
        }

        if(user) {
          deferred.resolve(user);
        }
      });
      return deferred.promise();
    },

    logout: function() {
      ref.unauth();
    },

    updateTicket: function(ticketNumber, ticketInfo) {
      let user = this.currentUser();
      if(!user) {
        thorw("Must be logged in to make changes to a ticket");
      }

      ref.child("users").child(user).child(ticketNumber).update(ticketInfo);
    },

    updateTimeSegment: function(ticketNumber, timeSegment) {
      let user = this.currentUser();
      if(!user) {
        throw("Must be logged in to make changes to a ticket");
      }

      ref.child("users").child(user).child(ticketNumber).orderByKey().once('value', function(snapshot) {
        let currentTimeSegments = snapshot.val();
        // console.log(currentTimeSegments.timeSegments);
        if(currentTimeSegments.timeSegments === undefined) {
          console.log('currentTimeSegments === null');
          ref.child("users").child(user).child(ticketNumber).child('timeSegments').push(timeSegment);
        } else {
          let keys = Object.keys(currentTimeSegments.timeSegments);
          for(var i = 0; i < keys.length; i++) {
            if(currentTimeSegments.timeSegments[keys[i]].end === undefined) {
              console.log(currentTimeSegments[keys[i]], "In for");
              ref.child("users").child(user).child(ticketNumber).child('timeSegments').child(keys[i]).update(timeSegment);
              return;
            }
          }
          console.log("after for");
          ref.child("users").child(user).child(ticketNumber).child('timeSegments').push(timeSegment);
        }

      });
    }
  };

  return fireBaseObject;
}

(function() {

  let userAuth = fireBaseMethods();
  let form = $('#loginForm');
  let button = $('#test');

  $('#loginForm').on('submit', function(event) {
    event.preventDefault();

    let userObj = {
      email: $("#email").val(),
      password: $("#password").val()
    };

    userAuth.login(userObj).then(function(data){
      console.log(data);
    }, function(err) {
      console.log("failed");
    });

  });

  button.on('click', function(event) {
    let ticket = {title: 'test'};
    let time = {start: "6:15 PM"}
    let time2 = {start: "6:15 PM", end: "7:15 PM"}
    // userAuth.updateTicket(123, ticket);
    userAuth.updateTimeSegment(123, time2);
  });

})();
