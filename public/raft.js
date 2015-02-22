alert("We're doing it live");
var randomizer = function (min, max){
  return Math.floor(Math.random()*((max-min) +1)) + min;
};


//This function creates the headers, array not in use yet
var headerArray = ["raft", "description", "options"];

function init(){
  for (var i = 0; i < arguments.length; i++){
    var t;
    var nodeParent = document.createElement("UL");
    nodeParent.setAttribute("class", arguments[i]);
    t = document.createTextNode(arguments[i]);
    nodeParent.appendChild(t);
    document.body.appendChild(nodeParent);
  }
}

init("raft", "description", "options");

//Stat variables (alt. to object literal)
var currentStats = [111, 111, 111, 56, 10];
var statNames = ["food", "water", "hull", "morale", "crew"];
var currentDay = 0;
var currentEvent;
var currentWeather = "the weather is good,";
var actionCounter = 5;
var sCounter = 0;
var currentDistance = 220;

//option constructor 
function OptionC (name, action, addnow){
  this.parent = "options";
  this.name = name;
  this.action = action;
  if (addnow){
    this.domadd();
  }
}

//this method keeps the dom in alignment with options, so far
OptionC.prototype.domadd = function(){
  var t;
  var node = document.createElement("LI");
  node.setAttribute("class", "optchild"); 
// if node is set to LI node.href = "#" doesn't work
//but if node is set to A, list line breaks don't work
  t = document.createTextNode(this.name);
  node.appendChild(t);
  node.addEventListener("click", this.action, false);
  var par = document. getElementsByClassName("options")[0];
  par.appendChild(node);
};

//constructor created options
var fishing = new OptionC("fishing", function(){
  currentStats[0] += 1;
  currentEvent = "After several hours of frustration, I caught a small fish.";
  updater();
}, true);
                       
var inspiring = new OptionC("inspiring", function(){
  currentStats[3] += 1;
  currentEvent = "I gave a rousing speech, reminding everyone of their patriotic duty to obey my orders at all times with no regard for their personal safety. If that doesn't inspire this crew, nothing will.";
  updater();
}, true);

var repairing = new OptionC("repairing", function(){
  currentStats[2] += 1;
  currentEvent = "I directed the crew to make repairs. There are still gaps in the hull, but not on any of the parts where I sleep.";
  updater();
}, true);

//subOptions

var secretly = new OptionC ("Secretly push someone overboard", function(){
  if (randomizer (1, 2) === 2){
    currentStats[4] -= 1;
    currentStats[3] -=5;
    currentEvent = "When everyone else was distracted I discreetly pushed one of the crew overboard and he was quickly lost. The needs of the many outweigh the needs of the one, especially when the one isn't me.";
    
  } else {
    currentStats[4] -= 1;
    currentStats[3]-= 25;
    currentEvent = "The crew member I pushed resisted mightly and made quite a commotion before going overboard. Some people are just selfish. There's been some grumbling, but I'm sure the men will soon forget this little incident.";
  }
  optsclear();
  updater();
}, false);

var drawstraws = new OptionC ("Order the men to draw straws", function(){
  currentStats[4] -= 1;
  currentStats[3] -= 10;
  currentEvent = "The crew has reluctantly agreed to my plan, and we are now one fewer.";
  optsclear();
  updater();
}, false);

//option arrays                             
var currentOptions = defaultOptions;
var defaultOptions = [fishing, inspiring, repairing];
var underHalfOptions = [secretly, drawstraws]; 


//clears options, used with special suboptions
function optsclear(){ 
  var optshold = document.getElementsByClassName("options")[0];
  while(optshold.childNodes.length > defaultOptions.length + 1){
    optshold.removeChild(optshold.lastChild);
  }
}                                

//The updater draws the DOM and counts actions
function updater (){
  var statshold = document.getElementsByClassName("raft")[0];
  while(statshold.childNodes.length > 1){
        statshold.removeChild(statshold.lastChild);
  }

  currentStats.forEach(function(value, index, array){
    var t;
    var node = document.createElement("LI");
    node.setAttribute("class", "raftchild"); 
    t = document.createTextNode(statNames[index] + ": " + value);
    node.appendChild(t);
    var par = document.getElementsByClassName("raft")[0];
    par.appendChild(node);
    });
    actionCounter--;
    var desc = document.getElementsByClassName("description")[0];
    var sorp = "things";
    var timeof = ", morning: ";
    if (actionCounter === 2){
      timeof = ", afternoon: ";
  }
  if (actionCounter === 1){
    timeof = ", evening: ";
    sorp = "thing";
  }
  desc.textContent = "Day " + currentDay + " captain's log" + timeof + currentWeather +  " and I think we're approximately " + currentDistance + " miles from land. " + currentEvent + " " + " I feel like there's enough time to do " + actionCounter + " more " + sorp + " today.";
  if (actionCounter === 0){
    rules();
  }
}

//rules
function rules(){
  var i;
  currentDistance -= 20;
  currentDay++;
  if (currentDistance <= 0){
    document.body.innerHTML = "<h1>" + "You Made It!" + "</h1>" + "<h3>" + "You reached land on day " + currentDay +   " with a crew of " + currentStats[4] + " and overall morale of " + currentStats[3] + ". Your total score is " + (currentStats[4] * currentStats[3]) + "." + "</h3>";
  }
  currentEvent = "It's a new day aboard the raft, filled with the promise of adventure and the vague hope that we're actually going in the right direction.";
  actionCounter = 4;
  
    if (currentStats[0] <= 50 && currentStats[1] <= 50 && sCounter === 0){
    sCounter = 1;
    currentEvent = "I can't help but notice that we're down to less than 50% of our starting provisions. I think it's time to lighten our load. ";
      for (i = 0; i < underHalfOptions.length; i++);{
        underHalfOptions[i].domadd();     
      }
   }
  
  currentStats.forEach(function(value, index, array){
    if(index != currentStats.length-1){
        array[index] -= currentStats[currentStats.length-1]+1;
      }
    });
    if (currentStats[0] >= 0){
      currentStats[3] += 5;
    } else {
      currentStats[0] = 0;
      currentStats[3] -= 10;
    }
    if (currentStats[3] <= 0){
   document.body.innerHTML = "<h1>" + "Your crew threw you overboard!" + "</h1>" + "<h3>" + "Your crew mutinied against you on day " + currentDay +   " with a crew of " + currentStats[4] + " and an overall morale of " + currentStats[3] + ". You were still " + currentDistance + " miles from land." + "</h3>";  
    }
  updater();
}  

updater();
rules();
