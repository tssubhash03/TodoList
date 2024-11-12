//Using Express Framework
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

//Create instance of Express
const app = express()
app.use(express.json())
app.use(cors())

//Define port for server
const port  = 8000

app.listen(port,() =>{
    console.log("Server running on port : "+port)
})

//Connecting to Database
mongoose.connect('mongodb://localhost:27017/MERN_PROJECT')
.then(() => {
    console.log("MERN_PROJECT Database Connected ")
} )
.catch(() => {
    console.log(err)
})
    //Creating Schema 
    const schema = new mongoose.Schema({
        title : String ,
        description : String
    })

    // Creating Model 
    const todoModel = mongoose.model('Todo',schema)//'Todo' convert to 'todos'in DB 

//Define route
    
//Sample in-memory storage
// const todo = []
    // Getting request 
    app.post('/todos',async (req,res) =>{
        const {title,description} = req.body;
        // const newtodo = {
        //     id : todo.length + 1,
        //     title,
        //     description
        // }
        //todo.push(newtodo)
        try{
            const newtodo = new todoModel({title,description})
            await newtodo.save()
            res.status(201).json(newtodo)
        }
        catch(error){
            console.log(error)
            res.status(500)
        }
    })
    // Fetching Data from DB and send to Front End
    app.get('/todos',async (req,res) => {
        try {
            const todo = await todoModel.find()
            res.json(todo)
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    })

    //Updating item in DB
    app.put('/todos/:id',async(req,res) =>{
        try {
            const id = req.params.id //accessing the document by id must have ':'in front of parameter.
        const {title,description} = req.body
        const updatedtodo =await todoModel.findByIdAndUpdate(
            id,
        { title,description},
        {new : true}
        )
        if(!updatedtodo){
        return res.status(404).json({message:"Not updated may be due to incorrect id"})
        }
        res.json(updatedtodo)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    })

    //Deleting item in DB
    app.delete('/todos/:id',async (req,res)=>{
        try {
            const id = req.params.id
        await todoModel.findByIdAndDelete(id)
        res.status(204).end()
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    })