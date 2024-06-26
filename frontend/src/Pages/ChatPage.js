import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import SideDrawer from '../components/Miscellaneous/SideDrawer' 
import { Box } from '@chakra-ui/react'
import MyChats from '../components/MyChats'
import ChatBox from '../components/ChatBox'

const ChatPage = () => {
    const [fetchAgain, setFetchAgain] = useState(false);
    const {user} = ChatState();
    
    return (
        <div style={{width: "100%"}}>
            {user && <SideDrawer/>}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user && <MyChats fetchAgain={fetchAgain}/>}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}

export default ChatPage
