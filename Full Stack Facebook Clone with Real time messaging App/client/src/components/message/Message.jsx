import  './message.css'
import {format} from "timeago.js"
import {useEffect, useState} from "react"
import axios from "axios"

export const Message = ({message,own}) => {
  const [sender,setSender]=useState(null)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(()=>{
    
      const getUser = async()=>{
        try{
          const res = await axios.get('/users?userId='+message.sender)
          setSender(res.data)
        }catch(error){
          console.log(error)
        }
      }
      getUser()
  },[message])
  console.log(message,own)
  return (
         <div className={own ? "message own" : "message"}>
            <div className='messageTop'>
                <img src={sender?.profilePicture ? sender.profilePicture : PF+"person/noAvatar.png"} alt=""  className='messageImg' />
                <p className="messageText">{message.text}</p>
            </div>
            <div className='messageBottom'>
                {format(message.createdAt)}
            </div>
         </div>
  )
}
