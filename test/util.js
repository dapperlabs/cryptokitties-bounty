require("babel-polyfill");

// this web3 is injected:
web3.BigNumber.config({ EXPONENTIAL_AT: 100 });

const promisify = inner =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    })
  );

// Took this from https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/test/helpers/expectThrow.js
// Doesn't seem to work any more :(
// Changing to use the invalid opcode error instead works
const expectThrow = async promise => {
  try {
    await promise;
  } catch (err) {
    const outOfGas = err.message.includes("out of gas");
    const invalidOpcode = err.message.includes("invalid opcode");
    assert(
      outOfGas || invalidOpcode,
      "Expected throw, got `" + err + "` instead"
    );
    return;
  }
  assert.fail("Expected throw not received");
};

// Works for testrpc v4.1.3
const mineOneBlock = async () => {
  await web3.currentProvider.send({
    jsonrpc: "2.0",
    method: "evm_mine",
    params: [],
    id: 0
  });
};

const mineNBlocks = async n => {
  for (let i = 0; i < n; i++) {
    await mineOneBlock();
  }
};

// modified from: https://ethereum.stackexchange.com/questions/4027/how-do-you-get-the-balance-of-an-account-using-truffle-ether-pudding
const getBalance = async addr => {
  const res = await promisify(cb => web3.eth.getBalance(addr, cb));
  return new web3.BigNumber(res);
};

const getGasPrice = () => {
  return promisify(web3.eth.getGasPrice);
};

const forwardEVMTime = async seconds => {
  await web3.currentProvider.send({
    jsonrpc: "2.0",
    method: "evm_increaseTime",
    params: [seconds],
    id: 0
  });
  await mineOneBlock();
};

// truffle currently have an issue running a single test https://github.com/trufflesuite/truffle/issues/606
const isNotFocusTest = testName => {
  const focus = process.env.FOCUS_TEST;
  if (typeof focus === "string" && focus != testName) {
    console.log("skipping test", testName);
    return true;
  } else {
    return false;
  }
};

// given a number or as string up to 31, returns the 5 bit representation
const b5 = s => {
  if (typeof s === "number") return s.toString(2).padStart(5, "0");
  if (typeof s === "string") return s.padStart(5, "0");
  else throw new Error("invalid input");
};

const fullMatrixOfAllowed = async function() {
  const nKitties = (await coreC.totalSupply()).toNumber();
  console.log("__fullMatrixOfAllowed:", nKitties);
  for (let i = 1; i <= nKitties; i++) {
    for (let j = 1; j <= nKitties; j++) {
      try {
        const res = await coreC.canBreedWith(i, j);
        console.log("  canBreedWith?", i, j, res);
      } catch (e) {
        console.log("  canBreedWith? THREW!", i, j);
      }
    }
  }
};

// keep a snapshot of the evm to always run tests clean (not working as intended)
let snapshot;
const restoreSnapshot = async function() {
  console.log("restoreSnapshot:", snapshot);
  if (snapshot) {
    console.log("..restoring");
    await web3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_revert",
      params: [snapshot],
      id: 0
    });
  } else {
    console.log("..snapshotting");
    const res = await web3.currentProvider.send({
      jsonrpc: "2.0",
      method: "evm_snapshot",
      params: [],
      id: 0
    });
    snapshot = res.result;
  }
};

let lastBalance;
// First call stores the balance sum, second call prints the difference
const measureGas = async accounts => {
  let balanceSum = new web3.BigNumber(0);
  // only checks the first 8 accounts
  for (let i = 0; i <= 7; i++) {
    balanceSum = balanceSum.add(await getBalance(accounts[i]));
  }
  // first run of this function
  if (!lastBalance) {
    lastBalance = balanceSum;
  } else {
    // diff and inform the difference
    console.log(
      "Gas spent on test suite:",
      lastBalance.sub(balanceSum).toString()
    );
    lastBalance = null;
  }
};

module.exports = {
  forwardEVMTime,
  expectThrow,
  mineOneBlock,
  mineNBlocks,
  getBalance,
  getGasPrice,
  b5,
  isNotFocusTest,
  fullMatrixOfAllowed,
  sleep: ms => new Promise(resolve => setTimeout(resolve, ms)),
  restoreSnapshot,
  measureGas
};
