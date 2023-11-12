const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;



app.use(cors());
app.use(express.json());

//============== Database configuration ==========

const uri = `mongodb+srv://${process.env.SET_USER}:${process.env.SET_PASSWORD}@cluster0.robds1t.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Database collection
    const userCollection = client.db('userTest').collection('users');

    // create post api
    app.post('/users', async(req, res)=>{
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })

    // Retrieve all data from database
   app.get('/users', async(req, res)=>{
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
   })

  // Retrieve single data from database for update
  app.get('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const user =await userCollection.findOne(query);
      res.send(user);

  })
 

   // Delete api
   app.delete('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result =await userCollection.deleteOne(query);
      res.send(result);
     
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

app.listen(port, ()=>{
    console.log(`Server is running at: http://localhost:${port}`)
})

