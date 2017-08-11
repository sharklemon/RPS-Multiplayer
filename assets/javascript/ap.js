// variables
var p1Name = "";
var p2Name = "";
var p1choice = "";
var p2choice = "";
var p1WINS = "0";
var p2WINS = "0";
var p1LOSS = "0";
var p2LOSS = "0";

var p1WINNER = ["rs", "pr", "sp"]
var p1LOSER = ["sr", "rp", "ps"]

var isplayer1=true

//firebase initialize & keep track of presence
var config = { apiKey: "AIzaSyAAV95ucsj_wwBjrDgs5OpbhMKBWm0Wvh4", authDomain: "rps-multiplayer-3c8e1.firebaseapp.com", databaseURL: "https://rps-multiplayer-3c8e1.firebaseio.com", projectId: "rps-multiplayer-3c8e1", storageBucket: "rps-multiplayer-3c8e1.appspot.com", messagingSenderId: "62316126898" };
firebase.initializeApp(config);

var database = firebase.database();

// connectionsRef references a specific location in db all connections stored in this directory.
var connectionsRef = database.ref("/connections");
// '.info/connected' is location provided by Firebase updated every time client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
////////// ?? how to keep track of ifferent connections base on who has loged in? if statement?
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {
  if (snap.val()) {    // If they are connected..
    var con = connectionsRef.push(true); // Add user to the connections list.
    con.onDisconnect().remove(); // Remove user from the connection list when they disconnect.
  }
});

console.log("sigh "+database.ref("/player1").val())


$(document).on("click", "#submitbtn", function(event) {
	console.log("in submit loop")
	


	if(isplayer1){
		p1Name = $("#playerName").val().trim();
	    console.log("player 1 submission ", p1Name)
	    // this has to be changed to make the reference specific!!
	    database.ref().child("player1").set({
	    	name: p1Name,
        	losses: p1LOSS,
        	wins: p1WINS,
        	choice: p1choice,
        	isp1:false
      	});
      	$("#formdiv").addClass('hidden');		
      	$("#submitbtn").addClass('hidden');
   	    $("#helloDIV").html("<h2>Hello " + p1Name+ "! You are player 1.");
	}
	else{
		p2Name = $("#playerName").val().trim();
	    console.log("player 2 name ", p2Name)
	    // this has to be changed to make the reference specific!!
	    database.ref("/player2").push({
        	name: p2Name,
        	losses: p1LOSS,
        	wins: p1WINS,
        	choice: p2choice
      	});
	    $("#helloDIV").html("<h2>Hello " + p2Name+ "! You are player 2.");
      	$("#formdiv").addClass('hidden');		
      	$("#submitbtn").addClass('hidden');
      	//show options panel to p1
      	// announce "hello to p2"
      	// announce "your play to p1"
      	// announce "waiting" to p2
      	// hide form an submit from p2
	}

});

$(document).on("click", ".choice1", function(event) {
	var choiceHook = $(this).attr("id")
	p1choice = choiceHook.slice(0)
	database.ref("/player2").push({
        	choice: p1choice,
	});
	//display choice to p1
	//display options to p2
});

$(document).on("click", ".choice2", function(event) {
	var choiceHook = $(this).attr("id")
	p2choice = choiceHook.slice(0)
	
	database.ref("/player2").push({
        	choice: p1choice,
	});
	//display choice to p1
	//display options to p2

	var outcome = p1choice + p2choice;
	if(p1choice==p2choice){
		//isplay tie in center panel to both
	}

	else if(p1WINNER.indexOf(outcome)<0){
		p2WINS++
		p1LOSS++
		database.ref("/player2").push({
        	wins: p2WINS
		});
		database.ref("/player1").push({
        	losses: p1LOSS
		});
		//display p2win in center panel
	}
	else{
		p1WINS++
		p2LOSS++
		database.ref("/player1").push({
        	wins: p1WINS
		});
		database.ref("/player2").push({
        	losses: p2LOSS
		});
		//display p1win in center panel
	}
});

database.ref().on("value", function(snapshot) {
 	p1Name = snapshot.child("/player1").val().name
	p2Name = snapshot.child("/player2").val().name
	p1choice = snapshot.child("/player1").val().choice
	p2choice = snapshot.child("/player2").val().choice
	p1WINS = snapshot.child("/player1").val().wins
	p2WINS = snapshot.child("/player2").val().wins
	p1LOSS = snapshot.child("/player1").val().losses
	p2LOSS = snapshot.child("/player2").val().losses
  



  console.log("p1 name in snapshot ref loop " + snapshot.child("/player1").val().name);
  console.log("snapshot dot val " + snapshot.val());

  var firebObject = snapshot.val();
  console.log("snapshot only " + firebObject.player1);
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);});


// $("#add-user").on("click", function(event) {
//       event.preventDefault();

//       // YOUR TASK!!!
//       // Code in the logic for storing and retrieving the most recent user.
//       // Don't forget to provide initial data to your Firebase database.
//       name = $("#name-input").val().trim();
//       email = $("#email-input").val().trim();
//       age = $("#age-input").val().trim();
//       comment = $("#comment-input").val().trim();

//       // Code for the push
//       dataRef.ref().push({

//         name: name,
//         email: email,
//         age: age,
//         comment: comment,
//         dateAdded: firebase.database.ServerValue.TIMESTAMP
//       });
//     });