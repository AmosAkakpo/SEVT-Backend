const express = require("express")
const database = require("./connect")
const ObjectId = require("mongodb").ObjectId

let zoneRoutes = express.Router()

//retrieve all 
//http://localhost:3000/zones
zoneRoutes.route("/zones").get(async (request,response)=>{
    let db = database.getDb()
    let data = await db.collection("zones").find({}).toArray()

    if(data.length>0){
        response.json(data)
    }else {
        throw new Error("Data was not found :(")
    }
})

//retrieve one
//http://localhost:3000/zones/12345
zoneRoutes.route("/zones/:id").get(async (request,response)=>{
    let db = database.getDb()
    let data = await db.collection("zones").findOne({_id: new ObjectId(request.params.id)})

    if(data && Object.keys(data).length>0){
        response.json(data)
    }else {
        throw new Error("Data was not found :(")
    }
})


//create one
//http://localhost:3000/zones
zoneRoutes.route("/zones").post(async (request,response)=>{
    let db = database.getDb()
    let mongoObject = {
        zoneName : request.body.zoneName ,
        branchList: request.body.branchList,

    }
    let data = await db.collection("zones").insertOne(mongoObject)
    response.json(data)
})


//Update one
//http://localhost:3000/zones
zoneRoutes.route("/zones/:id").post(async (request,response)=>{
    let db = database.getDb()
    let mongoObject = {
        $set: {
            zoneName : request.body.zoneName ,
            branchList: request.body.branchList,

        }
    }
    let data = await db.collection("zones").updateOne({_id: new ObjectId(request.params.id)},mongoObject)
    response.json(data)
})

//Delete one
//http://localhost:3000/zones
zoneRoutes.route("/zones/:id").delete(async (request,response)=>{
    let db = database.getDb()
    let data = await db.collection("zones").deleteOne({_id: new ObjectId(request.params.id)})

    response.json(data)
})


module.exports = zoneRoutes