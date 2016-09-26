/*
*  Game object contains:
*   -regions
*   -startDate
*   -getDate
*   -getTime
*   -
*  @param startDate - the date the game is created
*/
function Game(startDate) {
  //Keep track of all HTML elements
  this.regions = {
    dateElem: document.querySelector('.date'),
    timeElem: document.querySelector('.time'),
    leftRollElem: document.querySelector('.leftRoll'),
    rightRollElem: document.querySelector('.rightRoll'),
    rollBtnElem: document.querySelector('.rollBtn'),
    readOutElem: document.querySelector('.readOut'),
    readOutSmallElem: document.querySelector('.readOutSmall'),
  };

  //Store the complete date, unformatted
  this.startDate = startDate;

  //Get the formatted date
  this.getDate = function() {
    var dateString = '';
    dateString = startDate.getFullYear() + "-" +
                (startDate.getMonth() + 1) + "-" +
                 startDate.getDate();
     return dateString;
  };

  /*  Get the formatted time
  *   (Note how adding a zero before items less than 10)
  */
  this.getTime = function() {
    var timeString = '';
    timeString = (startDate.getHours() > 10 ? startDate.getHours() :
                 ("0"+startDate.getHours()) ) + ":" +
                 (startDate.getMinutes() > 10 ? startDate.getMinutes() :
                 ("0"+startDate.getMinutes()) ) + ":" +
                 (startDate.getSeconds() > 10 ? startDate.getSeconds() :
                 ("0"+startDate.getSeconds()) );
    return timeString;
  };

  //Keep track of the rounds
  this.rounds = [];
  this.currentRoundNum = 0;
  this.currentRound = this.rounds[this.currentRoundNum];

  //Roll the dice. Called when button is clicked
  this.roll = function () {
    //Add 1 to the number of rolls in the current round.
    this.currentRound = this.rounds[this.currentRoundNum];
    this.currentRound.numRolls++;
    this.outputDebugging();
    //Shrink the button slightly to look clicked
    this.regions.rollBtnElem.style.transform = "scale(0.9)";
    var resetBtn = function() {
      this.regions.rollBtnElem.style.transform = "scale(1.0)";
    }
    var timerHandle = setTimeout(resetBtn.bind(this), 100);
    var leftRoll = Math.ceil(Math.random()*6);
    var rightRoll = Math.ceil(Math.random()*6);
    this.regions.leftRollElem.innerHTML = leftRoll;
    this.regions.rightRollElem.innerHTML = rightRoll;
    //After dice are rolled, check the amounts
    this.checkRoll(leftRoll, rightRoll);
  };

  //Check the dice roll for a 7 or 11
  this.checkRoll = function(left, right) {
    var readOutString = '';
    var readOutSmallString = '';
    var sum = left + right;
    if (sum == 7 || sum == 11) {
      readOutString = "Winner!";
      var oldTime = this.currentRound.startTime;
      var newTime = new Date();
      var numTries = this.currentRound.numRolls;
      var numSeconds = Math.round((newTime - oldTime)/100)/10;
      readOutSmallString = "(It took you " + numTries + " tries and " + numSeconds + " seconds)";
      this.currentRoundNum++;
      var newRound = new Round(newTime);
      this.rounds.push(newRound);
    } else {
      readOutString = "Try Again";
    }
    this.regions.readOutElem.innerHTML = readOutString;
    this.regions.readOutSmallElem.innerHTML = readOutSmallString;
  };

  //Code for outputting debug variables
  this.outputDebugging = function() {
    console.clear();
    console.log("Total number of rounds: " + this.rounds.length);
    console.log("Current Round Number: " + this.currentRoundNum);
    console.log("Current Round Start Time: "+this.currentRound.startTime);
    console.log("Current Round Rolls: " + this.currentRound.numRolls);
  }

  //Initialize Game. Update HTML with startdate+time, bind button
  //click to the roll function, and create first round.
  this.init = function() {
    this.regions.dateElem.innerHTML = this.getDate();
    this.regions.timeElem.innerHTML = this.getTime();
    this.regions.rollBtnElem.addEventListener('click',
                                      this.roll.bind(this));
    var firstRound = new Round(this.startDate);
    this.rounds.push(firstRound);
  };
}

function Round(start) {
  this.startTime = start;
  this.numRolls = 0;
}

function playGame() {
  var game = new Game(new Date());
  game.init();
}

playGame();
