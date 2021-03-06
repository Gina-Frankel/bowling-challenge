describe("#Bowling", function () {
  const STRIKE = 10;
  var bowling;

  beforeEach(function () {
    bowling = new Bowling();
  });

  describe("#calculateScore ", function () {
    it(" returns 1", function () {
      expect(bowling.calculateScore(1)).toEqual(1);
    });
    it("adds amount  of pins down together and returns 5", function () {
      bowling.calculateScore(1);
      expect(bowling.calculateScore(4)).toEqual(5);
    });
  });

  describe("#makeCardTemplate", function () {
    it("stores -> roll1 number of pins down; roll1 score; roll2 number of pins down; roll2 score --- in key  labelled by the frame number ", function () {
      bowling.calculateScore(1);
      bowling.calculateScore(4);
      expect(bowling.makeCardTemplate()).toEqual({
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {},
        7: {},
        8: {},
        9: {},
        10: {},
      });
    });
  });

  describe("#fillCard", function () {
    describe("fills in card correctly on FIRST ROLL of frame", function () {
      it("fills in thhe number of PINS for first roll on FIRST frame ", function () {
        bowling.makeCardTemplate();
        bowling.frameKey = 1;
        expect(bowling.fillCard(1, 1, 1)[1]["r1PinsDown"]).toEqual(1);
      });

      it("fills in the SCORE for first roll on FIRST frame ", function () {
        bowling.makeCardTemplate();
        bowling.frameKey = 1;
        expect(bowling.fillCard(1, 1, 1)[1]["r1Score"]).toEqual(1);
      });

      //
      it("fills in the SCORE  for first roll on  THIRD  frame", function () {
        bowling.makeCardTemplate();
        bowling.frameKey = 3;
        expect(bowling.fillCard(1, 10, 1)[3]["r1Score"]).toEqual(10);
      });
    });

    describe("fills in card correctly on SECOND ROLL of frame", function () {
      it("fills in the number of PINS on second roll of FIRST frame ", function () {
        bowling.makeCardTemplate();
        bowling.frameKey = 1;
        expect(bowling.fillCard(2, 4, 2)[1]["r2PinsDown"]).toEqual(2);
        expect(bowling.fillCard(2, 4, 2)[1]["r1PinsDown"]).toEqual(undefined);
      });

      it("fills in the SCORE on second roll of THIRD frame ", function () {
        bowling.frameKey = 3;
        bowling.makeCardTemplate();
        expect(bowling.fillCard(1, 4, 2)[3]["r2Score"]).toEqual(4);
        expect(bowling.fillCard(1, 4, 2)[3]["r1Score"]).toEqual(undefined);
      });
    });
  });

  describe("runCardMaking", function () {
    describe("returns the correct amount of PINS", function () {
      it("fills in the roll 1 number of PINS for Frame 1  as 3", function () {
        spyOn(bowling, "getInput").and.returnValue(3);
        expect(bowling.runCardMaking()[1]["r1PinsDown"]).toEqual(3);
      });

      it("fills in the roll 1 number of PINS for Frame 3 as 5 ", function () {
        spyOn(bowling, "getInput").and.returnValue(5);
        expect(bowling.runCardMaking()[3]["r1PinsDown"]).toEqual(5);
      });
    });

    describe("returns the correct score", function () {
      it("fills in the roll 1 and 2 SCORE for Frame One", function () {
        spyOn(bowling, "getInput").and.returnValue(3);
        expect(bowling.runCardMaking()[1]["r1Score"]).toEqual(3);
        expect(bowling.card[1]["r2Score"]).toEqual(6);
      });

      it("fills in the roll 1 and 2 SCORE for Frame three  ", function () {
        bowling.makeCardTemplate();
        spyOn(bowling, "getInput").and.returnValue(2);
        expect(bowling.runCardMaking()[1]["r1Score"]).toEqual(2);
        //expect(bowling.card["frame3"]["r1Score"]).toEqual(10);
        //expect(bowling.card["frame3"]["r2Score"]).toEqual(12);
      });
    });
  });

  describe("Spares & Stikes", function () {
    var roll;
    beforeEach(function () {
      nonStrike = 3;
    });
    describe("Testing state of PROPERTY spare ", function () {
      it("spare default is false", function () {
        expect(bowling.spare).toEqual(false);
      });

      it("If a spare has been thrown, spare will change to true", function () {
        spyOn(bowling, "getInput").and.returnValue(5);
        bowling.runCardMaking();
        expect(bowling.spare).toEqual(true);
      });

      it("If a spare is not thrown and spare is true, spare will change to  false", function () {
        // the way that this is testing it is not quite how the program works as a first roll would change it to 'spare' state but this would need to add additional parts to the test which I am not sure are needed to test what I need to know 
        var alreadyCalled = false;
        spyOn(bowling, "switchStrike").and.callFake(function () {
          if (alreadyCalled)  return this.strike = false 
            alreadyCalled = true;
            return (this.strike = true);
        });
        bowling.runCardMaking();
        expect(bowling.strike).toEqual(false);
      });
    });

    describe("Testing state of PROPERTY strike ", function () {
      it("stike default position is false", function () {
        expect(bowling.strike).toEqual(false);
      });

      // is this a neccesary test for a unit test - it seems mot like a feature test
      it("#switchStrike - will return true if a strike is rolled  ", function () {
        bowling.makeCardTemplate();
        bowling.frameKey = 1;
        roll = 1;
        expect(bowling.switchStrike(roll, STRIKE)).toEqual(true);
        expect(bowling.strike).toEqual(true);
      });

      // need to use spies and already called  to test properly
      xit("#switchStrike - strike property will remain true in next frame", function () {});

      xit("#switchStrike - will return false when a strike is not rolled ", function () {});

      xit("#runCardMaking - will change property: strike to change to true when strike is rolled ", function () {
        expect(bowling.strike).toEqual(true);
      });

      xit("#runCardMaking - will change property strike to false when strike is rolled ", function () {});
    });
    describe("#scoreSpares ", function () {
      it(" bonus points - If ALL spares the score from the first roll of the next frame will always be added to the score for current frame (score will increase always by 15)", function () {
        spyOn(bowling, "getInput").and.returnValue(5);
        expect(bowling.runCardMaking()[1]["r2Score"]).toEqual(15);
        expect(bowling.card[2]["r2Score"]).toEqual(30);
        expect(bowling.card[3]["r2Score"]).toEqual(45);
      });

      it(" bonus points - If  spare the score from the first roll of the next frame will always be added to the score for current frame", function () {
        var alreadyCalled = false;
        spyOn(bowling, "getInput").and.callFake(function () {
          if (alreadyCalled) return 4;
          alreadyCalled = true;
          return 6;
        });
        expect(bowling.runCardMaking()[1]["r2Score"]).toEqual(14);
      });

      it(" The score from bonus points will be added to the accumulated score    ", function () {
        var alreadyCalled = false;
        spyOn(bowling, "getInput").and.callFake(function () {
          if (alreadyCalled) return 4;
          alreadyCalled = true;
          return 6;
        });
        expect(bowling.runCardMaking()[2]["r2Score"]).toEqual(22);
        expect(bowling.card[3]["r2Score"]).toEqual(30);
      });
    });

    describe("#runCardMaking - scoreStrike", function () {
      it("If a strike is thrown the score from BOTH rolls of the next frame will be added to the score for this frame", function () {
        var alreadyCalled = false;
        spyOn(bowling, "getInput").and.callFake(function () {
          if (alreadyCalled) return 1;
          alreadyCalled = true;
          return 10;
        });
        expect(bowling.runCardMaking()[1]["r2Score"]).toEqual(12);
        expect(bowling.card[2]["r2Score"]).toEqual(14);
      });

      it("The score from bonus points will be added to the accumulated score", function () {
        var alreadyCalled = false;
        spyOn(bowling, "getInput").and.callFake(function () {
          if (alreadyCalled) return 1;
          alreadyCalled = true;
          return 10;
        });
        expect(bowling.runCardMaking()[2]["r2Score"]).toEqual(14);
      });

      xit("If a strike is thrown everytime  the score will always increase bt  20", function () {
        spyOn(bowling, "getInput").and.returnValue(10);
        expect(bowling.runCardMaking()[1]["r2Score"]).toEqual(20);
        expect(bowling.card[4]["r2Score"]).toEqual(80);
      });
    });

    describe("#runCardMaking -  second roll is skipped after stike ", function () {
      it("If a stike is scored, the pins down on second turn will be marked with an x ", function () {
        spyOn(bowling, "getInput").and.returnValue(10);
        expect(bowling.runCardMaking()[1]["r1PinsDown"]).toEqual(10);
        expect(bowling.card[1]["r2PinsDown"]).toEqual("x");
        expect(bowling.card[5]["r2PinsDown"]).toEqual("x");
      });
    });
  });
});
