import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import React from 'react'
import { useState } from "react";


const SignUp = () => {
    const [show, setShow] = useState(false);
    const handleClick = ()=>setShow(!show);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);

    const postDetails = (pics)=>{

    }


    const submitHandler = ()=>{

    }


  return (
    <VStack spacing='5px'>
        <FormControl id='first-name' isRequired>
            <FormLabel>
                Name
            </FormLabel>
            <Input placeholder="Enter Your Name" onChange={(e)=>setName(e.target.value)}></Input>
        </FormControl>

        <FormControl id='email' isRequired>
            <FormLabel>
                Email
            </FormLabel>
            <Input placeholder="Enter Your Email" onChange={(e)=>setEmail(e.target.value)}></Input>
        </FormControl>

        <FormControl id='password' isRequired>
            <FormLabel>
                Password
            </FormLabel>
            <InputGroup>
                <Input type={show ? "text":"password"} placeholder="Enter Password" onChange={(e)=>setPassword(e.target.value)}></Input>
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id='password' isRequired>
            <FormLabel>
                Confirm Password
            </FormLabel>
            <InputGroup>
                <Input type={show ? "text":"password"} placeholder="Confirm Password" onChange={(e)=>setConfirmpassword(e.target.value)}></Input>
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id="pic">
            <FormLabel>Upload your Picture</FormLabel>
            <Input type="file" p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[0])}></Input>
        </FormControl>

        <Button colorScheme="blue" width="100%" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={picLoading}>
            SignUp
        </Button>
    </VStack>
  )
}

export default SignUp