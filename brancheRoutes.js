const express = require("express")
const database = require("./connect")
const ObjectId = require("mongodb").ObjectId

let branchRoutes = express.Router()

//retrieve all 
//http://localhost:3000/branches
branchRoutes.route("/branches").get(async (request,response)=>{
    let db = database.getDb()
    let data = await db.collection("branches").find({}).toArray()

    if(data.length>0){
        response.json(data)
    }else {
        throw new Error("Data was not found :(")
    }
})

//retrieve one
//http://localhost:3000/branches/12345
branchRoutes.route("/branches/:id").get(async (request,response)=>{
    let db = database.getDb()
    let data = await db.collection("branches").findOne({_id: new ObjectId(request.params.id)})

    if(Object.keys(data).length>0){
        response.json(data)
    }else {
        throw new Error("Data was not found :(")
    }
})


//create one
//http://localhost:3000/branches
branchRoutes.route("/branches").post(async (request,response)=>{
    let db = database.getDb()
    let mongoObject = {
        branchName : request.body.branchName ,
        branchMainPastor: request.body.branchMainPastor,
        branchLocation:request.body.branchLocation,
        branchType:request.body.branchType,
        branchCreationDate:request.body.branchCreationDate,
    }
    let data = await db.collection("branches").insertOne(mongoObject)
    response.json(data)
})


//Update one
//http://localhost:3000/branches
branchRoutes.route("/branches/:id").post(async (request,response)=>{
    let db = database.getDb()
    let mongoObject = {
        $set: {
            branchName : request.body.branchName ,
            branchMainPastor: request.body.branchMainPastor,
            branchLocation:request.body.branchLocation,
            branchType:request.body.branchType,
            branchCreationDate:request.body.branchCreationDate
        }
    }
    let data = await db.collection("branches").updateOne({_id: new ObjectId(request.params.id)},mongoObject)
    response.json(data)
})

//Delete one
//http://localhost:3000/branches
branchRoutes.route("/branches/:id").delete(async (request,response)=>{
    let db = database.getDb()
    let data = await db.collection("branches").deleteOne({_id: new ObjectId(request.params.id)})

    response.json(data)
})


module.exports = branchRoutes