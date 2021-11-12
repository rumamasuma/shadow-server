const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const cors= require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qaigm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

try{

    await client.connect();
    const database = client.db("eyeShadowPalette");
    const productCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection("users");
    const reviewsCollection = database.collection("reviews");

    // GET products API
    app.get('/products', async(req, res)=>{
        const cursor = productCollection.find({});
        const products = await cursor.toArray();
        res.send(products);
    })
    // GET Single order
app.get('/products/:id' , async(req, res)=>{
    const id = req.params.id;
    // console.log('geeting single id');
    const query = {_id : ObjectId(id)};
    const product= await productCollection.findOne(query);
    res.json(product);

})
// order get by GET API
app.get('/orders', async(req, res)=>{
   const cursor = ordersCollection.find({});
   const orders = await cursor.toArray();
   res.json(orders);
})

// get single order by email
// app.get('/orders', async(req, res) => {
//   const email = req.query.email; 
//   const query = {email: email};
//   console.log(query);
//   const cursor = ordersCollection.find(query);
//   const orderProduct = await cursor.toArray();
//   res.json(orderProduct);
// })
app.get("/orders/:email", async (req, res) => {
  console.log(req.params.email);
  const result = await ordersCollection.find({ email: req.params.email }).toArray();
  res.send(result);
});

// order send by POST API
 app.post('/orders', async(req, res) =>{
   const order = req.body;
  //  console.log(order);
  const result = await ordersCollection.insertOne(order);
  // console.log(result);
   res.json(result);
 })
}
finally{
    // await client.close();
}

}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello From Diva Eyeshadow Palette!')
})

app.listen(port, () => {
  console.log('Running Diva Eyshadow Palette Server on port' , port);
})