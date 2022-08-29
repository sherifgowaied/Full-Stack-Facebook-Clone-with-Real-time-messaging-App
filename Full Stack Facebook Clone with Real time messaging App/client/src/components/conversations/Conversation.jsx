import axios from 'axios'
import { useEffect, useState } from 'react'
import './conversations.css'

export const Conversations = ({conversation,currentUser}) => {
  const[Chatuser,setChatUser]=useState(null)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  console.log(conversation,
    currentUser)

  useEffect(()=>{
    const friendId = conversation.members.find((m)=>m !== currentUser._id )

    const getUser = async()=>{
      try {
        const res =await axios.get("/users?userId="+friendId);
        setChatUser(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  },[conversation,currentUser])
  // console.log({Chatuser,"sheko":"sheko"})
  return (
    <div className="conversation">
        <img className="conversationImg"
        src={Chatuser?.profilePicture ?  Chatuser.profilePicture : PF+"person/noAvatar.png"}
         alt=""  />
        <span className="conversationName">{Chatuser?.username}</span>
    </div>
  )
}
