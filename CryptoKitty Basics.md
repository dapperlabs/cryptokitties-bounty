# Basics of CryptoKitties:

CryptoKitties is composed of 4 public facing contracts. Below we'll provide an overview on these contracts:

##### KittyCore.sol - `0x16baf0de678e52367adc69fd067e5edd1d33e3bf`

Also referred as the main contract, is where Kitties and their ownership are stored.
This also mediates all the main operations, such as breeding, exchange, and part of auctions.
For this release the actual bytecode released for the contract is `KittyCoreRinkeby.sol`, explained below.

##### SaleClockAuction.sol - `0x8a316edee51b65e1627c801dbc09aa413c8f97c2`

Where users are expected to acquire their gen0 kitten. It is also a market place where anyone can post their kitten for auction.
[See Dutch/Clock auction](https://en.wikipedia.org/wiki/Dutch_auction) - note we also accept an increasing price.

##### SiringClockAuction.sol - `0x07ca8a3a1446109468c3cf249abb53578a2bbe40`

A market place where any user can set their Kitty as a potential sire for any takers.

##### GeneScience.sol

It's a mystery! Not public for this release.

## Basic Breeding Rules

- 2 Kitties can breed, except when: they are siblings (share one of the parents), or with their parents.
- They must also be either owned by the same user, or one user offers a Kitty siring to another user.
- If you have 2 Kitties that fits this condition, you can use one as sire (father) and the other as matron (mother). 
- Kitties do not have genders.
- After breeding, the assigned matron will be pregnant and under cooldown, the father will also be under cooldown.
- Cooldown stands for the period of time the kitty cannot perform any breeding actions, it increases per Kitten.
- After the matron cooldown is complete, it can give birth, and engage in breeding again right away.
- As kitties breed their cooldowns increase. For the bounty program, the table can be found in `KittyCoreRinkeby.sol`. Production values will be in `KittyBase.sol`.


The cooldown time table that will be used for CryptoKitties in production can be found under `KittyBase.sol`.
**For the Rinkeby release we made cooldowns much shorter**, consult current values in `KittyCoreRinkeby.sol`.

## Breeding With Kittens You Don't Own

In this case you provide the matron, and have a permissioned sire. There are 2 practical cases this can happen:

1. The owner of a Kitten can allow siring to another ethereum address. 
2. The owner of another Kitten can submit their Kitten into a clock siring auction, and the bidder must supply their matron.


## Trading

There are 2 main ways to trade: direct transfer, or auctions:

1. A owner of a kitten can put their kitty to a clock sales auction.
2. Either transfer to another Ethereum address, or approve to another address.
