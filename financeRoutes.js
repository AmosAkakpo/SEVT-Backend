const express = require("express")
const database = require("./connect")
const ObjectId = require("mongodb").ObjectId

let financeRoutes = express.Router()

//retrieve all 
//http://localhost:3000/finances
financeRoutes.route("/finances").get(async (request,response)=>{
    let db = database.getDb()
    let data = await db.collection("finances").find({}).toArray()

    if(data.length>0){
        response.json(data)
    }else {
        throw new Error("Data was not found :(")
    }
})

//retrieve one
//http://localhost:3000/finances/12345
financeRoutes.route("/finances/:id").get(async (request,response)=>{
    let db = database.getDb()
    let data = await db.collection("finances").findOne({_id: new ObjectId(request.params.id)})

    if(Object.keys(data).length>0){
        response.json(data)
    }else {
        throw new Error("Data was not found :(")
    }
})


//create one
//http://localhost:3000/finances
financeRoutes.route("/finances").post(async (request,response)=>{
    let db = database.getDb()
    let mongoObject = {
        branchName : request.body.branchName ,
        reason: request.body.reason,
        amount:request.body.amount,
        dateAdded:request.body.dateAdded,
        description:request.body.description,
    }
    let data = await db.collection("finances").insertOne(mongoObject)
    response.json(data)
})


//Update one
//http://localhost:3000/finances
financeRoutes.route("/finances/:id").post(async (request,response)=>{
    let db = database.getDb()
    let mongoObject = {
        $set: {
            branchName : request.body.branchName ,
            reason: request.body.reason,
            amount:request.body.amount,
            dateAdded:request.body.dateAdded,
            description:request.body.description,
        }
    }
    let data = await db.collection("finances").updateOne({_id: new ObjectId(request.params.id)},mongoObject)
    response.json(data)
})

//Delete one
//http://localhost:3000/finances
financeRoutes.route("/finances/:id").delete(async (request,response)=>{
    let db = database.getDb()
    let data = await db.collection("finances").deleteOne({_id: new ObjectId(request.params.id)})

    response.json(data)
})

// Get unique branch names
// http://localhost:3000/finances/branches
financeRoutes.route("/finances/branches").get(async (req, res) => {
  try {
    let db = database.getDb();
    let branches = await db.collection("finances").distinct("branchName");
    res.json(branches);
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.status(500).json({ error: "Failed to fetch branches" });
  }
});


module.exports = financeRoutes