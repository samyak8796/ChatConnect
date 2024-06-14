import React from 'react'
import { ChatState } from '../context/chatProvider';
import { Box, IconButton, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ViewProfile from './Miscellaneous/ViewProfile';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const { user, selectedChat, setSelectedChat } = ChatState();
  return ( 
    <>
        {selectedChat ? (
            <>
                <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w="100%" fontFamily="Work sans"
                    display="flex" justifyContent={{ base: "space-between" }} alignItems="center">
                    <IconButton display={{base: "flex", md:"none"}} icon={<ArrowBackIcon/>} onClick={()=>selectedChat("")}/>

                    { (!selectedChat.isGroupChat ? (
                        <>
                            {getSender(user, selectedChat.users)}
                            <ViewProfile user={getSenderFull(user, selectedChat.users)} />
                        </>
                    ) : (
                        <>
                            {selectedChat.chatName.toUpperCase()}
                            <UpdateGroupChatModal  fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain} />
                        </>
                    ))}
                </Text>

                <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8"
                    w="100%" h="100%" borderRadius="lg" overflowY="hidden" >
                    {/* {loading ? (
                        <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
                    ) : (
                        <div className="messages">
                            <ScrollableChat messages={messages} />
                        </div>
                    )}

                    <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
                        {istyping ? (
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
                        )}
                        <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message.."
                            value={newMessage} onChange={typingHandler}/>
                    </FormControl> */}
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