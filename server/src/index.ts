import bodyParser from "body-parser";
import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import * as dotenv from "dotenv";

const app = express();
app.use(bodyParser.json());

dotenv.config();

const uri = process.env.MONGODB_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function getItems() {}

app.get("/", (req, res) => {
  res.send("Yes, it's up.");
});

app.get("/items", async (req, res) => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const items = client.db("q").collection("items");
    res.send(await items.find({}).toArray());
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

app.post("/items", async (req, res) => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const items = client.db("q").collection("items");
    res.send(await items.insertOne(req.body));
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

app.post("/items/:id", async (req, res) => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const items = client.db("q").collection("items");
    res.send(await items.replaceOne({ id: req.params.id }, req.body));
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
});

app.listen(3000, () => {
  console.log("Server is up.");
});
