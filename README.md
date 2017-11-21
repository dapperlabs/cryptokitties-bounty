# The CryptoKitty Bounty Program is NOW CLOSED
Thank you everyone for your participation!! Please stay tuned for rewards!

CryptoKitty Bounty Program
CryptoKitties recognizes the importance of security researchers in keeping our community safe and fun. With the launch of CryptoKitties around the corner, we would love the community to help provide disclosure of security vulnerabilities via our bounty program described below.

### What you Should Know About CryptoKitties:

- CryptoKitties is a game centered around breedable, collectible, and oh-so-adorable creatures we call CryptoKitties! Each cat is one-of-a-kind and 100% owned by you; it cannot be replicated, taken away, or destroyed.
- CryptoKitties are non-fungible tokens (see [ERC #721](https://github.com/ethereum/EIPs/issues/721)) that are indivisible and unique.
- The smart contracts have over 4-billion variations of phenotypes (what you see) and genotypes (what you don’t see). Because cats are tokens on a blockchain, they can be bought, sold, or transferred digitally, with strong guarantees of ownership.
- CryptoKitties is built on the Ethereum network; ether will be necessary to fuel transactions, which include purchasing, trading, and breeding CryptoKitties. For the purpose of this bounty program, the program will run within the Rinkeby test network. Also the source code will be available for review.
- Two CryptoKitties can breed a new CryptoKitty. Kitties do not have a permanently assigned gender. While they can only engage in one breeding session at one time, each Kitty is able to act as either matron or sire. The owner chooses per breeding interaction!

**See full basic operations [here](./CryptoKitty%20Basics.md)**  

### The Scope for this Bounty Program:

This bounty program will run within the Rinkeby network from <b>12:01am GMT November 16th - 11:59pm GMT November 20th, 2017</b>. All code important to this bounty program is publicly available within this repo
Help us identify bugs, vulnerabilities, and exploits in the smart contract such as:
- Breaking the game (ex. auctioning doesn’t work, breeding doesn’t work,)
- Incorrect usage of the game
- Steal a cat from someone else
- Act as one of the admin accounts
- Complete something without respecting the cool-down period
- Any sort of malfunction

### Rules & Rewards:

- Issues that have already been submitted by another user or are already known to the CryptoKitty team are not eligible for bounty rewards.
- Bugs and vulnerabilities should only be found using accounts you own and create. Please respect third party applications and understand that an exploit that is not specific to the CryptoKitty smart contract is not part of the bounty program. Attacks on the network that result in bad behaviour are not allowed.
- The CryptoKitty website is not part of the bounty program, only the smart contract code included in this repo.
- The CryptoKitty bounty program considers a number of variables in determining rewards. Determinations of eligibility, score and all terms related to a reward are at the sole and final discretion of CryptoKitty team.
- Reports will only be accepted via GitHub issues submitted to this repo.
- In general, please investigate and report bugs in a way that makes a reasonable, good faith effort not to be disruptive or harmful to us or others.

The value of rewards paid out will vary depending on Severity which is calculated based on Impact and Likelihood as followed by  [OWASP](https://www.owasp.org/index.php/OWASP_Risk_Rating_Methodology):

![Alt text](https://github.com/axiomzen/cryptokitties-bounty/blob/master/owasp_w600.png)

<b>Note: Rewards are at the sole discretion of the CK Team. 1 point currently corresponds to 1 USD (paid in ETH) The top 10 people on our leaderboard of accepted bugs with at least 250 points will receive a limited edition BugCat available only to successful participants in this bounty program.</b>

- Critical: up to 1000 points
- High: up to 500 points
- Medium: up to 250 points
- Low: up to 125 points
- Note: up to 50 points

<b> Examples of Impact: </b>
- High: Steal a kitty from someone, steal/redirect ETH or kitties to another address, set kitty genes to arbitrary value, block actions for all users or some non-trivial fraction of users, create a kitty without breeding.  
- Medium: Break breeding rules (self-breeding, sibling or parent breeding, by-pass cooldowns), lock a single kitty owned by an address you don't control, manipulate the gen0 auction price without buying gen0 kittens.
- Low: Block a user from bidding during an auction, create price or comission errors in auction, cancel or block another user's auction.

<b>Suggestions for Getting the Highest Score:</b>
- Description: Be clear in describing the vulnerability or bug. Ex. share code scripts, screenshots or detailed descriptions.
- Fix it: if you can suggest how we fix this issue in an appropriate manner, higher points will be rewarded.

<b>Cryptokitties appreciates you taking the time to participate in our program, which is why we’ve created rules for us too:</b>  
- We will respond as quickly as we can to your submission (within 3 days).
- Let you know if your submission will qualify for a bounty (or not) within 7 business days.
- We will keep you updated as we work to fix the bug you submitted.
- CryptoKitties' core development team, employees and all other people paid by the CryptoKitties project, are not eligible for rewards.

<b>How to Create a Good Vulnerability Submission:</b>
- <b>Description:</b> A brief description of the vulnerability
- <b>Scenario:</b> A description of the requirements for the vulnerability to happen
- <b>Impact:</b> The result of the vulnerability and what or who can be affected
- <b>Reproduction:</b> Provide the exact steps on how to reproduce this vulnerability on a new contract, and if possible, point to specific tx hashes or accounts used.
- <b>Note:</b> If we can't reproduce with given instructions then a (Truffle) test case will be required.
- <b>Fix:</b> If applies, what would would you do to fix this

<b>FAQ:</b>
- How are the bounties paid out?
  - Rewards are paid out in ETH after the submission has been validated, usually a few days later. Please provide your ETH address.
- I reported an issue but have not received a response!
  - We aim to respond to submissions as fast as possible. Feel free to email us if you have not received a response.
- Can I use this code elsewhere?
  - No. Please do not copy this code for other purposes than reviewing it.  
- I have more questions!
  - Create a new issue with the title starting as “QUESTION”
- Will the code change during the bounty?
  - Yes, as issues are reported we will update the code as soon as possible. Please make sure your bugs are reported against the latest versions of the published code.
- I'm having trouble setting up the contracts? 
  - Join the [CryptoKitties Gitter to get some assistance](https://gitter.im/Crypto_Kitties/Lobby)


<b>Important Legal Information:</b>

The bug bounty program is an experimental rewards program for our community to encourage and reward those who are helping us to improve CryptoKitties. You should know that we can close the program at any time, and rewards are at the sole discretion of the CryptoKitties team. All rewards are subject to applicable law and thus applicable taxes. Don't target our physical security measures, or attempt to use social engineering, spam, distributed denial of service (DDOS) attacks, etc. Lastly, your testing must not violate any law or compromise any data that is not yours.

Copyright (c) 2017 Launch Labs, Inc. (dba Axiom Zen)

All rights reserved. The contents of this repository is provided for review and educational purposes ONLY. You MAY NOT use, copy, distribute, or modify this software without express written permission from Axiom Zen or Launch Labs, Inc.
