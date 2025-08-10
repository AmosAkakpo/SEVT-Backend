// const express = require("express")
// const database = require("./connect")
// const ObjectId = require("mongodb").ObjectId

// let financeRoutes = express.Router()

// //retrieve all 
// //http://localhost:3000/finances
// financeRoutes.route("/finances").get(async (request,response)=>{
//     let db = database.getDb()
//     let data = await db.collection("finances").find({}).toArray()

//     if(data.length>0){
//         response.json(data)
//     }else {
//         throw new Error("Data was not found :(")
//     }
// })

// //retrieve one
// //http://localhost:3000/finances/12345
// financeRoutes.route("/finances/:id").get(async (request,response)=>{
//     let db = database.getDb()
//     let data = await db.collection("finances").findOne({_id: new ObjectId(request.params.id)})

//     if(Object.keys(data).length>0){
//         response.json(data)
//     }else {
//         throw new Error("Data was not found :(")
//     }
// })


// //create one
// //http://localhost:3000/finances
// financeRoutes.route("/finances").post(async (request,response)=>{
//     let db = database.getDb()
//     let mongoObject = {
//         branchName : request.body.branchName ,
//         reason: request.body.reason,
//         amount:request.body.amount,
//         dateAdded:request.body.dateAdded,
//         description:request.body.description,
//     }
//     let data = await db.collection("finances").insertOne(mongoObject)
//     response.json(data)
// })


// //Update one
// //http://localhost:3000/finances
// financeRoutes.route("/finances/:id").post(async (request,response)=>{
//     let db = database.getDb()
//     let mongoObject = {
//         $set: {
//             branchName : request.body.branchName ,
//             reason: request.body.reason,
//             amount:request.body.amount,
//             dateAdded:request.body.dateAdded,
//             description:request.body.description,
//         }
//     }
//     let data = await db.collection("finances").updateOne({_id: new ObjectId(request.params.id)},mongoObject)
//     response.json(data)
// })

// //Delete one
// //http://localhost:3000/finances
// financeRoutes.route("/finances/:id").delete(async (request,response)=>{
//     let db = database.getDb()
//     let data = await db.collection("finances").deleteOne({_id: new ObjectId(request.params.id)})

//     response.json(data)
// })

// // Get unique branch names
// // http://localhost:3000/finances/branches
// financeRoutes.route("/finances/branches").get(async (req, res) => {
//   try {
//     let db = database.getDb();
//     let branches = await db.collection("finances").distinct("branchName");
//     res.json(branches);
//   } catch (err) {
//     console.error("Error fetching branches:", err);
//     res.status(500).json({ error: "Failed to fetch branches" });
//   }
// });


// module.exports = financeRoutes

const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");

let financeRoutes = express.Router();

function isValidObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

// GET all finances
financeRoutes.route("/").get(async (req, res) => {
  try {
    let db = database.getDb();
    let data = await db.collection("finances").find({}).toArray();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET one finance by ID
financeRoutes.route("/:id").get(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    let db = database.getDb();
    let data = await db.collection("finances").findOne({ _id: new ObjectId(req.params.id) });

    if (!data) {
      return res.status(404).json({ error: "Finance record not found" });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE a finance record
financeRoutes.route("/").post(async (req, res) => {
  try {
    let db = database.getDb();
    let mongoObject = {
      branchName: req.body.branchName,
      reason: req.body.reason,
      amount: req.body.amount,
      dateAdded: req.body.dateAdded,
      description: req.body.description,
    };
    let data = await db.collection("finances").insertOne(mongoObject);
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE a finance record by ID
financeRoutes.route("/:id").put(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    let db = database.getDb();
    let updateData = {
      $set: {
        branchName: req.body.branchName,
        reason: req.body.reason,
        amount: req.body.amount,
        dateAdded: req.body.dateAdded,
        description: req.body.description,
      }
    };
    let data = await db.collection("finances").updateOne({ _id: new ObjectId(req.params.id) }, updateData);

    if (data.matchedCount === 0) {
      return res.status(404).json({ error: "Finance record not found" });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a finance record by ID
financeRoutes.route("/:id").delete(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    let db = database.getDb();
    let data = await db.collection("finances").deleteOne({ _id: new ObjectId(req.params.id) });

    if (data.deletedCount === 0) {
      return res.status(404).json({ error: "Finance record not found" });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get unique branch names
financeRoutes.route("/branches").get(async (req, res) => {
  try {
    let db = database.getDb();
    let branches = await db.collection("finances").distinct("branchName");
    res.json(branches);
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.status(500).json({ error: "Failed to fetch branches" });
  }
});

module.exports = financeRoutes;
