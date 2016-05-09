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
        if(currentTimeSegments.timeSegments === undefined) {
          ref.child("users").child(user).child(ticketNumber).child('timeSegments').push(timeSegment);
        } else {
          let keys = Object.keys(currentTimeSegments.timeSegments);
          for(var i = 0; i < keys.length; i++) {
            if(currentTimeSegments.timeSegments[keys[i]].end === undefined) {
              ref.child("users").child(user).child(ticketNumber).child('timeSegments').child(keys[i]).update(timeSegment);
              return;
            }
          }
          ref.child("users").child(user).child(ticketNumber).child('timeSegments').push(timeSegment);
        }
      });
    }
  };

  return fireBaseObject;
}
