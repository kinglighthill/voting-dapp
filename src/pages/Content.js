import { Box, Button, Grid, HStack, Input, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { buyZPToken, getZPTokenRate, getBalance, getStakeholders, getStakeholdersCount, fetchChairman } from '../api';
import Upload from '../components/Upload';
import Stakeholders from './Stakeholders'
import Elections from './Elections'


export default function Content({
    showStakeholders,
    showElections,
}) {
    const [balance, setBalance] = useState(0)
    const [stakeholdersCount, setStakeholdersCount] = useState(0)
    const [stakeholders, setStakeholders] = useState([])
//   const [publicFiles, setPublicFiles] = useState([]);
//   const [myPublicFiles, setMyPublicFiles] = useState([]);
//   const [privateFiles, setPrivateFiles] = useState([]);
//   const [sharedFiles, setSharedFiles] = useState([]);
//   const [searchedFiles, setSearchedFiles] = useState([]);
//   const [allFiles, setAllFiles] = useState([]);

  const [param, setParam] = useState('');
  const [loading, setLoading] = useState(false)

  const buyToken = async(amount) => {
      if (amount !== null && amount !== "") {
        const { ethereum } = window
        
        const rate = await getZPTokenRate(ethereum) || 1000
        const tokenInEther = parseInt(amount) / rate
        
        alert(`You will be charged ${tokenInEther} ethers plus additional gas fees for this transaction`)

        const bought = await buyZPToken(ethereum, tokenInEther)
        if (bought) {
            const newBalance = await getBalance(ethereum)
            setBalance(newBalance)
        } 

        return
      } 
      
      alert(`Input a value`)
  };

  const handleBuyToken = (e) => {
    setParam(e.target.value)
  }

  useEffect(() => {
      async function fetchStakeholders() {
          const stakeholders = await getStakeholders(window.ethereum)
          const stakeholdersCount = await getStakeholdersCount(window.ethereum)

          setStakeholdersCount(stakeholdersCount)
          setStakeholders(stakeholders)
      }
      fetchStakeholders()
  }, [stakeholdersCount, stakeholders])

  useEffect(() => {
      async function getUserBalance() {
          const userBalance = await getBalance(window.ethereum)
          setBalance(userBalance)
      }
      getUserBalance()
  }, [balance])

  //function to get all public files
//   const getPublicFiles = async () => {
//     const files = await fetchPublicFiles(window.ethereum);
//     setPublicFiles(files);
//   };

//   useEffect(() => {
//     async function fetchFiles() {
//       await getPublicFiles();
//       await getMyPublicFiles();
//       await getPrivateFiles();
//       await getSharedFiles();
//     }
//     fetchFiles();
//   }, [loading]);

//function to trigger change in loading state causing the page to remount
  const refresh = (x) => {
      setLoading(x)
  }

//   useEffect(() => {
//     var newArr = publicFiles.concat(privateFiles, sharedFiles);
//     setAllFiles(newArr);
//   }, [publicFiles, privateFiles, sharedFiles]);

  return (
    <VStack minH="100vh" align='stretch' spacing={10} p={3}>
      <Box
        d="flex"
        w={{ base: '100%', md: '80%', lg: '70%' }}
        h={{base: '5'}}
        mt="80px"
        justifyContent="space-between"
      >
        <Box
            d="flex"
            w={{ base: '60%'}}
            mt="30px" 
        >
            <Text fontSize={{ base: 'xl', md: 'xl', lg: '1.5xl' }} fontWeight="400" m={1} mr={4}>
                    {
                        `Balance: ${balance} ZPT`
                    }
            </Text>
            <Input
                type="text"
                placeholder="Enter amount"
                required
                mb={4}
                value={param}
                onChange={handleBuyToken}
                w="20%"
                mr={2}
            />
            <Text fontSize={{ base: 'xl', md: 'xl', lg: '1.5xl' }} fontWeight="200" m={1} mr={4} ml={2}>
                {
                    `Rate: ${1000} ZPT per Ether`
                }
            </Text>
            <Button bg="purple" onClick={() => buyToken(param)} color="white">
                Buy Tokens
            </Button>
        </Box>
        <Box
            d="flex"
            w={{ base: '45%'}}
        >
            <Box mt="30px"  d="flex" px={10} >
                <Upload  text="Add Stakeholder" reload={refresh} loading={loading} addChairman={false} changeChairman={false} batchAdd={false} remove={false}/>
                {/* <Upload  text="Batch Add Stakeholders" reload={refresh} loading={loading} addChairman={false} changeChairman={false} batchAdd={true} remove={false}/> */}
                <Upload  text="Add Chairman" reload={refresh} loading={loading} addChairman={true} changeChairman={false} batchAdd={false} remove={false}/>
                <Upload  text="Change Chairman" reload={refresh} loading={loading} addChairman={false} changeChairman={true} batchAdd={false} remove={false}/>
                <Upload  text="Remove Stakeholder" reload={refresh} loading={loading} addChairman={false} changeChairman={false} batchAdd={false} remove={true}/>
            </Box>
        </Box>
      </Box>

      <Box
        d="flex"
        w={{ base: '100%', md: '80%', lg: '70%' }}
        h={{base: '5'}}
      >
        <Text mt="50px" fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }} fontWeight="700">
          {showStakeholders ? `Stakeholders - ${stakeholdersCount}` : null}
          {showElections ? "Elections" : null}
        </Text>
      </Box>
      {showStakeholders ? <Stakeholders stakeholders={stakeholders} /> : null}
      {showElections ? <Elections /> : null}
    </VStack>
  );
}
