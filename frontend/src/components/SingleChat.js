import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ViewProfile from './Miscellaneous/ViewProfile';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    const { user, selectedChat, setSelectedChat } = ChatState();
    const toast = useToast();


    const fetchMessages = async() =>{
        if(!selectedChat) return;
        
        try {
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);

            const {data} = await axios.get(`/api/message/${selectedChat._id}`, config);
             
            setMessages(data);
            setLoading(false);

        } 
        catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to load the messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        }
    };

    useEffect(() =>{
        fetchMessages();
    }, [selectedChat]);


    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post("/api/message",{
                    content: newMessage,
                    chatId: selectedChat,
                },config);
                setMessages([...messages, data]);
            } 
            catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
  };

    const typingHandler = (e) =>{
        setNewMessage(e.target.value); 
    }
    

    return ( 
        <>
            {selectedChat ? (
                <>
                    <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w="100%" fontFamily="Work sans"
                        display="flex" justifyContent={{ base: "space-between" }} alignItems="center">
                        <IconButton display={{base: "flex", md:"none"}} icon={<ArrowBackIcon/>} onClick={()=>setSelectedChat("")}/>

                        { messages && (!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ViewProfile user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal  fetchAgain={fetchAgain} fetchMessages={fetchMessages}
                                    setFetchAgain={setFetchAgain} />
                            </>
                        ))}
                    </Text>

                    <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8"
                        w="100%" h="100%" borderRadius="lg" overflowY="hidden" >
                        {loading ? (
                            <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
                        ) : (
                            <div className="messages" style={{display: "flex", flexDirection: "column", overflowY: "scroll", scrollbarWidth: "none"}}>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
                            {/* {istyping ? (
                                <div>
                                <Lottie
                                    options={defaultOptions}
                                    // height={50}
                                    width={70}
                                    style={{ marginBottom: 15, marginLeft: 0 }}
                                />
                                </div>
                            ) : (
                                <></>
                            )} */}
                            <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message.."
                                value={newMessage} onChange={typingHandler}/>
                        </FormControl>
                    </Box>  
                </>
            ) :(
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Start Chatting
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;