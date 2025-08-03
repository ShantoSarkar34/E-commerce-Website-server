const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv%3A//${process.env.DB_USER}%3A${process.env.DB_PASSWORD}%40shopo-server.putq3dw.mongodb.net/?retryWrites=true&w=majority&appName=ShopO-Server`;

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
    // ===================== all product start ==============
    app.get("/all-products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get single product
    app.get("/all-products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.post("/all-products", async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
      console.log(result);
    });
    //===================== all product end ===============

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
