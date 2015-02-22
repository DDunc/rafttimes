
  
 /*  	document.addEventListener("DOMContentLoaded", function(event) {
		console.log("DOM fully loaded and parsed");
		init();
	});   */ 
	


//dom selectors and tool for clearing dom

var elRaft = document.getElementsByClassName("raft")[0];
var elPlayer = document.getElementsByClassName("player")[0];
var elContext = document.getElementsByClassName("context")[0];
var domArr = [elRaft, elPlayer, elContext];
  
  
function domUpdate(){
	var elRaft = document.getElementsByClassName("raft")[0];
	var elPlayer = document.getElementsByClassName("player")[0];
	var  elContext = document.getElementsByClassName("context")[0];
	var domArr = [elRaft, elPlayer, elContext];
 }

function domClear() {
	for (var i= 0; i < domArr.length; i++) {
		while(domArr[i].firstChild){
			domArr[i].removeChild(domArr[i].firstChild);
	  }
	}
}	
	  
  
	//tools
var randomizer = function(min, max) { 
	return Math.floor(Math.random()*((max-min) +1)) + min;
};
  
	
//pseudo-global variables
var person;
var count = -1;
var day = 1;
var currentEvent = 0;
var survivorArray = [];
var currentWeather = "The weather is fine, but you're probably still going to die.";
var survLen = survivorArray.length;
var nameList = ["Ismael", "Francois", "Greg", "Lumpy", "Albert",  "Vadim", "Alain", "Peter", "Tomas", "Henri", "James", "Tyler", "Phillipe", "Louis", "Max", "Richard", "Jean", "Patrice"];
var nameListLast = ["Badiou","Janech", "Mitter", "Depaul", "Fitzroy", "Michel", "Simon", "Morell", "Roux", "Dupont", "Arceneau", "Babin", "Bergeron", "Bernard", "Bertrand"];
var currentEvent = "Who would've thought coral reefs were so hard to see? Not you, that's for sure. You and a few other survivors managed to create a crude raft, and all you have to do is sail it to shore. ";
  
  
//Survivor Creator  
function Survivor (){
	this.health = randomizer(3, 5);
	this.morale = randomizer(3, 5);
	this.hunger = 0;
	this.thirst = 0;
	this.alive = true;
	this.combatValue = this.health * 2;
	this.name = nameList[randomizer(0, nameList.length-1)] + " " + nameListLast[randomizer(0, nameListLast.length-1)];
   }

   
 //Raft, Crew/Player, Context Sate

var fwh = [50, 50, 20];
var morale = 50;
var toShore = 200;
function stateHold(){
	var state = {
		raft: {
			"food": fwh[0],
			"water": fwh[1],
			"hull": fwh[2],
			"onboard": survivorArray.length,
			"morale":  0,
			"distance": toShore
		},
		context: {
			situation: "Day " + day +", " + currentEvent + " " + currentWeather
		}
  };
}



var survPush = function() {
	for (var i = 0; i < 10; i++) {
		survivorArray.push(new Survivor());
		state.raft.onboard = survivorArray.length;
	}
};  


function stateUpdate (obj) {   
 
	function drawUpdate(element, index, array) {
	  
		if (typeof  obj[element] === "number" || typeof  obj[element] === "string") {
			stateEntry = document.createElement("div");
			stateEntry.innerHTML = "<span>" + array[index] + ": " + obj[element] + "</span>";
	   		domArr[count].appendChild(stateEntry);
		}
		if (typeof obj[element] === 'object') {
			alert(array[index].toUpperCase());
			count++;
			stateEntry = document.createElement("h4");
			stateEntry.innerHTML = "<span>" + array[index].toUpperCase() + "</span>";
			domArr[count].appendChild(stateEntry);
			return stateUpdate(obj[element]);  
		}
		return state;  
	} 

	Object.keys(obj).forEach(drawUpdate);   
}

// display opt begin!!!

var handlers = [];


function OptionC(name, text, funct) {
	this.name = name;
	this.text = text;
	this.funct = funct;
	this.contexter = function(event, weather){
		state.context.situation = "Day " + day +", Captain's log " + event + " " + weather;
	};  
   
}

var fishing = new OptionC("Fishing", "You spend the day trying to fish", function (){
	var result = state.raft.food += randomizer(0, 2);
	if (result > 0) {
		state.context.situation = "You caught some fish!";
	} else {
		state.context.event = "You spent all day trying, but didn't manage to catch anything.";
	}
	count = -1;
	combiner();
  }); 



