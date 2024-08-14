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
    const countryCollection = client.db('touristdb').collection('country')
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

app.get('/tourist',async(req,res)=> {
  try {
    const { minPrice, maxPrice } = req.query;
    const query = {};

    if (minPrice) query.
    cost = { $gte: parseInt(minPrice) };
    if (maxPrice) {
      query.
      cost = query.
      cost || {};
      query.
      cost.$lte = parseInt(maxPrice);
    }


    const spots = await spotCollection.find(query).toArray();


    res.send(spots);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).send(error);
  }
})
app.get('/tourist/getemail/:email' , async (req,res)=>{
  const result = await spotCollection.find({Email:req.params.email}).toArray()

  res.send(result)
})

app

app.get('/country',async(req,res)=>{
  const cursor = countryCollection.find()
  const result= await cursor.toArray()
  res.send(result)
})

app.get('/tourist/:id' , async (req,res)=>{
  const id = req.params.id
  console.log(id);
  const query = {_id: new ObjectId(id)}
  const result = await spotCollection.findOne(query)
  console.log(result);
  res.send(result)
})
app.post('/tourist',async (req,res)=>{
  const info =req.body
  console.log(info);
  const result = await spotCollection.insertOne(info)
  res.send(result)
})
app.get('/spot/bycountry/:country_Name', async (req, res) => {
  try {
    const country_Name = req.params.country_Name;
    const query = { country_Name: country_Name }; 


    const result = await spotCollection.find(query).toArray();
    if (result.length === 0) {
      res.status(404).send({ message: 'No spots found for this country' });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error('Error fetching spots by country:', error);
    res.status(500).send(error);
  }
});


app.put('/tourist/:id' , async (req,res)=>{
  const id = req.params.id
  const filter ={_id: new ObjectId(id)}
  const options = {upsert:true}
  const updatedspot = req.body
  const spot = {
    $set:{
      tourists_spot_name: updatedspot.tourists_spot_name,
      country_Name:updatedspot.country_Name,
      location:updatedspot.location,
      description:updatedspot.description,
      seasonality:updatedspot.seasonality,
      cost:updatedspot.cost,
      travel_time:updatedspot.travel_time,
      visitors:updatedspot.visitors,
      photo:updatedspot.photo
    }
  }
  const result = await spotCollection.updateOne(filter,spot,options)
  res.send(result)
})

// app.disable('etag')
app.delete('/tourist/:id',async(req,res)=>{
  const id = req.params.id
  const query = { _id: new ObjectId(id)} 
  const result = await spotCollection.deleteOne(query)
  res.send(result)
})
    

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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