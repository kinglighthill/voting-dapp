/* eslint-disable no-restricted-globals */
import React, { useRef, useState } from 'react';
import {
  useDisclosure,
  Button,
  Modal,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  ModalContent,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  HStack,
  ModalFooter,
  useToast,
  Text,
} from '@chakra-ui/react';
import { Buffer } from 'buffer';
import { setChairman, addStakeholder, transferChairman, removeStakeholder } from '../api';

const Upload = ({text, reload, loading, addChairman, changeChairman, batchAdd, remove}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef();
  const finalRef = useRef();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState(3);
  const [file, setFile] = useState(null);
  // const [fileDetails, setFileDetails] = useState('');
  // const [cid, setCid] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const captureFile = e => {
    const data = e.target.files[0];
    // setFileDetails(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    };
  };
  const toast = useToast();

  // 0xD0aAB48daF5A4851C2c71b05165CeD35CaA9197E

  const onSuccess = (message) => {
    setSubmitted(message)
    setIsSubmitted(false)
    setTimeout(() => {
      setSubmitted('');
      onClose();
      toast({
        title: 'Successfull',
        description: message,
        status: 'success',
        duration: '5000',
        isClosable: true,
      });
      reload(!loading);
    }, 1000);
  }

  const onErrorOccured = () => {
    onClose();
    setIsSubmitted(false);
    setSubmitted('');
    showErrorToast('An unexpected error occured');
  }

  const showErrorToast = message => {
    toast({
      title: 'Unsuccessful',
      description: message,
      status: 'error',
      duration: '5000',
      isClosable: true,
    });
  };
  
  const submitUpload = async e => {
    const res = confirm(`Are you sure you want to continue with action?\nYou won't be able to change this later`)
    if(res){
      e.preventDefault();
      setIsSubmitted(true);

      const { ethereum } = window;

      try {
          if (remove) {
              await removeStakeholder({
                  ethereum: ethereum,
                  address: address,
              }, () => onSuccess("Stakeholder removed successfully"), onErrorOccured)
          } else {
            if (batchAdd) {
              //   
            } else {
                if (!addChairman && !changeChairman) {
                    await addStakeholder({
                        ethereum: ethereum, 
                        address: address, 
                        name: name, 
                        role: role,
                    }, () => onSuccess("Stakeholder added successfully"), onErrorOccured)
                } else {
                    if (!changeChairman) {
                        await setChairman({
                            ethereum: ethereum, 
                            address: address, 
                            name: name, 
                        }, () => onSuccess("Chairman added successfully"), onErrorOccured)
                    } else {
                        console.log("Hello")
                        await transferChairman({
                            ethereum: ethereum, 
                            address: address, 
                        }, () => onSuccess("Chairman changed successfully"), onErrorOccured)
                    }
                }
            }
          }
        // fileUpload(cid);
      } catch (error) {
          onErrorOccured()
          console.log(error);
      }
    } else{
      return
    }
  };

  const title = addChairman ? "Add Chairman" : 
    changeChairman ? "Change Chairman" : 
    batchAdd ? "Add Stakeholders" : !remove ? "Add Stakeholder" : "Remove Stakeholder"

  const nameLabel = addChairman || changeChairman ? "Name of chairman" :
    !batchAdd ? "Name of stakeholder" : ""

  const namePlaceholder = addChairman || changeChairman ? "Enter name of chairman" :
  !batchAdd ? "Enter name of stakeholder" : ""

  const addressPlaceholder = addChairman ? "Address of chairman" : changeChairman ? "Address of new chairman" :
  !batchAdd ? "Address of stakeholder" : ""

  const addressLabel =  addChairman ? "Enter address of chairman" : changeChairman ? "Enter address of new chairman" :
  !batchAdd ? "Enter address of stakeholder" : ""

  const rolePlaceholder = !addChairman ? "Role of chairman" : ""

  const roleLabel = !addChairman ? "Enter role of chairman" : ""

  const inputRole = (e) => {
      let value
      
      if (e.target.value === "Chairman") {
          value = 0
      } else if(e.target.value === "Admin") {
        value = 1
      } else if(e.target.value === "Teacher") {
        value = 2
      } else {
        value = 3
      }
    
      setRole(value)
  }

  return (
    <div>
      <Button onClick={onOpen} bg="purple" color="white" ml={5}>
        { 
            text
        }
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form action="" onSubmit={submitUpload}>
                {
                    remove || changeChairman ? 
                        <>
                            <FormLabel as="view">{addressLabel}</FormLabel>
                            <Input
                                type="text"
                                placeholder={addressPlaceholder}
                                required
                                mb={4}
                                onChange={e => setAddress(e.target.value)}
                            />
                        </>
                    :
                        !batchAdd ? 
                            <>
                                <FormLabel>{nameLabel}</FormLabel>
                                <Input
                                    type="text"
                                    placeholder={namePlaceholder}
                                    required
                                    mb={4}
                                    onChange={e => setName(e.target.value)}
                                />
                                <FormLabel as="view">{addressLabel}</FormLabel>
                                <Input
                                    type="text"
                                    placeholder={addressPlaceholder}
                                    required
                                    mb={4}
                                    onChange={e => setAddress(e.target.value)}
                                />
                                {
                                    !addChairman && !changeChairman?
                                        <>
                                            <FormLabel as="view">{roleLabel}</FormLabel>
                                            <Input
                                                type="text"
                                                placeholder={rolePlaceholder}
                                                required
                                                mb={4}
                                                onChange={e => inputRole(e)}
                                            />
                                        </>
                                    : null
                                }
                            </>
                        : 
                            <>
                                <FormLabel as="view">Select file</FormLabel>
                                <Input type="file" required mb={4} onChange={captureFile} />
                            </>
                }
              <ModalFooter>
                <Text mr={2} color={'green.500'}>
                  {submitted}
                </Text>
                {isSubmitted === false ? (
                  <Button colorScheme="blue" mr={3} type="submit">
                    Submit
                  </Button>
                ) : (
                  <Button
                    colorScheme="blue"
                    mr={3}
                    type="submit"
                    isLoading
                    loadingText="Submitting"
                  >
                    Submit
                  </Button>
                )}

                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Upload;
