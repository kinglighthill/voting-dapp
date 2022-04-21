import { Box, Button, Grid, Input, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { fetchPrivateFiles, fetchPublicFiles, fetchSharedFiles, fetchMyPublicFiles } from '../api';
// import Upload from '../components/Upload';
import Stakeholders from './Stakeholders'
import Elections from './Elections'

export default function Content({
    showStakeholders,
    showElections,
}) {
//   const [publicFiles, setPublicFiles] = useState([]);
//   const [myPublicFiles, setMyPublicFiles] = useState([]);
//   const [privateFiles, setPrivateFiles] = useState([]);
//   const [sharedFiles, setSharedFiles] = useState([]);
//   const [searchedFiles, setSearchedFiles] = useState([]);
//   const [allFiles, setAllFiles] = useState([]);

  const [param, setParam] = useState('');
  const [loading, setLoading] = useState(false)

  const buyToken = y => {
    y = y.toLowerCase();
  };

  const handleBuyToken = (e) => {
    setParam(e.target.value);
    buyToken(e.target.value);
  }

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
//   const refresh = (x) => {
//       setLoading(x)
//   }

//   useEffect(() => {
//     var newArr = publicFiles.concat(privateFiles, sharedFiles);
//     setAllFiles(newArr);
//   }, [publicFiles, privateFiles, sharedFiles]);

  return (
    <Grid minH="100vh" p={3}>
      <Box
        d="flex"
        mx={{base:"0px", md:"auto"}}
        w={{ base: '100%', md: '80%', lg: '70%' }}
        h="auto"
        mt="100px"
        px={{ base: 5, md: 10, lg: 12 }}
      >
        <Text fontSize={{ base: 'xl', md: 'xl', lg: '1.5xl' }} fontWeight="400" m={1} mr={4}>
            {
                `Balance: ${0} ZPT`
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

      <Box mt="30px" d="flex" justifyContent="space-between" px={10}>
        <Text fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }} fontWeight="700">
          {showStakeholders ? "Stakeholders" : null}
          {showElections ? "Elections" : null}
        </Text>
        {/* <Upload  reload={refresh} loading={loading}/> */}
      </Box>
      {showStakeholders ? <Stakeholders /> : null}
      {showElections ? <Elections /> : null}
    </Grid>
  );
}
