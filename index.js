const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

// amirhossainbc75
// sHiKJoo3fAljOTPP

// midewaare
const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}
app.use(cors(corsOptions));
app.use(express.json());

const port = process.env.PORT || 5000;

const uri =
  "mongodb+srv://amirhossainbc75:sHiKJoo3fAljOTPP@cluster0.3yb9d5d.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db("productDB").collection("products");

    //ADDING PRODUCTS
    app.post("/products", async (req, res) => {
      const product = req.body;
      // console.log('get product',product)
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    //getting products
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

     // Get products by brand
    app.get("/products/:brand", async (req, res) => {
      const brandName = req.params.brand;
   
      const query = { brandname: brandName.toLowerCase() };
      // console.log(query)
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get singel product by id
    app.get('/productsbyid/:id',async(req,res)=>{
      const id =req.params.id;
      const query={_id: new ObjectId(id)}
      const result =await productCollection.findOne(query);
      res.send(result)
    })

// updated a products
app.put('/products/:id',async(req,res)=>{
  const id =req.params.id;
  const filter ={_id: new ObjectId(id)};
  const options ={upsert:true};
  const updatedProduct=req.body;
  const product ={ 
    $set : {
      photourl:updatedProduct.photourl, 
      brandname:updatedProduct.brandname,
       name:updatedProduct.name,
       price:updatedProduct.price, 
       rating:updatedProduct.rating,
        type: updatedProduct.type
    }
  }
  const result =await productCollection.updateOne(filter,product,options)
  res.send(result)
})

// delete a data 
app.delete('/products/:id',async(req,res)=>{
  const id =req.params.id;
  const query ={_id: new ObjectId(id)}
  const result =await productCollection.deleteOne(query);
  res.send(result)
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Crud is running...");
});

app.listen(port, () => {
  console.log(`Simple Crud is Running on port ${port}`);
});
