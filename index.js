const express = require('express')
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
require('dotenv').config()

const port = process.env.PORT || 5000;
// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xfw0kqg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const spotCollection = client.db('touristdb').collection('spots')
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
app.get('/tourist', async( req,res)=>{
  const cursor = spotCollection.find()
  const result = await cursor.toArray()
  res.send(result)
})

app.get('/tourist/:email' , async (req,res)=>{
  // console.log(req.params.email);
  const result = await spotCollection.find({Email:req.params.email}).toArray()
  // const id = req.params.email
  // const query = {}
  res.send(result)
})
app.post('/tourist',async (req,res)=>{
  const info =req.body
  console.log(info);
  const result = await spotCollection.insertOne(info)
  res.send(result)
})
app.delete('/tourist/:id',async(req,res)=>{
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  const result = await spotCollection.deleteOne(query)
  res.send(result)
})
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Tourism server is running')
  })
  
  app.listen(port, () => {
    console.log(`Tourism server is running on port ${port}`)
  })