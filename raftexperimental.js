function disp(classname, parent, content, element, events){
   	var t;
	var i;
	var domChild = document.getElementsByClassName(classname)[0];
	t = document.createTextNode(content);
	if (domChild){
	  if(events !== undefined){
		domChild.parentNode.removeChild(domChild); 
		domChild = false;
	  } else { 
	    domChild.textContent = content;
	  }
	}
	if (!domChild){
	  var nodeParent = document.createElement(element);
	  nodeParent.setAttribute("class",  classname);
	  nodeParent.appendChild(t);
	  if (events !== undefined){
		for (i=0; i < events.length; i++){
	      nodeParent.addEventListener("click", events[i], false);
	    }          
	  }
	  parent.appendChild(nodeParent);
	}
}

function init(){
  for (var i = 0; i < arguments.length; i++){
    disp(arguments[i], document.body, arguments[i], "UL");
  }
}


var stat = function(name, startVal) {
	this.name = name;
	this.curVal = 0;
	this.parent = "Raft";
	var that = this;
	this.archive = [this.curVal];
    Object.defineProperties(this, {
        setVal: {
             "get": function() {
				 return that.curVal;
			 },
             "set": function(newVal) {
				   that.archive.push(newVal);
				   that.curVal = newVal;
				   var text = that.name + " " + that.curVal;
				   var par = document.getElementsByClassName(that.parent)[0];
				   var classname = that.parent + that.name;
				   disp(classname, par, text, "LI");

			 }
        }
    });
	  that.setVal = startVal;
};

var f = {};
var w = {};
var h = {};
var c = {};
var m = {};
var s = {};
var raftStats = [];

function statInit(){
 f = new stat("food:", 200);
 w = new stat("water:", 200);
 h = new stat("hull:", 200);
 c = new stat ("crew:", 5);
 m = new stat("morale:", 100);
 s = new stat("miles from land:", 300);
 raftStats = [c, f, w, h, m, s];
}

function turnRules(){
    var i;	
	var win = false;
	function newGameOpt(){
	  init("Options"); 
	  newGame = new opt("New Game?", function() {
                 initAll();
				desc1.setVal = "As you sail away from the wreckage of your ship on a tiny raft, you get a strong feeling of deja vu, how strange.";				
      });	
	}
	for(i=0; i < raftStats.length; i++){
	  if (raftStats[i].name === "miles from land:"){
	      raftStats[i].setVal -= 20;
		  console.log(raftStats[i].curVal);
		  if (raftStats[i].curVal <= 0){
		      newGameOpt();
			  win = true;
		  }
		  if (win) {
			 alert("Congratulations You made it to land on day " + desc1.day +  "! You're a hero, sort of!");
		  } else {
			  continue;
		  }
	  }
	  if (raftStats[i].name === "crew:"){
		  if (raftStats[i].curVal <= 2){
		    overboard = new opt("Push someone overboard", function(){ desc1.setVal = "When I jumped overboard, I suddenly realized I'd forgotten" +  
		    " how many people were left on the raft. My journey ended at least" + s.curVal + " miles from land."; c.setVal--;
		     newGameOpt();   
	      });
	  }
		  continue;
	  }
	  if (raftStats[i].name === "morale:"){
	    	  raftStats[i].setVal -= 2;
	  } else {
	   raftStats[i].setVal -= c.setVal;
	  if (raftStats[i].setVal <= 0){
        raftStats[i].setVal = 0;  
	    }
	  }
	}
	 	
}

var desc = function(startVal) {
	this.name = "journal";
	this.curVal = "";
	this.parent = "Description";
	var that = this;
	this.archive = [this.curVal];
	this.day = 0;
    Object.defineProperties(this, {
        setVal: {
             "get": function() {
				 return that.curVal;
			 },
             "set": function(newVal) {
				   that.day++;
				   that.curVal = newVal;
				   var text = "Day " + that.day + ": " + that.curVal;
				   that.archive.push(text);
				   var par = document.getElementsByClassName(that.parent)[0];
				   var classname = that.parent + that.name;
				   disp(classname, par, text, "P");
			 }
        }
    });
	that.setVal = startVal;
};	


var opt = function(name, startVal) {
	this.name = name;
	this.curVal = "";
	this.parent = "Options";
	var that = this;
	this.archive = [this.curVal];
    Object.defineProperties(this, {
        setVal: {
             "get": function() {
				 return that.curVal;
			 },
             "set": function(newVal) {
				   that.archive.push(newVal);
				   that.curVal = newVal;
				    var classname = that.parent + that.name;
				    var par = document.getElementsByClassName(that.parent)[0];
				  disp(classname, par, that.name, "LI", [turnRules, that.curVal]);
			 }
        }
    });
	that.setVal = startVal;
};

var journal = {};
var desc1 = {};
var fish = {};
var repair = {};
var overboard = {};
var newGame = {};

function optInit(){
  journal = new opt ("Look at my old journal entries", function() {desc1.setVal = "I spent all day yesterday looking over my journal, and this what I saw: " + 
	desc1.archive.join(" ");});
  desc1 = new desc("So either you definitely should or definitely should or definitely should not sail through uncharted waters at night. The other survivors of the wreck agree that it's definitely one or the other, but there's no way to be sure.");
  fish = new opt("Fish", function() { desc1.setVal = "After spending all of yesterday fishing, I caught something!"; f.setVal += 2;});
  repair = new opt("Repair", function(){ desc1.setVal = "The rudimentary repairs we managed were better than nothing, but we're still dangerously overloaded."; h.setVal++;});
  overboard = new opt("Push someone overboard", function(){ desc1.setVal = "Although our supplies will last longer now, for some strange reason the crew was upset with me and refused to do anything else for the rest of the day."; c.setVal--; m.setVal-= 10;});
 newGame = {};
}

function initAll(){
init("Raft", "Description", "Options");	
statInit();
optInit();
}


initAll();