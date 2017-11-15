require("babel-polyfill");
const BN = require("bignumber.js");
const GAS_PRICE = 20000000000 * 5;

const util = require("./util.js");
const ClockAuction = artifacts.require("./ClockAuction.sol");
const NonFungibleMock = artifacts.require(
  "./test/contracts/NonFungibleMock.sol"
);

contract("Clock Auction", function(accounts) {
  if (util.isNotFocusTest("auction")) return;

  const eq = assert.equal.bind(assert);
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];
  let tokenId1, tokenId2;

  // Deployed contract instances
  let auction, ownership;

  // Deploys contracts and creates an NFT for owner/user1
  const deploy = async function(cut = 0) {
    ownership = await NonFungibleMock.new();
    auction = await ClockAuction.new(ownership.address, cut, { from: owner });

    await ownership.createToken({ from: owner });
    await ownership.createToken({ from: user1 });
    tokenId1 = await ownership.tokensOfOwnerByIndex(owner, 0);
    tokenId2 = await ownership.tokensOfOwnerByIndex(user1, 0);
  };

  describe("Initial State", function() {
    beforeEach(deploy);

    it("should start with owner and NFT address set", async function() {
      const ownerAddr = await auction.owner();
      const nftAddr = await auction.nonFungibleContract();
      eq(ownerAddr, owner);
      eq(nftAddr, ownership.address);
    });
  });

  describe("Create auction", function() {
    beforeEach(deploy);

    it("should fail to create auction for NFT you don't own", async function() {
      await util.expectThrow(
        auction.createAuction(tokenId1, 100, 200, 60, user1, { from: user1 })
      );
    });
    it("should fail to create auction for duration too large", async function() {
      const duration = new BN(2).pow(70);
      await ownership.approve(auction.address, tokenId1, { from: owner });
      await util.expectThrow(
        auction.createAuction(tokenId1, 100, 200, duration, owner, {
          from: owner
        })
      );
    });
    it("should fail to create auction for nonexistant NFT", async function() {
      const noSuchTokenId = tokenId1 + tokenId2;
      await util.expectThrow(
        auction.createAuction(noSuchTokenId, 100, 200, 60, owner, {
          from: owner
        })
      );
    });
    it("should fail to create auction without first approving auction contract", async function() {
      await util.expectThrow(
        auction.createAuction(tokenId1, 100, 200, 60, owner, { from: owner })
      );
    });
    it("should fail to create auction for NFT already on auction", async function() {
      // Create the auction
      await ownership.approve(auction.address, tokenId1, { from: owner });
      await auction.createAuction(tokenId1, 100, 200, 60, owner, {
        from: owner
      });
      // Try to create the auction again
      await util.expectThrow(
        auction.createAuction(tokenId1, 100, 200, 60, owner, { from: owner })
      );
    });
    it("should be able to create auction", async function() {
      await ownership.approve(auction.address, tokenId1, { from: owner });
      await auction.createAuction(tokenId1, 100, 200, 60, owner, {
        from: owner
      });

      // Auction info should be correct
      const [
        seller,
        startingPrice,
        endingPrice,
        duration,
        startedAt
      ] = await auction.getAuction(tokenId1);
      eq(seller, owner);
      assert(startingPrice.eq(100));
      assert(endingPrice.eq(200));
      assert(duration.eq(60));
    });
  });

  describe("Bidding", function() {
    beforeEach(async function() {
      await deploy();
      await ownership.approve(auction.address, tokenId1, { from: owner });
      await auction.createAuction(tokenId1, 100, 200, 60, owner, {
        from: owner
      });
    });

    it("should fail to bid with insufficient value", async function() {
      await util.expectThrow(auction.bid(tokenId1, { from: user1, value: 50 }));
    });
    it("should fail to bid if auction has been concluded", async function() {
      await auction.cancelAuction(tokenId1, { from: owner });
      await util.expectThrow(
        auction.bid(tokenId1, { from: user1, value: 101 })
      );
    });
    it("should be able to bid", async function() {
      const ownerBal1 = await util.getBalance(owner);
      await auction.bid(tokenId1, { from: user1, value: 101 });
      // Owner should have received 100 wei
      console.log("start");
      const ownerBal2 = await util.getBalance(owner);
      console.log(ownerBal2.toString());
      const ownerDiff = ownerBal2.sub(ownerBal1);
      console.log(ownerDiff.toString());
      assert(ownerDiff.eq(100) || ownerDiff.eq(101));
      // Bidder should own NFT
      const token1Owner = await ownership.ownerOf(tokenId1);
      console.log(token1Owner);
      console.log(user1);
      eq(token1Owner, user1);
    });
    it("should be able to bid at endingPrice if auction has passed duration", async function() {
      const ownerBal1 = await util.getBalance(owner);
      await util.forwardEVMTime(120);
      await auction.bid(tokenId1, { from: user1, value: 200 });
      // Owner should have received 200 wei
      const ownerBal2 = await util.getBalance(owner);
      const ownerDiff = ownerBal2.sub(ownerBal1);
      assert(ownerDiff.eq(200));
      // Bidder should own NFT
      const token1Owner = await ownership.ownerOf(tokenId1);
      eq(token1Owner, user1);
    });
    it("should fail to bid after someone else has bid", async function() {
      await auction.bid(tokenId1, { from: user1, value: 101 });
      await util.expectThrow(
        auction.bid(tokenId1, { from: user2, value: 101 })
      );
    });
    it("should be able to bid in middle of auction", async function() {
      const ownerBal1 = await util.getBalance(owner);
      // Forward time 30s. NOTE: Due to some weirdness in the EVM, it
      // may also forward time by 31s, so price will be either 150/151.
      await util.forwardEVMTime(30);
      await auction.bid(tokenId1, { from: user1, value: 160 });
      // Seller should have received 150 wei
      const ownerBal2 = await util.getBalance(owner);
      const diff = ownerBal2.sub(ownerBal1);
      assert(diff.gt(149));
      // Bidder should own NFT
      const token1Owner = await ownership.ownerOf(tokenId1);
      eq(token1Owner, user1);
    });
    it("should trigger an event after successful bid", function(done) {
      const events = auction.AuctionSuccessful();
      auction.bid(tokenId1, { from: user1, value: 200 }).then(() => {
        events.get((err, res) => {
          assert(!err);
          eq(res[0].event, "AuctionSuccessful");
          assert(res[0].args.tokenId.eq(tokenId1));
          eq(res[0].args.winner, user1);
          done();
        });
      });
    });
  });

  describe("Conclude auction", function() {
    beforeEach(async function() {
      await deploy();
      await ownership.approve(auction.address, tokenId1, { from: owner });
      await auction.createAuction(tokenId1, 100, 200, 60, owner, {
        from: owner
      });
    });

    it("should fail to conclude if NFT not on auction", async function() {
      util.expectThrow(auction.cancelAuction(tokenId2, { from: user1 }));
    });
    it("should fail to conclude auction if not seller", async function() {
      util.expectThrow(auction.cancelAuction(tokenId1, { from: user1 }));
    });
    it("should be able to conclude auction", async function() {
      await util.forwardEVMTime(120);
      await auction.cancelAuction(tokenId1, { from: owner });
      // Seller should regain ownership of NFT
      const token1Owner = await ownership.ownerOf(tokenId1);
      eq(token1Owner, owner);
    });
    it("should be able to conclude ongoing auction", async function() {
      await auction.cancelAuction(tokenId1, { from: owner });
      const token1Owner = await ownership.ownerOf(tokenId1);
      eq(token1Owner, owner);
    });
    it("should trigger event after concluding auction", function(done) {
      const events = auction.AuctionCancelled();
      util.forwardEVMTime(120).then(() => {
        auction.cancelAuction(tokenId1, { from: owner }).then(() => {
          events.get((err, res) => {
            assert(!err);
            eq(res[0].event, "AuctionCancelled");
            assert(res[0].args.tokenId.eq(tokenId1));
            done();
          });
        });
      });
    });
  });
  describe("Owner cut", function() {
    // Contract state persists in this describe block
    before(async function() {
      await deploy(500); // 5% cut
    });

    it("should add owner's cut of sale to balance", async function() {
      const contractBal1 = await util.getBalance(auction.address);
      await ownership.approve(auction.address, tokenId2, { from: user1 });
      await auction.createAuction(tokenId2, 100, 200, 60, user1, {
        from: user1
      });
      const user1Bal1 = await util.getBalance(user1);
      // Current price could be either 100/101
      await auction.bid(tokenId2, { from: user2, value: 101 });
      const contractBal2 = await util.getBalance(auction.address);
      const user1Bal2 = await util.getBalance(user1);
      const token2Owner = await ownership.ownerOf(tokenId2);
      const contractDiff = contractBal2.sub(contractBal1);
      assert(contractDiff.eq(5) || contractDiff.eq(6));
      const user1Diff = user1Bal2.sub(user1Bal1);
      assert(user1Diff.eq(95) || user1Diff.eq(96));
      eq(token2Owner, user2);
    });
  });

  describe("Cancel auctions while paused", function() {
    beforeEach(async function() {
      await deploy();
      await ownership.approve(auction.address, tokenId2, { from: user1 });
      await auction.createAuction(tokenId2, 100, 200, 1000, user1, {
        from: user1
      });
    });

    it("should fail to cancel auction when not paused", async function() {
      await util.expectThrow(
        auction.cancelAuctionWhenPaused(tokenId2, { from: owner })
      );
    });
    it("should fail to cancel auction when not owner", async function() {
      await auction.pause({ from: owner });
      await util.expectThrow(
        auction.cancelAuctionWhenPaused(tokenId2, { from: user2 })
      );
    });
    it("should be able to cancel auction as owner when paused", async function() {
      await auction.pause({ from: owner });
      await auction.cancelAuctionWhenPaused(tokenId2, { from: owner });
      const tokenId2Owner = await ownership.ownerOf(tokenId2);
      eq(tokenId2Owner, user1);
    });
    it("should be able to cancel auction as auction owner when paused", async function() {
      await auction.pause({ from: owner });
      await auction.cancelAuction(tokenId2, { from: user1 });
      const tokenId2Owner = await ownership.ownerOf(tokenId2);
      eq(tokenId2Owner, user1);
    });
  });

  // Skipped in general, to test, make `_computeCurrentPrice` public
  describe.skip("Current price computation", function() {
    // Helpers
    let toWei, currentPrice;
    before(async function() {
      await deploy();
      toWei = num => web3._extend.utils.toWei(new BN(num), "ether");
      currentPrice = auction._computeCurrentPrice;
    });

    it("increasing price", async function() {
      const [start, end, dur] = [100, 500, 1000];
      let price = await currentPrice(start, end, dur, 0);
      assert(price.eq(start));
      price = await currentPrice(start, end, dur, 100);
      assert(price.eq(140));
      price = await currentPrice(start, end, dur, 500);
      assert(price.eq(300));
      price = await currentPrice(start, end, dur, 1000);
      assert(price.eq(500));
      price = await currentPrice(start, end, dur, 5000);
      assert(price.eq(500));
    });
    it("decreasing price", async function() {
      const [start, end, dur] = [200, 100, 1000];
      let price = await currentPrice(start, end, dur, 0);
      assert(price.eq(200));
      price = await currentPrice(start, end, dur, 100);
      assert(price.eq(190));
      price = await currentPrice(start, end, dur, 600);
      assert(price.eq(140));
      price = await currentPrice(start, end, dur, 1000);
      assert(price.eq(100));
      price = await currentPrice(start, end, dur, 5000);
      assert(price.eq(100));
    });
    it("fixed price", async function() {
      const [start, end, dur] = [100, 100, 1000];
      let price = await currentPrice(start, end, dur, 0);
      assert(price.eq(100));
      price = await currentPrice(start, end, dur, 100);
      assert(price.eq(100));
      price = await currentPrice(start, end, dur, 5000);
      assert(price.eq(100));
    });
    it("down to zero", async function() {
      const [start, end, dur] = [100, 0, 1000];
      let price = await currentPrice(start, end, dur, 0);
      assert(price.eq(100));
      price = await currentPrice(start, end, dur, 100);
      assert(price.eq(90));
      price = await currentPrice(start, end, dur, 5000);
      assert(price.eq(0));
    });
    it("up from zero", async function() {
      const [start, end, dur] = [0, 100, 1000];
      let price = await currentPrice(start, end, dur, 0);
      assert(price.eq(0));
      price = await currentPrice(start, end, dur, 100);
      assert(price.eq(10));
      price = await currentPrice(start, end, dur, 5000);
      assert(price.eq(100));
    });
    it("always zero", async function() {
      const [start, end, dur] = [0, 0, 1000];
      let price = await currentPrice(start, end, dur, 0);
      assert(price.eq(0));
      price = await currentPrice(start, end, dur, 100);
      assert(price.eq(0));
      price = await currentPrice(start, end, dur, 5000);
      assert(price.eq(0));
    });
    it("Big numbers", async function() {
      const [start, end, dur] = [toWei(100), toWei(200), 100000];
      let price = await currentPrice(start, end, dur, 0);
      assert(price.eq(start));
      price = await currentPrice(start, end, dur, 10000);
      assert(price.eq(toWei(110)));
      price = await currentPrice(start, end, dur, 60000);
      assert(price.eq(toWei(160)));
      price = await currentPrice(start, end, dur, 100000);
      assert(price.eq(end));
      price = await currentPrice(start, end, dur, 500000);
      assert(price.eq(end));
    });
  });
});
