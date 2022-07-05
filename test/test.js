
let Auction = artifacts.require('./Auction.sol');

let auctionInstance;

contract('AuctionContract', function (accounts) {

  //accounts[0] is the default account

  describe('Contract deployment', function () {

    it('Contract deployment', function () {

      //Fetching the contract instance of our smart contract

      return Auction.deployed().then(function (instance) {

        //We save the instance in a global variable and all smart contract functions are called using this

        auctionInstance = instance;

        assert(

          auctionInstance !== undefined,

          'Auction contract should be defined'

        );

      });

    });

    it('Initial rule with corrected startingPrice and minimumStep', function () {

      //Fetching the rule of Auction

      return auctionInstance.rule().then(function (rule) {

        //We save the instance in a global variable and all smart contract functions are called using this

        assert(rule !== undefined, 'Rule should be defined');



        assert.equal(rule.startingPrice, 50, 'Starting price should be 50');

        assert.equal(rule.minimumStep, 5, 'Minimum step should be 5');

      });

    });

  });

  describe('Register', function () {

    it('Only Auctioneer can register bidders', function () {
      return auctionInstance.register(accounts[1], 255, { from: accounts[0] })
        .then(function () {
          return auctionInstance.bidders(accounts[1])
        })
        .then(function (currentBidder) {
          assert.equal(255, currentBidder.token, 'Account adrress of bidders should equal account address of currentBidder');
          return auctionInstance.register(accounts[2], 255, { from: accounts[0] });
        })
        .then(function () {
          return auctionInstance.bidders(accounts[2])
        })
        .then(function (currentBidder) {
          assert.equal(255, currentBidder.token, 'Account adrress of bidders should equal account address of currentBidder');
          return auctionInstance.register(accounts[3], 255, { from: accounts[0] });
        })
        .then(function () {
          return auctionInstance.bidders(accounts[3])
        })
        .then(function (currentBidder) {
          assert.equal(255, currentBidder.token, 'Account adrress of bidders should equal account address of currentBidder');
          return auctionInstance.register(accounts[4], 255, { from: accounts[0] });
        })
        .then(function () {
          return auctionInstance.bidders(accounts[4])
        })
        .then(function (currentBidder) {
          assert.equal(255, currentBidder.token, 'Account adrress of bidders should equal account address of currentBidder');
        })
    });

    it('Should NOT accept unauthorized regisatration', function () {
      return auctionInstance.register(accounts[5], 255, { from: accounts[1] })
        .then(function (result) {
          throw ("Condition not implemented in Smart Contract");
        })
        .catch(function (e) {
          if (e === "Condition not implemented in Smart Contract") {
            assert(false);
          } else {
            assert(true);
          }
        })
    });

    it('This action is only available in Created State', function () {

      return auctionInstance.state().then(function (state) {
        assert.equal(state, 0, 'Register is only available in Created State')
        return auctionInstance.register(accounts[6], 255, { from: accounts[0] });
      })
    });

    it('Should NOT accept when this Action is not in the Created State', function () {
      return auctionInstance.announce({ from: accounts[0] })
        .then(function (result) {
          throw ("Announce not implemented in this Stage");
        })
        .catch(function (e) {
          if (e === "Announce not implemented in this Stage") {
            assert(false);
          } else {
            assert(true);
          }
        })
    })

    it('Should NOT accept empty address and amount of tokens', function () {
      return auctionInstance.register({ from: accounts[0] })
        .then(function (result) {
          throw ("Condition not implemented in Smart Contract");
        })
        .catch(function (e) {
          if (e === "Condition not implemented in Smart Contract") {
            assert(false);
          } else {
            assert(true);
          }
        })
    })


  });

  describe('Start the session', function () {

    it('Should NOT accept when this Action is not in the Created State', function () {
      return auctionInstance.announce({ from: accounts[0] })
        .then(function (result) {
          throw ("Announce not implemented in this Stage");
        })
        .catch(function (e) {
          if (e === "Announce not implemented in this Stage") {
            assert(false);
          } else {
            assert(true);
          }
        })
    });

    it('Only Owner start session', function () {
      return auctionInstance.auctioneer().then(function (owner) {
        assert.equal(owner, accounts[0], 'Owner must be start session')
        return auctionInstance.startSession({ from: accounts[0] });
      })
    });

    // it('This action is only available in Created State', function () {

    //   return auctionInstance.state().then(function (state) {
    //     assert.equal(state, 0, 'Bid is only available in Started State')
    //     return auctionInstance.startSession({ from: accounts[0] });
    //   })
    // });

    it('Should NOT accept unauthorized start the session', function () {
      return auctionInstance.startSession({ from: accounts[1] })
        .then(function (result) {
          throw ("Condition not implemented in Smart Contract");
        })
        .catch(function (e) {
          if (e === "Condition not implemented in Smart Contract") {
            assert(false);
          } else {
            assert(true);
          }
        })
    });

  });


  describe('Bid', function () {

    it('Should NOT accept unregistered bid', function () {
      return auctionInstance.bid(55, { from: accounts[8] })
        .then(function (result) {
          throw ("Condition not implemented in Smart Contract");
        })
        .catch(function (e) {
          if (e === "Condition not implemented in Smart Contract") {
            assert(false);
          } else {
            assert(true);
          }
        })
    });

    it('The next price must be inputted', function () {
      return auctionInstance.bid({ from: accounts[1] })
        .then(function (result) {
          throw ("Announce not implemented in this Stage");
        })
        .catch(function (e) {
          if (e === "Announce not implemented in this Stage") {
            assert(false);
          } else {
            assert(true);
          }
        })
    });

    it('All bidders can bid', function () {

      return auctionInstance.bid(55, { from: accounts[1] })
        .then(function () {
          return auctionInstance.currentPrice();
        })
        .then(function (price) {
          assert(55, price);
        })
        .then(function () {
          return auctionInstance.currentWinner();
        })
        .then(function (winner) {
          // if accounts[1] bid cao giá nhất
          assert.equal(accounts[1], winner);
          return auctionInstance.bid(60, { from: accounts[2] })
        })
        .then(function () {
          return auctionInstance.currentPrice();
        })
        .then(function (price) {
          assert.equal(60, price);
        })
        .then(function () {
          return auctionInstance.currentWinner();
        })
        .then(function (winner) {
          // if accounts[2] bid cao giá nhất
          assert.equal(accounts[2], winner);
          return auctionInstance.bid(65, { from: accounts[3] })
        })
        .then(function () {
          return auctionInstance.currentPrice();
        })
        .then(function (price) {
          assert.equal(65, price);
        })
        .then(function () {
          return auctionInstance.currentWinner();
        })
        .then(function (winner) {
          // if accounts[3] bid cao giá nhất
          assert.equal(accounts[3], winner);
          return auctionInstance.bid(70, { from: accounts[4] })
        })
        .then(function () {
          return auctionInstance.currentPrice();
        })
        .then(function (price) {
          assert.equal(70, price);
        })
        .then(function () {
          return auctionInstance.currentWinner();
        })
        .then(function (winner) {
          // if account[4] bid cao giá nhất
          assert.equal(accounts[4], winner);
        })

    })

    it('This action is only available in Started State', function () {

      return auctionInstance.state().then(function (state) {
        assert.equal(state, 1, 'Bid is only available in Started State')
        return auctionInstance.bid(75, { from: accounts[1] });
      })
    });

    it('Should NOT accept when this Action is not in the Started State', function () {
      return auctionInstance.register(accounts[7], 255, { from: accounts[0] })
        .then(function (result) {
          throw ("Register not implemented in this Stage");
        })
        .catch(function (e) {
          if (e === "Register not implemented in this Stage") {
            assert(false);
          } else {
            assert(true);
          }
        })
    });

    it('The next price must higher than the latest price plus the minimum step', function () {
      return auctionInstance.state().then(function (state) {
        return auctionInstance.bid(80, { from: accounts[1] })
          .then(function () {
            return auctionInstance.bid(86, { from: accounts[2] })
          })
          .then(function () {
            return auctionInstance.currentPrice();
          })
          .then(function (price) {
            assert.equal(true, price >= 80);
          })
      })
    });
  });

  describe('Announce', function () {

    it('Should NOT accept when this Action is not in the Started State - This action is only available in Started State.', function () {
      return auctionInstance.register(accounts[9], 255, { from: accounts[0] })
        .then(function (result) {
          throw ("Register not implemented in this Stage");
        })
        .catch(function (e) {
          if (e === "Register not implemented in this Stage") {
            assert(false);
          } else {
            assert(true);
          }
        })
    });

    it('Should NOT accept unauthorized can Announce - Only the Auctioneer can Announce', function () {
      return auctionInstance.announce({ from: accounts[1] })
        .then(function (result) {
          throw ("Condition not implemented in Smart Contract");
        })
        .catch(function (e) {
          if (e === "Condition not implemented in Smart Contract") {
            assert(false);
          } else {
            assert(true);
          }
        })
    });

    // it('This action is only available in Started State', function () {

    //   return auctionInstance.state().then(function (state) {
    //     assert.equal(state, 1, 'Announce is only available in Started State')
    //     return auctionInstance.announce({ from: accounts[0] });
    //   })
    // });

    // it('Only the Auctioneer can Announce', function () {
    //   return auctionInstance.auctioneer().then(function (owner) {
    //     assert.equal(owner, accounts[0], 'Owner must be announce')
    //     return auctionInstance.announce({ from: accounts[0] });
    //   })
    // });

    it('After 3 times (4th call of this action), the session will end', function () {
      return auctionInstance.announce({ from: accounts[0] })
        .then(function () {
          return auctionInstance.announcementTimes()
        })
        .then(function (time) {
          assert.equal(1, time)
          // Only the Auctioneer can Announce
          return auctionInstance.announce({ from: accounts[0] })
        })
        .then(function () {
          return auctionInstance.announcementTimes()
        })
        .then(function (time) {
          assert.equal(2, time)
          // Only the Auctioneer can Announce
          return auctionInstance.announce({ from: accounts[0] })
        })
        .then(function () {
          return auctionInstance.announcementTimes()
        })
        .then(function (time) {
          assert.equal(3, time)
          // Only the Auctioneer can Announce
          return auctionInstance.announce({ from: accounts[0] })
        })
        .then(function () {
          return auctionInstance.state()
        })
        .then(function (state) {
          // This action is only available in Started State
          assert.equal(2, state, 'message')
        })
    })
  });

  describe('Get back the deposit', function () {

    it('getDeposit is only available in Closing State', function () {

      return auctionInstance.state().then(function (state) {
        assert.equal(state, 2, 'getDeposit is only available in Closing State')
        return auctionInstance.getDeposit({ from: accounts[1] });
      })
    });

    it('Should NOT accept when this Action is not in the Closing State', function () {
      return auctionInstance.register(accounts[7], 255, { from: accounts[0] })
        .then(function (result) {
          throw ("Register not implemented in this Stage");
        })
        .catch(function (e) {
          if (e === "Register not implemented in this Stage") {
            assert(false);
          } else {
            assert(true);
          }
        })
    });

    it('Should NOT accept Winner can getDeposit', function () {
      // winner hiện tại đang là account[2], nên là trong trường hợp này account[2] không được getDeposit
      return auctionInstance.getDeposit({ from: accounts[2] })
        .then(function (result) {
          throw ("Condition not implemented in Smart Contract");
        })
        .catch(function (e) {
          if (e === "Condition not implemented in Smart Contract") {
            assert(false);
          } else {
            assert(true);
          }
        })
    });

    it('All the Bidders (except the Winner) can Get back the deposit.', function () {

      // winner hiện tại đang là account[2], nên là trong trường hợp này account[2] không được getDeposit
      let winner = auctionInstance.currentWinner();

      return auctionInstance.getDeposit({ from: accounts[1] })
        .then(function () {
          return winner
        })
        .then(function (winner) {
          assert.notEqual(accounts[1], winner);
          return auctionInstance.bidders(accounts[1]);;
        })
        .then(function (currentBidder) {
          assert.equal(0, currentBidder.deposit);
          return auctionInstance.getDeposit({ from: accounts[3] });
        })
        .then(function () {
          return winner
        })
        .then(function (winner) {
          assert.notEqual(accounts[3], winner);
          return auctionInstance.bidders(accounts[3]);
        })
        .then(function (currentBidder) {
          assert.equal(0, currentBidder.deposit);
          return auctionInstance.getDeposit({ from: accounts[4] });
        })
        .then(function () {
          return winner
        })
        .then(function (winner) {
          assert.notEqual(accounts[4], winner);
          return auctionInstance.bidders(accounts[4]);
        })
        .then(function (currentBidder) {
          assert.equal(0, currentBidder.deposit);
        })
    });

  });


});