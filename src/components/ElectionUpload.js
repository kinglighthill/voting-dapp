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
  ModalFooter,
  useToast,
  Text,
} from '@chakra-ui/react';
import { read, utils } from "xlsx";
import { setChairman, addStakeholder, transferChairman, removeStakeholder } from '../api';
import { parseElection } from '../utils';
import { CREATE_ELECTION, ENABLE_VOTING, DISABLE_VOTING, COMPILE_RESULT, SHOW_RESULT } from '../utils/constants';

const Election = ({text, reload, loading, action}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef();
  const finalRef = useRef();
  const [id, setId] = useState(0);
  const [file, setFile] = useState([])
  const [election, setElection] = useState({});
  const [submitted, setSubmitted] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const captureFile = e => {
    const reader = new window.FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onloadend = () => {
        const wb = read(reader.result, { type: rABS ? "binary" : "array" })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = utils.sheet_to_json(ws, {header: 1})
        setFile(data)
    };
  };
  const toast = useToast();

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
        if (action === CREATE_ELECTION) {
          console.log("File: ", file)
          console.log("Election: ", parseElection(file))
        } else if (action === ENABLE_VOTING) {
          console.log(action)
        } else if (action === DISABLE_VOTING) {
          console.log(action)
        } else if (action === COMPILE_RESULT) {
          console.log(action)
        } else if (action === SHOW_RESULT) {
          console.log(action)
        }
      } catch (error) {
          onErrorOccured()
          console.log(error);
      }
    } else{
        return
    }
  };

  let title
  const idLabel = "Election id"
  const idPlaceholder = "Enter election id"

  if (action === CREATE_ELECTION) {
      title = "Create Election"
  } else if (action === ENABLE_VOTING) {
      title = "Enable Voting"
  } else if (action === DISABLE_VOTING) {
    title = "Disable Voting"
  } else if (action === COMPILE_RESULT) {
    title = "Compile Result"
  } else if (action === SHOW_RESULT) {
    title = "Show Result"
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
                    action !== CREATE_ELECTION ? 
                        <>
                            <FormLabel as="view">{idLabel}</FormLabel>
                            <Input
                                type="text"
                                placeholder={idPlaceholder}
                                required
                                mb={4}
                                onChange={e => setId(e.target.value)}
                            />
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

export default Election;
