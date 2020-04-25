"use strict";

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
  this.makeCardTemplate();
  var rollCount;
  var frameCount;
  for (frameCount = 1; frameCount < 11; frameCount++) {
    this.frameKey = frameCount;
    for (rollCount = 1; rollCount < 3; rollCount++) {
      var pins = this.getInput();
      this.scoreSpares(rollCount, pins);

      var score = this.calculateScore(pins);
      this.fillCard(pins, score, rollCount);
    }
    if (this.switchSpare() === true) {
      this.spare = true;
    } else {
      this.spare = false;
    }
  }
  return this.card;
};

Bowling.prototype.makeCardTemplate = function () {
  var frameCount;
  var counter2;
  var obj = {};
  for (frameCount = 1; frameCount < 11; frameCount++) {
    var key = frameCount;
    obj[key] = { r1PinsDown: 0, r1Score: 0, r2PinsDown: 0, r2Score: 0 };
    this.card = obj;
  }
  return this.card;
};

Bowling.prototype.getInput = function () {
  return getRndInteger(3, 11);
};

Bowling.prototype.calculateScore = function (numPinsDown) {
  this.score = numPinsDown + this.score;
  return this.score;
};

Bowling.prototype.scoreSpares = function (rollCount, pins) {
  if (this.spare === true && rollCount === 2 && this.frameKey > 1) {
    var previousFrameKey = this.frameKey - 1;
    var previousFrameScore = this.card[previousFrameKey]["r2Score"];
    this.card[previousFrameKey]["r2Score"] = previousFrameScore + pins;
    //console.log(this.card[previousFrameKey]["r2Score"]);
    //console.log("");
    this.score = this.score + pins;
  }
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
  // console.log(this.frameKey )
  // console.log(`roll ${rollCount}`);
  // console.log(`pins ${pins}`)
  // console.log(score )
  // console.dir(this.card);
  // console.log(" ");
  return this.card;
};

Bowling.prototype.switchSpare = function (rollCount) {
  console.log("switchh spare method");
  console.log(this.frameKey);
  console.dir(this.card);
  if (
    this.card[this.frameKey]["r1PinsDown"] +
      this.card[this.frameKey]["r2PinsDown"] ===
    10
  ) {
    return true;
  } else {
    return false;
  }
};
