const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@shopo-server.putq3dw.mongodb.net/?retryWrites=true&w=majority&appName=ShopO-Server`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db("AllProducts");
    const productsCollection = database.collection("products");
    const cartsCollection = database.collection("all-carts");
    const likeCollection = database.collection("like-list");
    // ===================== all product start ==============
    app.get("/all-products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get single product
    app.get("/all-products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await productsCollection.findOne(query);
      res.send(result);
      console.log(result);
    });

    app.post("/all-products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    //===================== add to cart start ===============

    app.get("/all-carts", async (req, res) => {
      const cursor = cartsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get single cart
    app.get("/all-carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.findOne(query);
      res.send(result);
    });

    app.post("/all-carts", async (req, res) => {
      const newCart = req.body;
      const result = await cartsCollection.insertOne(newCart);
      res.send(result);
    });

    app.delete("/all-carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
    });

    // ================= all like list start =================

    app.get("/liked-items", async (req, res) => {
      const cursor = likeCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get single cart
    app.get("/liked-items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.findOne(query);
      res.send(result);
    });

    app.post("/liked-items", async (req, res) => {
      const newCart = req.body;
      const result = await likeCollection.insertOne(newCart);
      res.send(result);
    });

    app.delete("/liked-items/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await likeCollection.deleteOne(query);
      res.send(result);
    });

    // ================= *** ====================

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ShopO server is active now...!");
});

app.listen(port, () => {
  console.log(`ShopO server is running on port ${port}`);
});
