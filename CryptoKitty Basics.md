# Basics of CryptoKitties:

CK is composed of 4 public facing contracts, we'll provide an overview on those:

##### KittyCore.sol - `0x16baf0de678e52367adc69fd067e5edd1d33e3bf`

Also referred as the main contract. It's where kitties and ownership are stored.
It also mediates all the main operations, such as breeding, exchange, and part of auctions.
For this release the actual bytecode released for the contract is `KittyCoreRinkeby.sol`, explained below.

##### SaleClockAuction.sol - `0x8a316edee51b65e1627c801dbc09aa413c8f97c2`

Where users are expected to acquire their gen0 kitten.
Also a market place that anyone can post their kitten for auction.
[See Dutch/Clock auction](https://en.wikipedia.org/wiki/Dutch_auction) - note we also accept an increasing price.

##### SiringClockAuction.sol - `0x07ca8a3a1446109468c3cf249abb53578a2bbe40`

A market place where any user can set their kitty as a potential sire for any takers.

##### GeneScience.sol

It's a mystery! Not public for this release.

## Basic breeding rules

- 2 Kitties can breed, except when: they are siblings (share one of the parents), or with their parents.
- Also they must be either owned by the same user, or one user offers a Kitty siring to another user.
- If you have 2 Kitties that fits this condition, you can use one as sire (father) and the other as matron (mother) - Kitties don't have gender.
- After breeding, the assigned matron will be pregnant and under cooldown, father will also be under cooldown.
- Cooldown stands for the period of time the kitty cannot perform any breeding actions, it increases per Kitten.
- After the matron cooldown is complete, it can give birth, and engage in breeding again right away.
- As kitties breed their cooldowns increase. For the bounty program, the table can be found in `KittyCoreRinkeby.sol`. Production values will be in `KittyBase.sol`.


The cooldown time table base that will be used for base CryptoKitties in production can be found under `KittyBase.sol`.

**For the Rinkeby release we made cooldowns much shorter**, consult current values in `KittyCoreRinkeby.sol`.

## Breeding with Kittens you don't own

- In that case you provide the matron, and have the sire allowed to you. And there are 2 practical cases this can happen:
- The owner of a Kitten can allow siring to another ethereum address, that's using the main contract.
- The owner of another Kitten can submit their kitten into a clock siring auction, and the bidder must supply their matron.

## Trading

- There are 2 main ways to trade: direct transfer, or auctions.
- A owner of a kitten can put their kitty to a clock sales auction.
- Or, either transfer to another Ethereum address, or approve to another address.

There are more rules and comments on the source code, please refer to the code and tests in case things don't work as first expected.


# Usual flow:

Here's what we expect to be the common way things go in crypto kitties usage.

Please see a complete explanation of roles in `KittyAccessControl.sol`

1. COO can will periodically, put a kitten to gen0 auction (Main `createGen0Auction()`)
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
1. CEO is the only one that may replace COO or CTO
1. COO eventually mint and distribute promotional kittens (Main `createPromoKitty()`)
1. CTO eventually transfers the balance from auctions (Main `withdrawAuctionBalances()`)
1. CTO eventually drain funds from (Main `withdrawBalance()`)
