import detectEthereumProvider from "@metamask/detect-provider"
import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols"
import { providers,Contract, utils } from "ethers"
import Head from "next/head"
import React from "react"
import { useState, useEffect } from "react"
import styles from "../styles/Home.module.css"
import GreetForm from "./components/GreetingForm";
import Greeter from "artifacts/contracts/Greeters.sol/Greeters.json"

import Button from '@mui/material/Button'



export default function Home() {
  const [message, setMessage] = useState('')
  const [greetings, setGreetings] = useState<string[]>([])

  useEffect(() => {
    const listener = async () => {
      const contract = new Contract(
        '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        Greeter.abi,
      )

      const provider = new providers.JsonRpcProvider('http://localhost:8545')

      const contractOwner = contract.connect(provider.getSigner())

      contractOwner.on('NewGreeting', (greeting) => {
        const message = utils.parseBytes32String(greeting)
        setGreetings((greetings) => [...greetings, message])
      })
    }
    listener()
  }, []);
    const [logs, setLogs] = React.useState("Connect your wallet and greet!")

    async function greet() {
        setLogs("Creating your Semaphore identity...")

        const provider = (await detectEthereumProvider()) as any

        await provider.request({ method: "eth_requestAccounts" })

        const ethersProvider = new providers.Web3Provider(provider)
        const signer = ethersProvider.getSigner()
        const message = await signer.signMessage("Sign this message to create your identity!")

        const identity = new ZkIdentity(Strategy.MESSAGE, message)
        const identityCommitment = identity.genIdentityCommitment()
        const identityCommitments = await (await fetch("./identityCommitments.json")).json()

        const merkleProof = generateMerkleProof(20, BigInt(0), identityCommitments, identityCommitment)

        setLogs("Creating your Semaphore proof...")

        const greeting = "Hello world"

        const witness = Semaphore.genWitness(
            identity.getTrapdoor(),
            identity.getNullifier(),
            merkleProof,
            merkleProof.root,
            greeting
        )

        const { proof, publicSignals } = await Semaphore.genProof(witness, "./semaphore.wasm", "./semaphore_final.zkey")
        const solidityProof = Semaphore.packToSolidityProof(proof)

        const response = await fetch("/api/greet", {
            method: "POST",
            body: JSON.stringify({
                greeting,
                nullifierHash: publicSignals.nullifierHash,
                solidityProof: solidityProof
            })
        })

        if (response.status === 500) {
            const errorMessage = await response.text()

            setLogs(errorMessage)
        } else {
            setLogs("Your anonymous greeting is onchain :)")
        }
    }

    async function register(){
      /*
        * Prompts user to sign a message
        * Creates a semaphore identity with the signed message
        * Use that identity to add into the on-chain group
      */
      const message = "Make me anonymous"
      if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
      }
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const signature = await signer.signMessage(message)
      const address = await signer.getAddress()
      console.log({ signer, signature, address })
      const identity = new ZkIdentity(Strategy.MESSAGE, signature)
      const identityCommitment = identity.genIdentityCommitment()
      console.log(identityCommitment)
    
      /*const identity = new Identity(signature)
      const trapdoor = identity.getTrapdoor()
      const nullifier = identity.getNullifier()
      const commitment = identity.generateCommitment()
      
      console.log(trapdoor, nullifier, commitment)*/
    
  }

    return (
        <div className={styles.container}>
            <Head>
                <title>Greetings</title>
                <meta name="description" content="A simple Next.js/Hardhat privacy application with Semaphore." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div><h1>ZK Oauth</h1></div>
        <div><p> Create your <b>anonymous</b> identity on <b>blockchain</b>. </p></div>
        <div><Button variant="outlined" size="large" className='register' onClick={register}> Register </Button></div>
      </div>
    )
}