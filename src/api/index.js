import { ethers } from "ethers"

import contractAbi from "../contracts/abi.json"
import contractAddress from "../contracts/contract_address.json"

// import { timeConv } from "../utils"

const getProvider = async (ethereum) => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    await provider.send("eth_requestAccounts", []);
    return provider
}

const getSigner = async (ethereum) => {
    const provider = await getProvider(ethereum)
    return provider.getSigner()
}

const getContract = async (ethereum) => {
    const signer = await getSigner(ethereum)

    const contract = new ethers.Contract(contractAddress.contractAddress, contractAbi.abi, signer)

    return contract
}


// export const fetchPublicFiles = async (ethereum) => {
//     try {
//         const contract = await getContract(ethereum)
//         const txnResult = await contract.getAllPublicUploads()
    
//         const publicFiles = parseResult(txnResult, "Public")
    
//         return publicFiles
//     } catch(error) {
//         console.log("Error: ", error)
//         return []
//     }
// }