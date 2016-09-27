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
    oneRollElem: document.querySelector('.oneRoll'),
    twoRollElem: document.querySelector('.twoRoll'),
    threeRollElem: document.querySelector('.threeRoll'),
    fourRollElem: document.querySelector('.fourRoll'),
    fiveRollElem: document.querySelector('.fiveRoll'),
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
  this.currentRoll = [0,0,0,0,0,0];
  this.currentRoundNum = 0;
  this.currentRound = this.rounds[this.currentRoundNum];
  this.win = false;

  //Roll the dice. Called when button is clicked
  this.roll = function () {
    //Add 1 to the number of rolls in the current round.
    this.currentRound = this.rounds[this.currentRoundNum];
    this.currentRound.numRolls++;
    //Shrink the button slightly to look clicked
    this.regions.rollBtnElem.style.transform = "scale(0.9)";
    var resetBtn = function() {
      this.regions.rollBtnElem.style.transform = "scale(1.0)";
    }
    var timerHandle = setTimeout(resetBtn.bind(this), 100);
    var oneRoll = Math.ceil(Math.random()*6);
    var twoRoll = Math.ceil(Math.random()*6);
    var threeRoll = Math.ceil(Math.random()*6);
    var fourRoll = Math.ceil(Math.random()*6);
    var fiveRoll = Math.ceil(Math.random()*6);
    //For Testing:
    // var oneRoll = 1;
    // var twoRoll = 2;
    // var threeRoll = 3;
    // var fourRoll = 4;
    // var fiveRoll = 5;
    this.regions.oneRollElem.innerHTML = oneRoll;
    this.regions.twoRollElem.innerHTML = twoRoll;
    this.regions.threeRollElem.innerHTML = threeRoll;
    this.regions.fourRollElem.innerHTML = fourRoll;
    this.regions.fiveRollElem.innerHTML = fiveRoll;
    this.currentRoll = [oneRoll, twoRoll, threeRoll, fourRoll, fiveRoll].sort();
    //After dice are rolled, check the amounts
    this.checkRoll(oneRoll, twoRoll, threeRoll, fourRoll, fiveRoll);
  };

  this.counts = [0, 0, 0, 0, 0, 0];
  //Special function to be able to find max value of array
  this.max = function( array ){
      return Math.max.apply( Math, array );
  };

  //Check the dice roll for a 7 or 11
  this.checkRoll = function(first, second, third, fourth, fifth) {
    var readOutString = 'Testing';
    var readOutSmallString = 'Testing';
    var rolls = [first, second, third, fourth, fifth];

    for (var j = 0; j < rolls.length; j++) {  //Loop over all the rolls
      //Current dice value while looping is rolls[j]
      //Log the current dice value in its corresponding index in the count array
      this.counts[rolls[j]-1]++;
    }
    this.outputDebugging();
    var oldTime = this.currentRound.startTime;
    var newTime = new Date();
    var numTries = this.currentRound.numRolls;
    var numSeconds = Math.round((newTime - oldTime)/100)/10;
    readOutSmallString = "(It took you " + numTries + " tries and " + numSeconds + " seconds)";

    if (this.currentRoll[0] == 1) {
      if (this.currentRoll.includes(2) && this.currentRoll.includes(3) && this.currentRoll.includes(4) && this.currentRoll.includes(5)) {
        readOutString = "Large Straight!";
        this.win = true;
      } else if (this.currentRoll.includes(2) && this.currentRoll.includes(3) && this.currentRoll.includes(4)) {
        readOutString = "Small Straight!";
        this.win = true;
      } else if (this.currentRoll.includes(3) && this.currentRoll.includes(4) && this.currentRoll.includes(5) && this.currentRoll.includes(6)) {
        readOutString = "Small Straight!";
        this.win = true;
      }
    } else if (this.currentRoll[0] == 2) {
      if (this.currentRoll.includes(3) && this.currentRoll.includes(4) && this.currentRoll.includes(5) && this.currentRoll.includes(6)) {
        readOutString = "Large Straight!";
        this.win = true;
      } else if (this.currentRoll.includes(3) && this.currentRoll.includes(4) && this.currentRoll.includes(5)) {
        readOutString = "Small Straight!";
        this.win = true;
      }
    } else if (this.currentRoll[0] == 3) {
      if (this.currentRoll.includes(4) && this.currentRoll.includes(5) && this.currentRoll.includes(6)) {
        readOutString = "Small Straight!";
        this.win = true;
      }
    }
    if (this.max(this.counts) == 5) {
      readOutString = 'Yahtzee!';
      this.win = true;
    } else if (this.max(this.counts) == 4) {
      readOutString = "Four of a kind!";
      this.win = true;
    } else if (this.max(this.counts) == 3) {
      if (this.counts.includes(2)) {
        readOutString = "Full House!";
        this.win = true;
      } else {
        readOutString = "Three of a kind!";
        this.win = true;
      }
    }

    if (this.win) {
      readOutSmallString = "(It took you " + numTries + " tries and " + numSeconds + " seconds)";
      this.currentRoundNum++;
      var newRound = new Round(newTime);
      this.rounds.push(newRound);
      this.win = false;
    } else {
      readOutString = "Try again";
      readOutSmallString = "";
    }

    this.counts = [0, 0, 0, 0, 0, 0];

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
    console.log("Current Roll: " + this.currentRoll);
    console.log("Roll counts: " + this.counts);
    console.log("Number of Same: " + this.max(this.counts));
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
