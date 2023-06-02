const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

//Get ToDoLists
router.get("/getAllLists", async (req, res) => {
  const lists = await loadListsCollection();
  res.send(await lists.find({}).toArray());
});

//Add ToDoList
router.post("/createList", async (req, res) => {
  const lists = await loadListsCollection();
  await lists.insertOne({
    title: req.body.data,
    isArchived: false,
    hasArchivedTasks: false,
    order: 0,
    tasks: [],
  });
  res.status(201).send();
});

//Move ToDoList
router.put("/moveList/:id", async (req, res) => {
  const lists = await loadListsCollection();
  const $set = {
    order: req.body.order,
  };
  await lists.findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.params.id) },
    {
      $set,
    },
    {
      new: true,
      upsert: true,
      rawResult: true,
    }
  );
  res.status(204).send();
});

//Rename ToDoList
router.put("/renameList/:id", async (req, res) => {
  const lists = await loadListsCollection();
  const $set = {
    title: req.body.title,
  };
  await lists.findOneAndUpdate(
    { _id: new mongodb.ObjectId(req.params.id) },
    {
      $set,
    },
    {
      new: true,
      upsert: true,
      rawResult: true,
    }
  );
  res.status(204).send();
});

async function loadListsCollection() {
  const client = await mongodb.MongoClient.connect(
    `mongodb://localhost:27017/todo`,
    {
      useNewUrlParser: true,
    }
  );

  return client.db("todo").collection("lists");
}

module.exports = router;
