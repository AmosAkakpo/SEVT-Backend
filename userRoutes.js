const express = require("express")
const database = require("./connect")
const ObjectId = require("mongodb").ObjectId
const bcrypt = require("bcrypt")


let userRoutes = express.Router()
const SALT_ROUNDS =6
// ✅ Get all users
userRoutes.route("/users").get(async (req, res) => {
    let db = database.getDb()
    let data = await db.collection("users").find({}).toArray()
    if (data.length > 0) {
        res.json(data)
    } else {
        res.status(404).json({ message: "No users found" })
    }
})

// ✅ Get one user
userRoutes.route("/users/:id").get(async (req, res) => {
    let db = database.getDb()
    let data = await db.collection("users").findOne({ _id: new ObjectId(req.params.id) })
    if (data) {
        res.json(data)
    } else {
        res.status(404).json({ message: "User not found" })
    }
})

// ✅ Create a user
userRoutes.route("/users").post(async (req, res) => {
    let db = database.getDb()

    const takenEmail =await db.collection("users").findOne({email:request.body.email})

    if (takenEmail){
        response.jsong({message:"The Email is taken"})
    }else{
        const hashpwd =await bcrypt.hash(request.body.userpwd,SALT_ROUNDS)
        let newUser = {
        username: req.body.username,
        useremail: req.body.useremail,
        userpwd: hashpwd,
        joinDate: new Date()
    }
    let result = await db.collection("users").insertOne(newUser)
    res.json(result)
    }
    
})

// ✅ Update a user
userRoutes.route("/users/:id").put(async (req, res) => {
    let db = database.getDb()
    let updates = {
        $set: {
            username: req.body.username,
            useremail: req.body.useremail,
            userpwd: req.body.userpwd,
        }
    }
    let result = await db.collection("users").updateOne({ _id: new ObjectId(req.params.id) }, updates)
    res.json(result)
})

// ✅ Delete a user
userRoutes.route("/users/:id").delete(async (req, res) => {
    let db = database.getDb()
    let result = await db.collection("users").deleteOne({ _id: new ObjectId(req.params.id) })
    res.json(result)
})

module.exports = userRoutes
