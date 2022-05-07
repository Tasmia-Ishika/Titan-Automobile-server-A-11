const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster01.2sz1r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db('TitanAutomobiles').collection('product');
        const updatedCollection = client.db('TitanAutomobiles').collection('order');
        // Get all Api
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        // Route to Inventory and details
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        })
        // POST api Insert
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product)
            res.send(result)
        })
        // PUT api increase decrease
        app.put('/quantity/:id', async (req, res) => {
            const id = req.params.id;
            const quantity = req.body.newQuantity;
            const sold = req.body.newSold;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity, sold 
                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });


        // DELETE API 
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

        // my list api
        app.post('/myItem', async (req, res) => {
            const order = req.body;
            const result = await updatedCollection.insertOne(order);
            res.send(result);
        })





    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Titan Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})