var motivating = new OptionC("Motivate the Crew", "You spend the day trying to motivate the crew", function (){
	var result = state.player.morale += randomizer(0, 2);
	result = state.player.morale;    
	if (result > 0){
		state.context.situation = "The other survivors have been inspired by your leadership";
	} else {
		state.context.situation = "You gave a really good speech, but it didn't seem like anyone was listening to you";
	}
	count = -1;
	combiner();
}); 

var nextTurn = {
	text: "Next Turn",
	contexter: function(event, weather){
		state.context.situation = "Day " + day +", Captain's log " + event + " " + weather;
	},
	funct: function(){
		state.raft.food -= survivorArray.length;
		state.raft.water -= survivorArray.length;
		state.raft.hull -= 2;
		state.raft.distance -= 10;
		state.player.hunger++;
		state.player.thirst++;
		count = -1;
		combiner();
	}
 };

 /*{ DELETE PROBABLY
  this.text = "Try to fish";
   this.funct = state.raft.food -= survivorArray.length;
	state.raft.water -= survivorArray.length;
	state.raft.hull -= 2;
	state.raft.distance -= 10;
	state.player.hunger++;
	state.player.thirst++;
	fishing();
} */



var newGame = {
	text: "Start a new game",
	funct: function() {
		state.player.hunger++;
		count = -1;  
		weatherTurn();
		state.context.situation = currentWeather.message + " You hit start! 10 points for griffyndor!" ;
		domUpdate(state);
		stateUpdate(state);
		drawAllOpts(defaultOpts, "opt");
	}
};

var defaultOpts = [nextTurn, fishing, motivating];
var fishOpts  = [];  
var defaultOpts = [speech, fish, repair];
//To Do: either make a standard suboption menu or delete these and not have suboptions
var speechOpts = [inspire, overboard, teach];
var fishOpts =  [oneLine, twoLines, help];
var repairOpts = [subRepair];

//This switches out the options based on on array of option objects
function drawAllOpts (arr, classId){
	var node;
	var nodes = document.getElementsByClassName(classId);
	for (var i = 0; i <nodes.length; i++)  {
			node = nodes[i];   
		if (arr[i] != null) {
			node.style.visibility = "visible";
			var handler = arr[i].funct;
			node.textContent = arr[i].name;
			node.removeEventListener('click', handlers[i], false);
			node.addEventListener('click', handler);   
			handlers[i] = handler;
		}  else {
			  node.style.visibility = "hidden";
		}
	}
}  

  
//Here there be dragons...

function dayTurn() {
	day += 1;
}
  
  //To Do: harmonize the weather settings with the reduced number of stats
function weatherTurn() {	
	var fairW = {
		message:"the weather is fine. For that, we can be grateful. As for our overall situation...",
		food: 0,
		water: 0,
		hull: 0,
		thirst: 0,
		hunger: 0,
		morale: 0,
		overboard: 0
	};
	
	var lightS = {
		message: "A light storm knocked some of our provisions overboard, along with a few other things...",
		food: 0,
		water: 0,
		hull: 0,
		thirst: 0,
		hunger: 0,
		morale: 0,
		overboard: 0
	};

	var uniqueE = {
		message: "By good fortune our raft has steered itself into a large school of flying fish! The fish propel themselves onto our boat and everyone has the chance to catch one. Perhaps we will survive after all... (morale increased, counts as meal)",
		food: 0,
		water: 0,
		hull: 0,
		thirst: 0,
		hunger: 0,
		morale: 0,
		overboard: 0
	}; 
	
	var weatherArray = [fairW, fairW, fairW, lightS, lightS, uniqueE];
	var currentWeather = weatherArray[randomizer(0, weatherArray.length-1)];
}


//To Do: make the rules turn do something
function rulesTurn(){ 
	console.log("is ruleTurn even on?");
	for (i = 0; i < survivorArray.length; i++){

  }  

}

survPush(person);
 
function combiner(){
	dayTurn();
	weatherTurn();
	rulesTurn();
	domUpdate(state);
	stateUpdate(state);
	drawAllOpts(defaultOpts, "opt");
 }      
  
combiner();
weatherTurn();
rulesTurn();
domUpdate(state);
stateUpdate(state);



