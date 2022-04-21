import React from 'react';
import { Box, Text, VStack, StackDivider } from "@chakra-ui/react"

import { sortFiles, getRole } from "../utils"
 
export default function Stakeholders({stakeholders}) {
  return (
    <Box>
        {
            sortFiles(stakeholders).map((stakeholder) => {
                return <Box>
                    <Text d="flex" flexWrap="wrap" px={{base:5 , md:10, lg:12 }} mt={5} mx="auto" justifyContent="space-around">       
                        {getRole(stakeholder.role)} 
                    </Text>
                    <Text d="flex" flexWrap="wrap" px={{base:5 , md:10, lg:12 }} mt={5} mx="auto" justifyContent="space-around">       
                        {stakeholder.name} : {stakeholder.id}
                    </Text>
                </Box>
            })
        }
    </Box>
  )
}
