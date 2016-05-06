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
    console.log(authData);
  }

  return userAuth;
}

(function() {

  let userAuth = userAuthentication();
  let form = $('#loginForm');

  form.on('submit', function(event) {
    event.preventDefault();
    let userObj = {
      email: $("#email").val(),
      password: $("#password").val()
    };

    userAuth.currentUser();
    userAuth.login(userObj).then(function(data){
      // console.log(data);
    }, function(err) {
      console.log("failed");
    });

    userAuth.currentUser();
  });

})();
