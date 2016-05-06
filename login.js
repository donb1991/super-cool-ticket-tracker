let $ = require('jquery');

function userAuthentication() {
  "use strict";

  let userAuth = {};
  let ref = new Firebase("https://sizzling-heat-8454.firebaseio.com/");

  userAuth.login = function(userObj) {
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
  }

  userAuth.logout = function() {
    ref.unauth();
  }

  userAuth.currentUser = function() {
    let authData = ref.getAuth();
    return auth.uid;
  }

  return userAuth;
}
