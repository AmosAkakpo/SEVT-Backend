// const express = require("express")
// const database = require("./connect")
// const ObjectId = require("mongodb").ObjectId

// let branchRoutes = express.Router()

// //retrieve all 
// //http://localhost:3000/branches
// branchRoutes.route("/branches").get(async (request,response)=>{
//     let db = database.getDb()
//     let data = await db.collection("branches").find({}).toArray()

//     if(data.length>0){
//         response.json(data)
//     }else {
//         throw new Error("Data was not found :(")
//     }
// })

// //retrieve one
// //http://localhost:3000/branches/12345
// branchRoutes.route("/branches/:id").get(async (request,response)=>{
//     let db = database.getDb()
//     let data = await db.collection("branches").findOne({_id: new ObjectId(request.params.id)})

//     if(Object.keys(data).length>0){
//         response.json(data)
//     }else {
//         throw new Error("Data was not found :(")
//     }
// })


// //create one
// //http://localhost:3000/branches
// branchRoutes.route("/branches").post(async (request,response)=>{
//     let db = database.getDb()
//     let mongoObject = {
//         branchName : request.body.branchName ,
//         branchMainPastor: request.body.branchMainPastor,
//         branchLocation:request.body.branchLocation,
//         branchType:request.body.branchType,
//         branchCreationDate:request.body.branchCreationDate,
//     }
//     let data = await db.collection("branches").insertOne(mongoObject)
//     response.json(data)
// })


// //Update one
// //http://localhost:3000/branches
// branchRoutes.route("/branches/:id").post(async (request,response)=>{
//     let db = database.getDb()
//     let mongoObject = {
//         $set: {
//             branchName : request.body.branchName ,
//             branchMainPastor: request.body.branchMainPastor,
//             branchLocation:request.body.branchLocation,
//             branchType:request.body.branchType,
//             branchCreationDate:request.body.branchCreationDate
//         }
//     }
//     let data = await db.collection("branches").updateOne({_id: new ObjectId(request.params.id)},mongoObject)
//     response.json(data)
// })

// //Delete one
// //http://localhost:3000/branches
// branchRoutes.route("/branches/:id").delete(async (request,response)=>{
//     let db = database.getDb()
//     let data = await db.collection("branches").deleteOne({_id: new ObjectId(request.params.id)})

//     response.json(data)
// })


// module.exports = branchRoutes

const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");

let branchRoutes = express.Router();

function isValidObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

// GET all branches
branchRoutes.route("/").get(async (req, res) => {
  try {
    const db = database.getDb();
    const data = await db.collection("branches").find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET one branch
branchRoutes.route("/:id").get(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const db = database.getDb();
    const data = await db.collection("branches").findOne({ _id: new ObjectId(req.params.id) });
    if (!data) {
      return res.status(404).json({ error: "Branch not found" });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST create branch
branchRoutes.route("/").post(async (req, res) => {
  try {
    const db = database.getDb();
    let mongoObject = {
      branchName: req.body.branchName,
      branchMainPastor: req.body.branchMainPastor,
      branchLocation: req.body.branchLocation,
      branchType: req.body.branchType,
      branchCreationDate: req.body.branchCreationDate,
    };
    const data = await db.collection("branches").insertOne(mongoObject);
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update branch
branchRoutes.route("/:id").put(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const db = database.getDb();
    const updateData = {
      $set: {
        branchName: req.body.branchName,
        branchMainPastor: req.body.branchMainPastor,
        branchLocation: req.body.branchLocation,
        branchType: req.body.branchType,
        branchCreationDate: req.body.branchCreationDate,
      }
    };
    const data = await db.collection("branches").updateOne({ _id: new ObjectId(req.params.id) }, updateData);
    if (data.matchedCount === 0) {
      return res.status(404).json({ error: "Branch not found" });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE branch
branchRoutes.route("/:id").delete(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    const db = database.getDb();
    const data = await db.collection("branches").deleteOne({ _id: new ObjectId(req.params.id) });
    if (data.deletedCount === 0) {
      return res.status(404).json({ error: "Branch not found" });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = branchRoutes;
