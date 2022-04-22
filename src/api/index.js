import { ethers } from "ethers"

import pollContractAbi from "../contracts/ZuriPoll_abi.json"
import pollContractAddress from "../contracts/ZuriPoll_contract_address.json"
import tokenContractAbi from "../contracts/ZuriPollToken_abi.json"
import tokenContractAddress from "../contracts/ZuriPollToken_contract_address.json"
import { timeConv } from "../utils"

const getProvider = async (ethereum) => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    await provider.send("eth_requestAccounts", []);
    return provider
}

const getSigner = async (ethereum) => {
    const provider = await getProvider(ethereum)
    return provider.getSigner()
}

const getPollContract = async (ethereum) => {
    const signer = await getSigner(ethereum)

    const contract = new ethers.Contract(pollContractAddress.contractAddress, pollContractAbi.abi, signer)

    return contract
}

const getTokenContract = async (ethereum) => {
    const signer = await getSigner(ethereum)

    const contract = new ethers.Contract(tokenContractAddress.contractAddress, tokenContractAbi.abi, signer)

    return contract
}

export const getAddress = async (ethereum) => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0]
}

const parseStakeholder = (txnResult) => {
    if (txnResult.length > 0) {

        let files = []
      
        for(let i = 0; i < txnResult.length; i++) {
            const file = {
                id: txnResult[i][0],
                name: txnResult[i][2], 
                role: txnResult[i][1]
            }
            files.push(file)
        }
        return files
    }

    return []
}

const parseElections = (txnResult) => {
    if (txnResult.length > 0) {

        let elections = []
      
        for(let i = 0; i < txnResult.length; i++) {
            const election = {
                id: txnResult[i][0].toBigInt(),
                creator: txnResult[i][1],
                enabled: txnResult[i][2],
                show: txnResult[i][3],
                timeCreated: timeConv(txnResult[i][4]._hex),
            }
            elections.push(election)
        }
        return elections
    }

    return []
}

const parsePolls = (txnResult) => {
    if (txnResult.length > 0) {

        let polls = []
      
        for(let i = 0; i < txnResult.length; i++) {
            const poll = {
                id: txnResult[i][0].toBigInt(),
                position: txnResult[i][1],
                description: txnResult[i][2],
                roleLimit: txnResult[i][3],
                totalVotes: txnResult[i][4],
                winner: txnResult[i][5],
            }
            polls.push(poll)
        }
        return polls
    }

    return []
}

const parseContestants = (txnResult) => {
    if (txnResult.length > 0) {

        let contestants = []
      
        for(let i = 0; i < txnResult.length; i++) {
            const contestant = {
                id: txnResult[i][0],
                manifesto: txnResult[i][1],
                disqualified: txnResult[i][2]
            }
            contestants.push(contestant)
        }
        return contestants
    }

    return []
}

const parseVoters = (txnResult) => {
    if (txnResult.length > 0) {
        let voters = []
      
        for(let i = 0; i < txnResult.length; i++) {
            const voter = {
                address: txnResult[i],
            }
            voters.push(voter)
        }
        return voters
    }

    return []
}

export const buyZPToken = async (ethereum, amount) => {
    try {
        const contract = await getTokenContract(ethereum)

        const options = { value: ethers.utils.parseEther(amount.toString()) }
        
        const txn = await contract.buyToken(options)
        await txn.wait()

        return true
    } catch(error) {
        console.log(error)
        return false
    }
}

export const getZPTokenRate = async (ethereum) => {
    try {
        const contract = await getTokenContract(ethereum)
        const txn = await contract.tokensPerEther()

        return txn
    } catch(error) {
        console.log(error)
        return 1000
    }
}

export const getBalance = async (ethereum, ) => {
    try {
        const contract = await getTokenContract(ethereum)
        const address = await getAddress(ethereum)
        
        const balance = await contract.balanceOf(address)
        const decimals = await contract.decimals()
    
        const tokenBal = balance / (10 ** decimals)

        return tokenBal
    } catch(error) {
        console.log(error)
        return 0
    }
}

export const setChairman = async ({ethereum, address, name}, onSuccess, onErrorOccured) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.addChairman(address, name)
        // await txn.wait()

        onSuccess()
        contract.on("StakeHolderAdded", (addedBy, timeAdded, added) => {
            console.log("Added Chairman: ", addedBy, timeAdded, added);
            
        });
    } catch(error) {
        console.log(error)
        onErrorOccured()
    }
}

export const transferChairman = async ({ethereum, address}, onSuccess, onErrorOccured) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.transferChairmanship(address)
        // await txn.wait()
        contract.on("ChairmanChanged", (isStakeholder, chairmanExists, timeChanged) => {
            console.log("Changed Chairman: ", isStakeholder, chairmanExists, timeChanged);
            onSuccess()
        });
    } catch(error) {
        console.log(error)
        onErrorOccured()
    }
}

export const fetchChairman = async (ethereum) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.getChairman()
        // await txn.wait()

        console.log("Chairman: ", txn)
    } catch(error) {
        console.log(error)
        return null
    }
}

export const isUserChairman = async (ethereum) => {
    try {
        const address = await getAddress(ethereum)
        const contract =  await getPollContract(ethereum)

        const txn = await contract.isChairman(address)
        // await txn.wait()

        console.log("Is chairman: ", txn)
        return txn
    } catch(error) {
        console.log(error)
        return null
    }
}

