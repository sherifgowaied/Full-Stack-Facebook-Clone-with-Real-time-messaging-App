const Message = require('../models/Message')
const router = require('express').Router()

//CREATE
router.post('/',async(req,res)=>{
    try{
        const message = new Message(req.body)
        const savedMessage =await message.save()
        res.status(201).json(savedMessage)
    }catch(err){
        res.status(500).json(err)
    }
})
//GET

router.get("/:conversationId",async(req,res)=>{
    try{
        const messages = await Message.find({
        conversationId:req.params.conversationId
    })
    res.status(200).json(messages)
    }catch(error){
        res.status(500).json(err)
    }
})




module.exports = router;