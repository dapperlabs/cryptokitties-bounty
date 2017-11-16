# Basics of CryptoKitties:

CryptoKitties is composed of 4 public facing contracts. Below we'll provide an overview on these contracts:

##### KittyCore.sol - `0x16baf0de678e52367adc69fd067e5edd1d33e3bf`

Also referred as the main contract, is where Kitties and their ownership are stored.
This also mediates all the main operations, such as breeding, exchange, and part of auctions.

For this release, the actual bytecode released for the contract is `KittyCoreRinkeby.sol`, explained below.

##### SaleClockAuction.sol - `0x8a316edee51b65e1627c801dbc09aa413c8f97c2`

Where users are expected to acquire their gen0 kitten. It is also a marketplace where anyone can post their kitten for auction.
[See Dutch/Clock auction](https://en.wikipedia.org/wiki/Dutch_auction) - note we also accept an increasing price.
ps: CK auctions take an initial time and duration, and after duration is over they are not closed. Instead they hold the final price indefinitely


##### SiringClockAuction.sol - `0x07ca8a3a1446109468c3cf249abb53578a2bbe40`

A marketplace where any user can offer their Kitty as a potential sire for any takers.

##### GeneScience.sol

It's a mystery! Not public for this release.

## Basic Breeding Rules

- 2 Kitties can breed, except with their siblings or parents.
- They must also be either owned by the same user, or one user offers a Kitty siring to another user.
- If you have 2 Kitties that fits this condition, you can use one as sire (father) and the other as matron (mother).
- Kitties do not have fixed genders.
- After breeding, the assigned matron will be pregnant and under cooldown, the father will also be under cooldown.
- Cooldown stands for the period of time the kitty cannot perform any breeding actions, a Kitty's cooldown increases each time it breeds.
- After the matron cooldown is complete, it can give birth, and engage in breeding again right away.
- As kitties breed their cooldowns increase. For the bounty program, the table can be found in `KittyCoreRinkeby.sol`. Production values will be in `KittyBase.sol`.


The cooldown time table that will be used for CryptoKitties in production can be found under `KittyBase.sol`.
**For the Rinkeby release we made cooldowns much shorter**, consult current values in `KittyCoreRinkeby.sol`.

## Breeding With Kittens You Don't Own

In this case you provide the matron, and have a permissioned sire. There are 2 practical cases this can happen:

1. The owner of a Kitten can allow siring to another ethereum address.
2. The owner of another Kitten can submit their Kitten into a siring clock auction, and the bidder must supply their matron.

## Trading

There are 2 main ways to trade: direct transfer, or auctions:

1. A owner of a kitten can put their kitty to a clock sales auction.
2. Either transfer to another Ethereum address, or approve to another address.

# Common functions

Here's what we expect to be the most usual flow, and what function are to be called.

1. COO will periodically put a kitten to gen0 auction (Main `createGen0Auction()`)
1. user go an buy gen0 kittens (Sale Auction `bid()`)
1. user can get kitty data (Main `getKitty()`)
1. user can breed their own kittens (Main `breedWith()` or `breedWithAuto()`)
1. after cooldown is passed, any user can have a pregnant kitty giving birth (Main `giveBirth()`)
1. user can offer one of their kitties as sire via auction (Main `createSiringAuction()`)
1. user can offer their kitty as sire to another user (Main `approveSiring()`)
1. user can bid on an active siring auction (Main `createSiringAuction()`)
1. user can put their kitty for sale on auction (Main `createSaleAuction()`)
1. user can buy a kitty that is on auction from another user (Sale Auction `bid()`)
1. user can check info of a kitty that is to auction (Sale/Siring Auction `getAuction()`)
1. user can cancel an auction they started (Sale/Siring Auction `cancelAuction()`)
1. user can transfer a kitty they own to another user (Main `transfer()`)
1. user can allow another user to take ownership of a kitty they own (Main `approve()`)
1. once an user has a kitty ownership approved, they can claim a kitty (Main `transferFrom()`)
1. CEO is the only one that may replace COO or CTO (Main `setCEO()` `setCFO()` `setCOO()`)
1. COO can mint and distribute promotional kittens (Main `createPromoKitty()`)
1. COO can transfer the balance from auctions (Main `withdrawAuctionBalances()`)
1. CFO can drain funds from main contract (Main `withdrawBalance()`)

Please see complete the explanation of roles in `KittyAccessControl.sol`
There are more rules and comments on the source code, please refer to the code and tests in case things don't work as first expected.

## Running Tests

The only pre-dependency is **Node 8.9.0** - the best way to install node is via [nvm](https://github.com/creationix/nvm)

We are using [Truffle 4 framework to develop](http://truffleframework.com/docs/), all dependencies are installed via `npm install`

Run the the test suite: `npm test`

You can make tests more verbose by setting `export DEBUG=ck`

## Listing all kittens and auctions in Rinkeby

We added a convenience script to make it easier to see the state of some of the most important stats

- Make sure your geth is running [in sync with rinkeby](https://gist.github.com/cryptogoth/10a98e8078cfd69f7ca892ddbdcf26bc). (alternatively you may wanna try a public web3 compatible API, like Infura).
- `node scripts/list-kitties-auctions.js` - configure geth rpc port here.