export const isUserAdmin = async (ethereum) => {
    try {
        const address = await getAddress(ethereum)
        const contract =  await getPollContract(ethereum)

        const txn = await contract.isAdmin(address)
        // await txn.wait()

        console.log("Is chairman: ", txn)
        return txn
    } catch(error) {
        console.log(error)
        return null
    }
}

export const isUserTeacher = async (ethereum) => {
    try {
        const address = await getAddress(ethereum)
        const contract =  await getPollContract(ethereum)

        const txn = await contract.isTeacher(address)
        // await txn.wait()

        console.log("Is chairman: ", txn)
        return txn
    } catch(error) {
        console.log(error)
        return null
    }
}

export const isUserStudent = async (ethereum) => {
    try {
        const address = await getAddress(ethereum)
        const contract =  await getPollContract(ethereum)

        const txnChairman = await contract.isChairman(address)
        // await txnChairman.wait()
        
        const txnAdmin = await contract.isAdmin(address)
        // await txnAdmin.wait()
        
        const txnTeacher = await contract.isTeacher(address)
        // await txnTeacher.wait()

        const txn = await contract.isStakeHolder(address)
        // await txn.wait()

        const isStudent = txn && !txnChairman && !txnAdmin && !txnTeacher
        console.log("Is chairman: ", isStudent)
        return isStudent
    } catch(error) {
        console.log(error)
        return null
    }
}

export const getStakeholdersCount = async (ethereum) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.totalStakeHolders()
        // await txn.wait()

        return txn.toBigInt()

        // console.log("Stakeholders count: ", )
    } catch(error) {
        console.log(error)
        return 0
    }
}

export const addStakeholder = async ({ethereum, address, name, role}, onSuccess, onErrorOccured) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.addStakeholder(address, role, name)
        // await txn.wait()

        contract.on("StakeHolderAdded", (addedBy, timeAdded, added) => {
            console.log("Added Stakeholder: ", addedBy, timeAdded, added);
            onSuccess()
        });
    } catch(error) {
        console.log(error)
        onErrorOccured()
    }
}

export const removeStakeholder = async ({ethereum, address}, onSuccess, onErrorOccured) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.removeStakeholder(address)
        // await txn.wait()

        contract.on("StakeHolderRemoved", (removedBy, timeRemoved, removed) => {
            console.log("Removed Stakeholder: ", removedBy, timeRemoved, removed);
            onSuccess()
        });
    } catch(error) {
        console.log(error)
        onErrorOccured()
    }
}

export const getStakeholders = async (ethereum) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.getStakeholders()
        // await txn.wait()
        return parseStakeholder(txn)
    } catch(error) {
        console.log(error)
        return []
    }
}

export const createsElection = async ({ethereum, positions, descriptions, roleLimits}, onSuccess, onErrorOccured) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.createsElection(positions, descriptions, roleLimits)
        await txn.wait()
        onSuccess()
        
    } catch(error) {
        console.log(error)
        onErrorOccured()
    }
}

export const declareInterest = async ({ethereum, electionId, pollId, manifesto}, onSuccess, onErrorOccured) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.declareInterest(electionId, pollId, manifesto)
        await txn.wait()
        onSuccess()
    } catch(error) {
        console.log(error)
        onErrorOccured()
    }
}

export const vote = async ({ethereum, electionId, pollId, candidate}, onComplete, onErrorOccured) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.vote(electionId, pollId, candidate)
        await txn.wait()
        onComplete()
    } catch(error) {
        console.log(error)
        onErrorOccured()
    }
}

export const enableVoting = async ({ethereum, id}, onSuccess, onErrorOccured) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.enableVoting(id)
        await txn.wait()
        onSuccess()
    } catch(error) {
        onErrorOccured()
        console.log(error)
    }
}

export const disableVoting = async ({ethereum, id}, onSuccess, onErrorOccured) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.disableVoting(id)
        await txn.wait()
        onSuccess()
    } catch(error) {
        onErrorOccured()
        console.log(error)
    }
}

export const compileResult = async ({ethereum, id}, onSuccess, onErrorOccured) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.compileResult(id)
        await txn.wait()
        onSuccess()
    } catch(error) {
        onErrorOccured()
        console.log(error)
    }
}

export const showResult = async ({ethereum, id}, onSuccess, onErrorOccured) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.showResult(id)
        await txn.wait()
        onSuccess()
    } catch(error) {
        console.log(error)
        onErrorOccured()
    }
}

export const fetchElections = async (ethereum) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.getElections()
        // await txn.wait()
        return parseElections(txn)
    } catch(error) {
        console.log(error)
        return []
    }
}

export const fetchPolls = async (ethereum, id) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.getPolls(id)
        // await txn.wait()

        return parsePolls(txn)
    } catch(error) {
        console.log(error)
        return []
    }
}

export const fetchCandidates = async (ethereum, id) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.getCandidates(id)
        // await txn.wait()

        return parseContestants(txn)
    } catch(error) {
        console.log(error)
        return []
    }
}

export const fetchVoters = async (ethereum, id) => {
    try {
        const contract =  await getPollContract(ethereum)

        const txn = await contract.getVoters(id)
        // await txn.wait()

        return parseVoters(txn)
    } catch(error) {
        console.log(error)
        return []
    }
}
