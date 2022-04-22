import React from 'react';
import { HStack, Box, Text } from "@chakra-ui/react"

import ElectionUpload from "./ElectionUpload.js"
import { VOTE } from '../utils/constants';

 
export default function Contestants({electionId, pollId, contestants, showVote}) {
  return (
    <Box> 
        {
        contestants.map(contestant => {
            return <Box> 
                <HStack spacing='24px'>
                    <Text d="flex" flexWrap="wrap" px={{base:5 , md:10, lg:12 }} mt={5} mx="auto" justifyContent="space-around">       
                    {
                        `${contestant.id}`
                    }
                    </Text>
                    <Text d="flex" flexWrap="wrap" px={{base:5 , md:10, lg:12 }} mt={5} mx="auto" justifyContent="space-around">       
                        {
                            `${contestant.manifesto}`
                        }
                    </Text>
                    {
                        showVote ?
                        <ElectionUpload text="Vote" action={VOTE} election={{
                            id: electionId,
                            pollId: pollId,
                            candidate: contestant.id,
                        }}/> : null
                    }
                </HStack>
            </Box>
        })
        }
    </Box>
  )
}
