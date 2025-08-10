const express = require("express")
const database = require("./connect")
const ObjectId = require("mongodb").ObjectId

let serviceRoutes = express.Router()

//retrieve all 
//http://localhost:3000/services
serviceRoutes.route("/services").get(async (request,response)=>{
    let db = database.getDb()
    let data = await db.collection("services").find({}).toArray()

    if(data.length>0){
        response.json(data)
    }else {
        throw new Error("Data was not found :(")
    }
})

//retrieve one
//http://localhost:3000/services/12345
serviceRoutes.route("/services/:id").get(async (request,response)=>{
    let db = database.getDb()
    let data = await db.collection("services").findOne({_id: new ObjectId(request.params.id)})

    if(data){
        response.json(data)
    }else {
        throw new Error("Data was not found :(")
    }
})


//create one
//http://localhost:3000/services
serviceRoutes.route("/services").post(async (request,response)=>{
    let db = database.getDb()
    let mongoObject = {
        branchName : request.body.branchName ,
        dateCreated: request.body.dateCreated,
        numberOfMember:request.body.numberOfMember,
        
    }
    let data = await db.collection("services").insertOne(mongoObject)
    response.json(data)
})


//Update one
//http://localhost:3000/services
serviceRoutes.route("/services/:id").post(async (request,response)=>{
    let db = database.getDb()
    let mongoObject = {
        $set: {
            branchName : request.body.branchName ,
            dateCreated: request.body.dateCreated,
            numberOfMember:request.body.numberOfMember,
        }
    }
    let data = await db.collection("services").updateOne({_id: new ObjectId(request.params.id)},mongoObject)
    response.json(data)
})

//Delete one
//http://localhost:3000/services
serviceRoutes.route("/services/:id").delete(async (request,response)=>{
    let db = database.getDb()
    let data = await db.collection("services").deleteOne({_id: new ObjectId(request.params.id)})

    response.json(data)
})

// GET last 10 services for a branch, sorted by date descending
serviceRoutes.route("/services/by-branch/:branchName").get(async (req, res) => {
  let db = database.getDb();
  const branchName = req.params.branchName;

  try {
    const data = await db.collection("services")
      .find({ branchName: branchName })
      .sort({ dateCreated: -1 })
      .limit(10)
      .toArray();

    if (data.length > 0) {
      res.json(data);
    } else {
      res.json([]); // Return empty array if no services found
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = serviceRoutes