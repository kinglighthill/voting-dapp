import React from 'react';
import { Box, Text } from "@chakra-ui/react"

import { sortElections } from '../utils';
import Polls from '../components/Polls.js';

 
export default function Elections({elections, showDeclareInterest}) {
  return (
    elections !== null && elections.length !== 0 ? <Box>
        {
            sortElections(elections).map((election) => {
                return  <Box>
                    <Text d="flex" flexWrap="wrap" px={{base:5 , md:10, lg:12 }} mt={5} mx="auto" justifyContent="space-around">       
                        {
                            `Created by ${election.creator} on ${election.timeCreated}`
                        }
                    </Text>
                    <Polls electionId={election.id} polls={election.polls} showDeclareInterest={showDeclareInterest} 
                        showVote={election.enabled} showResult={election.show}/>
                </Box>
            })
        }
      </Box>
    : 
    <Text d="flex" flexWrap="wrap" px={{base:5 , md:10, lg:12 }} mt={5} mx="auto" justifyContent="space-around">       
        No Election Available
    </Text>
  )
}
