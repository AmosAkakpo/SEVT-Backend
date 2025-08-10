// const express = require("express")
// const database = require("./connect")
// const ObjectId = require("mongodb").ObjectId
// const bcrypt = require("bcrypt")


// let userRoutes = express.Router()
// const SALT_ROUNDS =6
// // ✅ Get all users
// userRoutes.route("/users").get(async (req, res) => {
//     let db = database.getDb()
//     let data = await db.collection("users").find({}).toArray()
//     if (data.length > 0) {
//         res.json(data)
//     } else {
//         res.status(404).json({ message: "No users found" })
//     }
// })

// // ✅ Get one user
// userRoutes.route("/users/:id").get(async (req, res) => {
//     let db = database.getDb()
//     let data = await db.collection("users").findOne({ _id: new ObjectId(req.params.id) })
//     if (data) {
//         res.json(data)
//     } else {
//         res.status(404).json({ message: "User not found" })
//     }
// })

// // ✅ Create a user
// userRoutes.route("/users").post(async (req, res) => {
//     let db = database.getDb()

//     const takenEmail =await db.collection("users").findOne({email:request.body.email})

//     if (takenEmail){
//         response.jsong({message:"The Email is taken"})
//     }else{
//         const hashpwd =await bcrypt.hash(request.body.userpwd,SALT_ROUNDS)
//         let newUser = {
//         username: req.body.username,
//         useremail: req.body.useremail,
//         userpwd: hashpwd,
//         joinDate: new Date()
//     }
//     let result = await db.collection("users").insertOne(newUser)
//     res.json(result)
//     }
    
// })

// // ✅ Update a user
// userRoutes.route("/users/:id").put(async (req, res) => {
//     let db = database.getDb()
//     let updates = {
//         $set: {
//             username: req.body.username,
//             useremail: req.body.useremail,
//             userpwd: req.body.userpwd,
//         }
//     }
//     let result = await db.collection("users").updateOne({ _id: new ObjectId(req.params.id) }, updates)
//     res.json(result)
// })

// // ✅ Delete a user
// userRoutes.route("/users/:id").delete(async (req, res) => {
//     let db = database.getDb()
//     let result = await db.collection("users").deleteOne({ _id: new ObjectId(req.params.id) })
//     res.json(result)
// })

// module.exports = userRoutes


const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

let userRoutes = express.Router();
const SALT_ROUNDS = 6;

function isValidObjectId(id) {
  return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

// GET all users
userRoutes.route("/").get(async (req, res) => {
  try {
    let db = database.getDb();
    let data = await db.collection("users").find({}).toArray();
    if (data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({ message: "No users found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET one user by ID
userRoutes.route("/:id").get(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    let db = database.getDb();
    let data = await db.collection("users").findOne({ _id: new ObjectId(req.params.id) });
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE user
userRoutes.route("/").post(async (req, res) => {
  try {
    let db = database.getDb();
    const takenEmail = await db.collection("users").findOne({ useremail: req.body.useremail });
    if (takenEmail) {
      return res.status(409).json({ message: "The email is already taken" });
    }
    const hashpwd = await bcrypt.hash(req.body.userpwd, SALT_ROUNDS);
    let newUser = {
      username: req.body.username,
      useremail: req.body.useremail,
      userpwd: hashpwd,
      joinDate: new Date(),
    };
    let result = await db.collection("users").insertOne(newUser);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE user by ID
userRoutes.route("/:id").put(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    let db = database.getDb();
    const updateData = {
      $set: {
        username: req.body.username,
        useremail: req.body.useremail,
      }
    };

    // Hash password if provided
    if (req.body.userpwd) {
      updateData.$set.userpwd = await bcrypt.hash(req.body.userpwd, SALT_ROUNDS);
    }

    let result = await db.collection("users").updateOne({ _id: new ObjectId(req.params.id) }, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE user by ID
userRoutes.route("/:id").delete(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    let db = database.getDb();
    let result = await db.collection("users").deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = userRoutes;
