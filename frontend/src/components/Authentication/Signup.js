import { FormControl, FormLabel, VStack, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import React from 'react'
import { useState } from "react";
import { useToast } from "@chakra-ui/toast";
import { useHistory } from "react-router";
import axios from 'axios';

const SignUp = () => {
    const [show, setShow] = useState(false);
    const handleClick = ()=>setShow(!show);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);

    const toast = useToast();
    const history = useHistory();

    const postDetails = (pics)=>{
        setPicLoading(true);
        if (pics === undefined) {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        console.log(pics);
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chatconnect");
            data.append("cloud_name", "dzmhjvt7k");
            axios.post("https://api.cloudinary.com/v1_1/dzmhjvt7k/image/upload",data)
                .then((response) => {
                    console.log("Cloudinary response:", response);
                    setPic(response.data.url.toString());
                    setPicLoading(false);
                    toast({
                        title: "Image uploaded successfully!",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    });
                })
                .catch((err) => {
                    console.log(err);
                    setPicLoading(false);
                });
        } else {
            toast({
                title: "Please Select an Image!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
    }


    const submitHandler = async()=>{
        setPicLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast({
                title: "Please Fill all the Feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
                title: "Passwords Do Not Match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            const config = {
                headers: {
                "Content-type": "application/json",
                },
            };
            const { data } = await axios.post("/api/user", {name, email, password, pic, }, config);
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            history.push("/chats");
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setPicLoading(false);
        }
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