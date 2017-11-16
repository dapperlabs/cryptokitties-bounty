const Web3 = require("web3");
const net = require("net");

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Set with the address youhave your Rinkeby node running:
const nodeAddress = process.env.FULL_NODE_URL || "http://localhost:8945";

const coreAbi = require("../ABI/KittyCore.json");
const salesAbi = require("../ABI/SaleClockAuction.json");

const coreBountyAddress = "0x16baf0de678e52367adc69fd067e5edd1d33e3bf";
const salesBountyAddress = "0x8a316edee51b65e1627c801dbc09aa413c8f97c2";

const web3 = new Web3();

// require a local full node to be running
web3.setProvider(new web3.providers.HttpProvider(nodeAddress));

const CoreContract = web3.eth.contract(coreAbi);
const instance = CoreContract.at(coreBountyAddress);

const SalesContract = web3.eth.contract(salesAbi);
const salesInstance = SalesContract.at(salesBountyAddress);

async function callAsync(method, ...args) {
  return new Promise(function(resolve, reject) {
    instance[method](...args, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

async function callAsyncSales(method, ...args) {
  return new Promise(function(resolve, reject) {
    salesInstance[method](...args, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

// helper
async function getKitty(id) {
  const attrs = await callAsync("getKitty", id);
  return {
    isGestating: attrs[0],
    isReady: attrs[1],
    cooldownIndex: attrs[2].toNumber(),
    nextActionAt: attrs[3].toNumber(),
    siringWithId: attrs[4].toNumber(),
    birthTime: attrs[5].toNumber(),
    matronId: attrs[6].toNumber(),
    sireId: attrs[7].toNumber(),
    generation: attrs[8].toNumber(),
    genes: attrs[9].toString()
  };
}

async function getAuction(id) {
  const [
    seller,
    startingPrice,
    endingPrice,
    duration,
    startedAt
  ] = await callAsyncSales("getAuction", id);
  return {
    seller,
    startingPrice: startingPrice.toString(),
    endingPrice: endingPrice.toString(),
    duration: duration.toString(),
    startedAt: startedAt.toString()
  };
}

async function run() {
  let n;
  try {
    n = await callAsync("totalSupply");
  } catch (err) {
    console.log(
      "\nMake sure your testrpc is running --rinkeby at",
      nodeAddress,
      "\n"
    );
    console.log(err);
    process.exit(1);
  }
  console.log("kittens:", n.toNumber());

  for (let i = 1; i <= n; i++) {
    const kitty = await getKitty(i);
    const owner = await callAsync("kittyIndexToOwner", i);
    const auction = await getAuction(i);
    console.log("kitty", i, owner, kitty);
    console.log("\n  auction:", auction);
    console.log("----------------------------------------");
  }

  process.exit(0);
}

run().catch(console.error);
