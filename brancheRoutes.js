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
      branchmptelephone: req.body.branchmptelephone, // <-- NEW FIELD
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
// PUT update branch (partial update supported)
branchRoutes.route("/:id").put(async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const db = database.getDb();

    // Build update object dynamically
    const updateFields = {};
    if (req.body.branchName !== undefined) updateFields.branchName = req.body.branchName;
    if (req.body.branchMainPastor !== undefined) updateFields.branchMainPastor = req.body.branchMainPastor;
    if (req.body.branchmptelephone !== undefined) updateFields.branchmptelephone = req.body.branchmptelephone;
    if (req.body.branchLocation !== undefined) updateFields.branchLocation = req.body.branchLocation;
    if (req.body.branchType !== undefined) updateFields.branchType = req.body.branchType;
    if (req.body.branchCreationDate !== undefined) updateFields.branchCreationDate = req.body.branchCreationDate;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const result = await db.collection("branches").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Branch not found" });
    }

    res.json({ message: "Branch updated", result });
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
