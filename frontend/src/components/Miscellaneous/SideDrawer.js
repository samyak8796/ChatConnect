import { Badge, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Icon, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon, WarningIcon } from "@chakra-ui/icons";
import { Avatar } from '@chakra-ui/react'; 
import { ChatState } from '../../context/chatProvider';
import ViewProfile from './ViewProfile';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from "../viewUsers/UserListItem";
import { getSender } from '../../config/ChatLogics';

function SideDrawer() {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const {user, setUser, setSelectedChat, chats, setChats, notification, setNotification} = ChatState();

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();    
    const history = useHistory();

    const logoutHandler = () =>{
        console.log('Logging out...');

        localStorage.removeItem('userInfo');
        setUser(null);
        console.log('User set to null');

        console.log('Redirecting to homepage...');
        history.push('/');
        console.log('Redirection done...');
        toast({
            title: 'Logged out successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleSearch = async() =>{
        if(!search){
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;   
        }

        try{
            setLoading(true);
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }

            const {data} = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        }
        catch(error){
            toast({
                title: "Error Occured!",
                description: "Failed to load the search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });

        }
    };


    const accessChat = async(userId)=>{
        try{
            setLoadingChat(true);

            const config = {
                headers:{
                    "Content-type":"application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };
            
            const {data} = await axios.post('/api/chat', {userId}, config);

            if(!chats.find((c)=>c._id === data._id))
                setChats([data, ...chats]);
            
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        }
        catch(error){
            toast({
                title: "Error fetching the chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    }

  return (
    <>
        <Box display="flex" justifyContent="space-between" alignItems="center" bg="white" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
            <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
                <Button variant="ghost" onClick={onOpen}>
                    <i className="fas fa-search"></i>
                    <Text display={{ base: "none", md: "flex" }} px="4">
                        Search User
                    </Text>
                </Button>
            </Tooltip>

            <Text fontSize="2xl" fontFamily="Work sans">
                ChatConnect
            </Text>

            <div>
                <Menu>
                    <MenuButton position="relative">
                        <Icon as={BellIcon} fontSize="2xl" m={1} />
                            {notification.length > 0 && (
                            <Badge position="absolute" top="2" right="3" transform="translate(50%, -50%)"
                                borderRadius="full" bg="red.500" color="white" px={2} py={1} fontSize="0.5em"
                            >
                                {notification.length}
                            </Badge>
                            )}
                    </MenuButton>
                    <MenuList pl={2}>
                        {!notification.length && "No New Messages"}
                        {notification.map((msg) => (
                            <MenuItem key={msg._id} onClick={() => {
                                setSelectedChat(msg.chat);
                                setNotification(notification.filter((n) => n !== msg));
                            }} >
                            {msg.chat.isGroupChat
                                ? `New Message in ${msg.chat.chatName}`
                                : `New Message from ${getSender(user, msg.chat.users)}`}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
                <Menu>  
                    <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
                    <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
                    </MenuButton>
                    <MenuList>
                        <ViewProfile user={user}>
                            <MenuItem>My Profile</MenuItem>
                        </ViewProfile>
                        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>
            </div>
        </Box>


        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                <DrawerBody>
                    <Box display="flex" pb={2}>
                        <Input placeholder="Search by name or email" mr={2} value={search}
                            onChange={(e) => setSearch(e.target.value)} />
                        <Button onClick={handleSearch}>Go</Button>
                    </Box>
                    {loading ? (<ChatLoading />) : (
                        searchResult?.map((user) => (
                            <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)}/>
                        ))
                    )}
                    {loadingChat && <Spinner ml="auto" d="flex" />}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    </>
  )
} 

export default SideDrawer; 