let $ = require('jquery');

function fireBaseMethods() {
  "use strict";

  let ref = new Firebase("https://sizzling-heat-8454.firebaseio.com/");
  let fireBaseObject = {
    currentUser: function() {
      let authData = ref.getAuth();
      if(authData) {
        return authData.uid;
      }
      return null;
    },

    login: function(userObj) {
      let deferred = $.Deferred();

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

    getTicket: function(user, ticketNumber) {
      let deferred = $.Deferred();
      let ticketRef = new Firebase("https://sizzling-heat-8454.firebaseio.com/users/" + user + '/' + ticketNumber);

      ticketRef.once('value', function(dataSnapshot) {
        deferred.resolve(dataSnapshot.val());
      }, function(err) {
        deferred.reject(err);
      });
      return deferred;
    },

    getUserTickets: function(userId) {
      let deferred = $.Deferred();
      let userRef = new Firebase("https://sizzling-heat-8454.firebaseio.com/users/" + userId);

      userRef.once('value', function(dataSnapshot) {
        deferred.resolve(dataSnapshot.val());
      }, function(err) {
        deferred.reject(err);
      });

      return deferred;
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
      let ticketRef = new Firebase("https://sizzling-heat-8454.firebaseio.com/users/" + user + '/' + ticketNumber);
      if(!user) {
        throw("Must be logged in to make changes to a ticket");
      }
      ticketRef.orderByKey().once('value', function(snapshot) {
        let currentTimeSegments = snapshot.val();
        if(currentTimeSegments.timeSegments === undefined) {
          ticketRef.child('timeSegments').push(timeSegment);
        } else {
          let keys = Object.keys(currentTimeSegments.timeSegments);
          for(var i = 0; i < keys.length; i++) {
            if(currentTimeSegments.timeSegments[keys[i]].end === undefined) {
              ticketRef.child('timeSegments').child(keys[i]).update(timeSegment);
              return;
            }
          }
          ticketRef.child('timeSegments').push(timeSegment);
        }
      });
    }
  };

  return fireBaseObject;
}

module.exports = fireBaseMethods();
