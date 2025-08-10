// const express = require("express")
// const database = require("./connect")
// const ObjectId = require("mongodb").ObjectId

// let serviceRoutes = express.Router()

// //retrieve all 
// //http://localhost:3000/services
// serviceRoutes.route("/services").get(async (request,response)=>{
//     let db = database.getDb()
//     let data = await db.collection("services").find({}).toArray()

//     if(data.length>0){
//         response.json(data)
//     }else {
//         throw new Error("Data was not found :(")
//     }
// })

// //retrieve one
// //http://localhost:3000/services/12345
// serviceRoutes.route("/services/:id").get(async (request,response)=>{
//     let db = database.getDb()
//     let data = await db.collection("services").findOne({_id: new ObjectId(request.params.id)})

//     if(data){
//         response.json(data)
//     }else {
//         throw new Error("Data was not found :(")
//     }
// })


// //create one
// //http://localhost:3000/services
// serviceRoutes.route("/services").post(async (request,response)=>{
//     let db = database.getDb()
//     let mongoObject = {
//         branchName : request.body.branchName ,
//         dateCreated: request.body.dateCreated,
//         numberOfMember:request.body.numberOfMember,
        
//     }
//     let data = await db.collection("services").insertOne(mongoObject)
//     response.json(data)
// })


// //Update one
// //http://localhost:3000/services
// serviceRoutes.route("/services/:id").post(async (request,response)=>{
//     let db = database.getDb()
//     let mongoObject = {
//         $set: {
//             branchName : request.body.branchName ,
//             dateCreated: request.body.dateCreated,
//             numberOfMember:request.body.numberOfMember,
//         }
//     }
//     let data = await db.collection("services").updateOne({_id: new ObjectId(request.params.id)},mongoObject)
//     response.json(data)
// })

// //Delete one
// //http://localhost:3000/services
// serviceRoutes.route("/services/:id").delete(async (request,response)=>{
//     let db = database.getDb()
//     let data = await db.collection("services").deleteOne({_id: new ObjectId(request.params.id)})

//     response.json(data)
// })

// // GET last 10 services for a branch, sorted by date descending
// serviceRoutes.route("/services/by-branch/:branchName").get(async (req, res) => {
//   let db = database.getDb();
//   const branchName = req.params.branchName;

//   try {
//     const data = await db.collection("services")
//       .find({ branchName: branchName })
//       .sort({ dateCreated: -1 })
//       .limit(10)
//       .toArray();

//     if (data.length > 0) {
//       res.json(data);
//     } else {
//       res.json([]); // Return empty array if no services found
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = serviceRoutes
const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");

let serviceRoutes = express.Router();

function isValidObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

// GET all services
serviceRoutes.route("/").get(async (req, res) => {
  try {
    let db = database.getDb();
    let data = await db.collection("services").find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET one service by ID
serviceRoutes.route("/:id").get(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    let db = database.getDb();
    let data = await db.collection("services").findOne({ _id: new ObjectId(req.params.id) });
    if (!data) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE a service
serviceRoutes.route("/").post(async (req, res) => {
  try {
    let db = database.getDb();
    let mongoObject = {
      branchName: req.body.branchName,
      dateCreated: req.body.dateCreated,
      numberOfMember: req.body.numberOfMember,
    };
    let data = await db.collection("services").insertOne(mongoObject);
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE a service by ID
serviceRoutes.route("/:id").put(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    let db = database.getDb();
    let updateData = {
      $set: {
        branchName: req.body.branchName,
        dateCreated: req.body.dateCreated,
        numberOfMember: req.body.numberOfMember,
      }
    };
    let data = await db.collection("services").updateOne({ _id: new ObjectId(req.params.id) }, updateData);
    if (data.matchedCount === 0) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a service by ID
serviceRoutes.route("/:id").delete(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    let db = database.getDb();
    let data = await db.collection("services").deleteOne({ _id: new ObjectId(req.params.id) });
    if (data.deletedCount === 0) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET last 10 services for a branch, sorted by date descending
serviceRoutes.route("/by-branch/:branchName").get(async (req, res) => {
  try {
    let db = database.getDb();
    const branchName = req.params.branchName;

    const data = await db.collection("services")
      .find({ branchName })
      .sort({ dateCreated: -1 })
      .limit(10)
      .toArray();

    res.json(data); // empty array if none found
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = serviceRoutes;
