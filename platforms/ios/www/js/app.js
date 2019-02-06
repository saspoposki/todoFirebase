// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase'])


// let's create a re-usable factory that generates the $firebaseAuth instance
/*
  exampleApp.factory("Auth", ["$firebaseAuth",
function($firebaseAuth) {
  return $firebaseAuth();
}
]);
*/
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }

    //fb = new Firebase("https://mynewsite-5f600.firebaseio.com/");
     // Initialize Firebase
     var fb = {
        apiKey: "AIzaSyAVNYMlm0x3e_teTCrAsq6O_pAzvEwKBN4",
        authDomain: "mynewsite-5f600.firebaseapp.com",
        databaseURL: "https://mynewsite-5f600.firebaseio.com",
        projectId: "mynewsite-5f600",
        storageBucket: "mynewsite-5f600.appspot.com",
        messagingSenderId: "48752730498"
      };
  firebase.initializeApp(fb);
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
      url: '/login',
      templateUrl: '/templates/login.html',
      controller: 'LoginController'
  })
  .state('todo', {
      url: '/todo',
      templateUrl: 'templates/todo.html',
      controller: 'TodoController'
  });
  $urlRouterProvider.otherwise('/login');
})

.controller("LoginController", function($scope, $firebaseAuth, $state) {

    $scope.login = function(username, password) {
        var fbAuth = $firebaseAuth();
        fbAuth.$signInWithEmailAndPassword(username,password).then(function() {
          
        }).then(function(authData) {
            $state.go("todo");
        }).catch(function(error) {
            console.error("ERROR: " + error);
        });
    }

    $scope.register = function(username, password) {
        var fbAuth = $firebaseAuth();
        fbAuth.$createUserWithEmailAndPassword(username,password).then(function() {
            
        }).then(function(authData) {
            $state.go("todo");
        }).catch(function(error) {
            console.error("ERROR " + error);
        });
    }

   
   

})

.controller("TodoController", function($scope, $firebaseObject, $firebaseArray, $firebaseAuth, $ionicPopup, $state) {
    var ref = firebase.database().ref();
    // download the data into a local object
    $scope.data = $firebaseArray(ref);

    $scope.list = function() {

       var fbAuth = $firebaseAuth();
        fbAuth.$onAuthStateChanged(function(user) {
            if (user) {
              // User is signed in.
            //  var displayName = user.displayName;
             var email = user.email;
             var emailVerified = user.emailVerified;
            //  var photoURL = user.photoURL;
            //  var isAnonymous = user.isAnonymous;
            //  var uid = user.uid;
            //  var providerData = user.providerData;
            console.log(emailVerified);

              /*
              var userPart1 = ((firebase.auth().currentUser.email).split("@"))[0];
              var userPart2 =((firebase.auth().currentUser.email).split("@"))[1];
              var userPart3 = userPart2.split(".")[0];
              var userPart4 = userPart2.split(".")[1];
    
              var userID = userPart1+'_'+userPart3+'_'+userPart4;
              */
              
            var userID = email.replace(/\.|@|\$|\-/gi, "_");
            var syncObject = $firebaseObject(ref.child("users/" + userID));
            syncObject.$bindTo($scope, "data");
            // ...
            } else {

              // User is signed out.
              // ...
            }
          });
         
       
    }

$scope.create = function() {
    $ionicPopup.prompt({
        title: 'Enter a new TODO item',
        inputType: 'text'
    })
    .then(function(result) {
        if(result !== "") {
            if($scope.data.hasOwnProperty("todos") !== true) {
                $scope.data.todos = [];
            }
            $scope.data.todos.push({title: result});
        } else {
            console.log("Action not completed");
        }
    });
}

$scope.signOff = function () {
    $firebaseAuth().$signOut()
     
    .then(function() {
       console.log('Signout Succesfull')
       $state.go("login");
       
    }, function(error) {
       console.log('Signout Failed')  
    });
 }

})
