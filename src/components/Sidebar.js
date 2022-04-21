import { Avatar, Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Text, useColorModeValue} from '@chakra-ui/react'
import React from 'react'

export default function Sidebar(
    {
        isOpen, onClose, btnRef, setStakeholders, setElections
    }) {
    const bg = useColorModeValue("blackAlpha.100", "primaryLight");

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay/>
        <DrawerContent>
            <DrawerCloseButton/>
            <DrawerHeader>
                Zuri Polls
            </DrawerHeader>
            <DrawerBody px="0">
                <Avatar name="Anonymous" src="dp.png" d="block" mx="auto" mb={5} boxSize="100px"/>
                <hr/>
                <Box textAlign="left" cursor="pointer" fontWeight="600" fontSize="md">
                    <Text py={3} pl={2} _hover={{bg:bg}} onClick={setStakeholders}>Stakeholders</Text>
                    <Text py={3} pl={2} _hover={{bg:bg}} onClick={setElections}>Elections</Text>
                </Box>
            </DrawerBody>
            <DrawerFooter>
                <Text fontSize="12px">&copy;Team N 2022</Text>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}
