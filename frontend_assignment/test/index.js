const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Blog", function () {
  this.timeout(0);

  let NewsFeed;
  let newsFeedContract;

  before(async () => {
    NewsFeed = await ethers.getContractFactory("Blog");
    newsFeedContract = await NewsFeed.deploy();
  });

  it("should deploy", async () => {
    expect(newsFeedContract.address).to.not.be.null;
  });

  it("should have a default value of 0", async () => {
    const value = await newsFeedContract.getTotalFeeds();
    expect(value.toString()).to.equal("0");
  });

  it("should be able to create feed", async () => {
    const tx = await newsFeedContract.createFeed(
      "Hello World",
      "New York world",
      "New York",
      "Sports",
      "0x123",
      "2022-05-05"
    );
    expect(tx.hash).to.not.be.null;
  });

  it("should be able to get feeds", async () => {
    const tx = await newsFeedContract.createFeed(
      "Hello World",
      "New York world",
      "New York",
      "Sports",
      "0x123",
      "2022-05-05"
    );

    // get feeds
    const feeds = await newsFeedContract.getAllFeeds();
    expect(feeds.length).to.equal(2);
  });

  it("should be able to get feed count", async () => {
    const tx = await newsFeedContract.createFeed(
      "Hello World",
      "New York world",
      "New York",
      "Sports",
      "0x123",
      "2022-05-05"
    );
    const newsCount = await newsFeedContract.getTotalFeeds();
    expect(newsCount.toString()).to.equal("3");
  });

  it("should be able to get feed by id", async () => {
    const tx = await newsFeedContract.createFeed(
      "Hello World",
      "New York world",
      "New York",
      "Sports",
      "0x123",
      "2022-05-05"
    );
    const news = await newsFeedContract.getFeed(2);
    expect(news.title).to.equal("Hello World");
  });
});
// import { Strategy, ZkIdentity } from "@zk-kit/identity"
// import { generateMerkleProof, Semaphore } from "@zk-kit/protocols"
// import { expect } from "chai"
// import { Contract, Signer } from "ethers"
// import { ethers, run } from "hardhat"
// import identityCommitments from "../public/identityCommitments.json"

// describe("Greeters", function () {
//     let contract: Contract
//     let contractOwner: Signer

//     before(async () => {
//         contract = await run("deploy", { logs: false })

//         const signers = await ethers.getSigners()
//         contractOwner = signers[0]
//     })

//     describe("# greet", () => {
//         const wasmFilePath = "./public/semaphore.wasm"
//         const finalZkeyPath = "./public/semaphore_final.zkey"

//         it("Should greet", async () => {
//             const message = await contractOwner.signMessage("Sign this message to create your identity!")

//             const identity = new ZkIdentity(Strategy.MESSAGE, message)
//             const identityCommitment = identity.genIdentityCommitment()
//             const greeting = "Hello world"
//             const bytes32Greeting = ethers.utils.formatBytes32String(greeting)

//             const merkleProof = generateMerkleProof(20, BigInt(0), identityCommitments, identityCommitment)
//             const witness = Semaphore.genWitness(
//                 identity.getTrapdoor(),
//                 identity.getNullifier(),
//                 merkleProof,
//                 merkleProof.root,
//                 greeting
//             )

//             const fullProof = await Semaphore.genProof(witness, wasmFilePath, finalZkeyPath)
//             const solidityProof = Semaphore.packToSolidityProof(fullProof.proof)

//             const nullifierHash = Semaphore.genNullifierHash(merkleProof.root, identity.getNullifier())

//             const transaction = contract.greet(bytes32Greeting, nullifierHash, solidityProof)

//             await expect(transaction).to.emit(contract, "NewGreeting").withArgs(bytes32Greeting)
//         })
//     })
// })
