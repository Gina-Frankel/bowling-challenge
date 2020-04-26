"use strict";

const STRIKE = 10

function Bowling() {
  this.score = 0;
  this.frameKey;
  this.frameScore;
  this.spare = false;
  this.strike = false;
  //this.rollCount = 1   maybe this should be instead of passing rollCount;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

Bowling.prototype.runCardMaking = function () {
  var rollCount;
  var frameCount;
  var pins;
  var score;
  this.makeCardTemplate();
  for (frameCount = 1; frameCount < 11; frameCount++) {
    this.frameKey = frameCount;
    for (rollCount = 1; rollCount < 3; rollCount++) {
      if (this.isSkipped(rollCount)) {
        pins = "x";
        score = this.calculateScore(0);
      } else {

        

        pins = this.getInput();

        //isStike?
        if ( (rollCount === 1 && pins === 10) || (this.frameKey === 2 && rollCount === 2 && this.card[this.frameKey -1]['r2PinsDown'] === 'x' )) {this.strike = true
        }else {
          this.strike = false
        }
        
        
       
       // scoreStrikes - next frame 
        if (this.strike === true && rollCount === 2) {
          console.log("in")
          var previousFrameKey = this.frameKey - 1;
          var previousFrameScore = this.card[previousFrameKey]["r2Score"];
          console.log(this.card[this.frameKey]['r1PinsDown'])
          this.card[previousFrameKey]["r2Score"] = previousFrameScore + pins + (this.card[frameCount]['r1PinsDown']);
          this.score = this.score + pins 

          // if  previous frame [r2 pinsDown] == x then add 10 
        }
        // ///  -----------------------------------------------------

      
    
        score = this.calculateScore(pins);
        /// end of conditional ----
      }
      this.fillCard(pins, score, rollCount);

     
      if (this.strike === false && this.spare === true ) {this.scoreSpares(rollCount, pins);}
      this.switchSpare();
      
      
    
    }
    
   
  }
  // end of loop big loop
  
  console.log(this.card)
  
  return this.card;
};

Bowling.prototype.isSkipped = function (rollCount) {
  if (rollCount === 2 && this.strike === true) {
    return true;
  }
};

Bowling.prototype.makeCardTemplate = function () {
  /// is everything here neccesary?
  var frameCount;
  var key;
  var obj = {};
  for (frameCount = 1; frameCount < 11; frameCount++) {
    key = frameCount;
    obj[key] = {};
    // obj[key] = { r1PinsDown: 0, r1Score: 0, r2PinsDown: 0, r2Score: 0 };
    this.card = obj;
  }
  return this.card;
};

Bowling.prototype.getInput = function () {
  return getRndInteger(1, 11);
};

Bowling.prototype.calculateScore = function (numPinsDown) {
  this.score = numPinsDown + this.score;
  return this.score;
};

Bowling.prototype.scoreSpares = function (rollCount, pins) {
  console.log("in scoreSpares")
  console.log(rollCount)
  //if ( rollCount === 1 && this.frameKey > 1) {
    var previousFrameKey = this.frameKey - 1;
    var previousFrameScore = this.card[previousFrameKey]["r2Score"];
    this.card[previousFrameKey]["r2Score"] = previousFrameScore + pins;
    this.score = this.score + pins;
  //}
};

Bowling.prototype.fillCard = function (pins, score, rollCount) {
  if (rollCount === 1) {
    this.card[this.frameKey]["r1PinsDown"] = pins;
    this.card[this.frameKey]["r1Score"] = score;
  }
  if (rollCount === 2) {
    this.card[this.frameKey]["r2PinsDown"] = pins;
    this.card[this.frameKey]["r2Score"] = score;
  }

  return this.card;
};

Bowling.prototype.switchSpare = function (rollCount) {
  if (
    this.card[this.frameKey]["r1PinsDown"] +
      this.card[this.frameKey]["r2PinsDown"] ===
      STRIKE
  ) {
    return (this.spare = true);
  } else {
    return (this.spare = false);
  }
};

Bowling.prototype.switchStrike = function (rollCount) {
  if (
    this.card[this.frameKey]["r1PinsDown"] === 10 ||
    this.card[this.frameKey]["r2PinsDown"] === 10
  ) {
    return (this.strike = true);
  } else {
    return (this.strike = false);
  }
};


// if (this.strike === true ) {
//   console.log("in method")
//   var previousFrameKey = this.frameKey - 1;
//   //var previousFrameScore = this.card[previousFrameKey]["r2Score"];
//   var roll1Score = this.card[this.frameKey]['r1PinsDown']
//   console.log(roll1Score )
//   this.card[previousFrameKey]["r2Score"] = this.card[previousFrameKey]["r2Score"] + pins
//   console.log(pins)
//   console.log(rollCount)
//   console.log(this.card[previousFrameKey]["r2Score"] )
//   this.score = this.score + pins;
//  }
