import { useContext, useEffect, useRef, useState } from "react"
import { ChatOnline } from "../../components/chatOnline/ChatOnline"
import { Conversations } from "../../components/conversations/Conversation"
import { Message } from "../../components/message/Message"
import Topbar from "../../components/topbar/Topbar"
import { AuthContext } from "../../context/AuthContext"
import "./messenger.css"
import axios from "axios"
import {io} from "socket.io-client"
export const Messenger = () => {
    const [conversations,SetConversations] =useState([])
    const [currentChat,setCurrentChat] =useState(null)
    const [messages,setMessages] =useState([])
    const [arrivalMessage,setArrivalMessage] =useState(null)
    const [onlineUsers,setOnlineUsers]=useState([])
    const [newMessage,setNewMessage]=useState("")
    const {user} = useContext(AuthContext)
    const socket = useRef()
    const scrollRef = useRef()


    useEffect(()=>{
        socket.current = io("ws://localhost:8900");
        socket.current.on('getMessage',(data)=>{
            setArrivalMessage({
                sender : data.senderId,
                text : data.text,
                createdAt: Date.now()
            })


        })
    },[])

    useEffect(()=>{
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev)=>[...prev,arrivalMessage  ])
    },[arrivalMessage,currentChat])

   useEffect(()=>{
    socket.current.emit("addUser",user._id)
    socket.current.on('getUsers',(users)=>{
        console.log(users);
        setOnlineUsers(
            user.followings.filter((f) => users.some((u) => u.userId === f))
        )
    })
   },[user])
   


    useEffect(()=>{
        const getConversations =  async()=>{
           try{
             const res = await axios.get("/conversations/"+user._id)
             SetConversations(res.data)
            }catch(error){
                console.log(error);
            }
        }
        getConversations();
    },[user._id])

    useEffect(()=>{
        const getMessages = async()=>{
            try {
                const res = await axios.get("/message/"+currentChat?._id)
                setMessages(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getMessages()
    },[currentChat])
    //console.log(messages)

    const handleSubmit = async (e)=>{
        e.preventDefault()
        const message ={
            conversationId:currentChat._id,
            sender:user._id,
            text:newMessage
        }
        const receiverId = currentChat.members.find(member => member !== user._id)

        socket.current.emit('sendMessage',{
            senderId:   user._id ,
            receiverId:receiverId ,
            text: newMessage
        })

        try{
            const res = await axios.post("/message",message)
            setMessages([...messages,res.data])
            setNewMessage("")
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({behavior:"smooth"})
    },[messages])
    

    // console.log(user)
    // console.log(onlineUsers)
    
    // console.log(setCurrentChat)

  return (
    <>
    <Topbar  />
    <div className="messenger">

    <div className="chatMenu">
        <div className="chatMenuWrapper">
        <input className="chatMenuInput" placeholder="Search for friends"  />

        { conversations && conversations.map((c)=>(
            <div onClick={()=>setCurrentChat(c)} key={c._id}>
            <Conversations conversation={c} currentUser={user} />
            </div>
        ))}
        
        </div>
    </div>

    <div className="chatBox">
        <div className="chatBoxWrapper">
            { currentChat ? 
            (<>
            
         <div className="chatBoxTop">

            {messages && messages.map((m)=>(
                <div ref={scrollRef} key={m._id}>
                 <Message  message ={m}  own={!(m.sender === user._id)}/>
                 </div>
            ))}
            
        </div>
        <div className="chatBoxBottom">
            <textarea 
             className="chatMessageInput"
             onChange={(e)=> setNewMessage(e.target.value)}
             value={newMessage}
             placeholder="Write Somehting... "
              />
            <button className="chatBoxButton" onClick={handleSubmit}>Send</button>
        </div> </>) : (<span className="noConversationText">Open a conversation to start a chat</span>)}
            
        </div>
    </div>
   
    <div className="chatOnline">
        <div className="chatOnlineWrapper">
            <ChatOnline  onlineUsers={onlineUsers} currentId={user._id}  setCurrentChat={setCurrentChat}/>
           
        </div>
    </div>

    </div>
    </>
  )
}
