const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

//Create Task
router.post("/createTask", async (req, res) => {
  const tasks = await loadTasksCollection();
  await tasks.insertOne({
    title: req.body.data.title,
    description: req.body.data.description,
    parentId: req.body.data.parentId,
    parentTitle: req.body.data.parentTitle,
    isArchived: false,
    order: 0,
    deleted: false,
    completed: false,
  });
  res.status(201).send();
});

//Get All Tasks
router.get("/getAllTasks", async (req, res) => {
  const tasks = await loadTasksCollection();
  res.send(await tasks.find({}).toArray());
});

//Get Task by ID
router.get("/getTask/:id", async (req, res) => {
  const tasks = await loadTasksCollection();
  res.send(
    await tasks.find({ _id: new mongodb.ObjectId(req.params.id) }).toArray()
  );
});

//Move Task
router.put("/moveTask/:id", async (req, res) => {
  const tasks = await loadTasksCollection();
  const $set = {
    order: req.body.order,
  };
  await tasks.findOneAndUpdate(
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

//Delete Task
router.delete("/deleteTask/:id", async (req, res) => {
  const tasks = await loadTasksCollection();
  await tasks.deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
  res.status(200).send();
});

//Complete Task
router.put("/completeTask/:id", async (req, res) => {
  const tasks = await loadTasksCollection();
  const $set = {
    completed: req.body.completed,
  };
  await tasks.findOneAndUpdate(
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

//Update Task title & description
router.put("/updateTask/:id", async (req, res) => {
  const tasks = await loadTasksCollection();
  const $set = {
    title: req.body.title,
    description: req.body.description,
  };
  await tasks.findOneAndUpdate(
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

async function loadTasksCollection() {
  const client = await mongodb.MongoClient.connect(
    `mongodb://localhost:27017/todo`,
    {
      useNewUrlParser: true,
    }
  );

  return client.db("todo").collection("tasks");
}

module.exports = router;
