import React from 'react';
import { HStack, Box, Text } from "@chakra-ui/react"

import ElectionUpload from "./ElectionUpload.js"

import { DECLARE_INTEREST } from '../utils/constants';
import Contestants from './Contestants.js';

 
export default function Polls({electionId, polls, showDeclareInterest, showVote, showResut}) {
  return (
    <Box> 
        {
            polls.map(poll => {
                return <Box> 
                    <HStack spacing='24px'>
                        <Text d="flex" flexWrap="wrap" px={{base:5 , md:10, lg:12 }} mt={5} mx="auto" justifyContent="space-around">       
                        {
                            `${poll.position}`
                        }
                        </Text>
                        <Text d="flex" flexWrap="wrap" px={{base:5 , md:10, lg:12 }} mt={5} mx="auto" justifyContent="space-around">       
                            {
                                `${poll.description}`
                            }
                        </Text>
                        {
                            showDeclareInterest ? 
                            <ElectionUpload text="Declare Interest" action={DECLARE_INTEREST} election={{
                                id: electionId,
                                pollId: poll.id,
                            }}/> : true
                        }
                        {
                            showResut ?
                            <Text d="flex" flexWrap="wrap" px={{base:5 , md:10, lg:12 }} mt={5} mx="auto" justifyContent="space-around">       
                                {
                                    `Total votes is ${poll.totalVotes}`
                                    
                                }
                            </Text>
                            : null
                        }
                        {
                            showResut ?
                            <Text d="flex" flexWrap="wrap" px={{base:5 , md:10, lg:12 }} mt={5} mx="auto" justifyContent="space-around">       
                                {
                                    `Winner is ${poll.winner}`
                                    
                                }
                            </Text>
                            : null
                        }
                    </HStack>
                    <Contestants electionId={electionId} pollId={poll.id} contestants={poll.contestants} showVote={showVote} />
                </Box>
            })
        }
    </Box>
  )
}
