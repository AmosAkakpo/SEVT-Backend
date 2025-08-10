// const express = require("express")
// const database = require("./connect")
// const ObjectId = require("mongodb").ObjectId

// let zoneRoutes = express.Router()

// //retrieve all 
// //http://localhost:3000/zones
// zoneRoutes.route("/zones").get(async (request,response)=>{
//     let db = database.getDb()
//     let data = await db.collection("zones").find({}).toArray()

//     if(data.length>0){
//         response.json(data)
//     }else {
//         throw new Error("Data was not found :(")
//     }
// })

// //retrieve one
// //http://localhost:3000/zones/12345
// zoneRoutes.route("/zones/:id").get(async (request,response)=>{
//     let db = database.getDb()
//     let data = await db.collection("zones").findOne({_id: new ObjectId(request.params.id)})

//     if(data && Object.keys(data).length>0){
//         response.json(data)
//     }else {
//         throw new Error("Data was not found :(")
//     }
// })


// //create one
// //http://localhost:3000/zones
// zoneRoutes.route("/zones").post(async (request,response)=>{
//     let db = database.getDb()
//     let mongoObject = {
//         zoneName : request.body.zoneName ,
//         branchList: request.body.branchList,

//     }
//     let data = await db.collection("zones").insertOne(mongoObject)
//     response.json(data)
// })


// //Update one
// //http://localhost:3000/zones
// zoneRoutes.route("/zones/:id").post(async (request,response)=>{
//     let db = database.getDb()
//     let mongoObject = {
//         $set: {
//             zoneName : request.body.zoneName ,
//             branchList: request.body.branchList,

//         }
//     }
//     let data = await db.collection("zones").updateOne({_id: new ObjectId(request.params.id)},mongoObject)
//     response.json(data)
// })

// //Delete one
// //http://localhost:3000/zones
// zoneRoutes.route("/zones/:id").delete(async (request,response)=>{
//     let db = database.getDb()
//     let data = await db.collection("zones").deleteOne({_id: new ObjectId(request.params.id)})

//     response.json(data)
// })


// module.exports = zoneRoutes


const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");

let zoneRoutes = express.Router();

function isValidObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

// GET all zones
zoneRoutes.route("/").get(async (req, res) => {
  try {
    let db = database.getDb();
    let data = await db.collection("zones").find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET one zone by ID
zoneRoutes.route("/:id").get(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid zone ID" });
    }
    let db = database.getDb();
    let data = await db.collection("zones").findOne({ _id: new ObjectId(req.params.id) });
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: "Zone not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE a zone
zoneRoutes.route("/").post(async (req, res) => {
  try {
    let db = database.getDb();
    let mongoObject = {
      zoneName: req.body.zoneName,
      branchList: req.body.branchList,
    };
    let data = await db.collection("zones").insertOne(mongoObject);
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE a zone by ID
zoneRoutes.route("/:id").put(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid zone ID" });
    }
    let db = database.getDb();
    let updateData = {
      $set: {
        zoneName: req.body.zoneName,
        branchList: req.body.branchList,
      }
    };
    let data = await db.collection("zones").updateOne({ _id: new ObjectId(req.params.id) }, updateData);

    if (data.matchedCount === 0) {
      return res.status(404).json({ message: "Zone not found" });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a zone by ID
zoneRoutes.route("/:id").delete(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid zone ID" });
    }
    let db = database.getDb();
    let data = await db.collection("zones").deleteOne({ _id: new ObjectId(req.params.id) });

    if (data.deletedCount === 0) {
      return res.status(404).json({ message: "Zone not found" });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = zoneRoutes;
