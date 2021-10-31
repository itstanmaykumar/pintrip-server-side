const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require("cors");
require('dotenv').config();

const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o0zsr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("pintrip");
        const tripsCollection = database.collection("trips");
        const bookedTripCollection = database.collection("bookedTrip");

        // GET API to find multiple data.
        app.get("/trips", async(req, res) => {
            const cursor = tripsCollection.find({});
            const trips = await cursor.toArray();
            res.send(trips);
        });
        app.get("/bookedTrip", async(req, res) => {
            const cursor = bookedTripCollection.find({});
            const tripsCart = await cursor.toArray();
            res.send(tripsCart);
        });
        
        // GET API to find single data.
        app.get("/trips/:tripId", async(req, res) => {
            const id = req.params.tripId;
            const query = { _id: ObjectId(id) };
            const singleTrip = await tripsCollection.findOne(query);
            res.send(singleTrip);
        });
        

        // POST API to create single data
        app.post("/trips", async(req, res) => {
            const trip = req.body;
            const singleTrip = await tripsCollection.insertOne(trip);
            res.json(singleTrip);
        });

        app.post("/bookedTrip", async(req, res) => {
            const tripsCart = req.body;
            const tripCart = await bookedTripCollection.insertOne(tripsCart);
            res.json(tripCart);
        });

        // PUT API to update single data
        app.put("/update/:tripId", async(req, res) => {
            const id = req.params.tripId;
            const updateTrip = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: updateTrip.title,
                    cost: updateTrip.cost
                }
            }
            const updatedTrip = await tripsCollection.updateOne(filter, updateDoc, options);
            res.json(updatedTrip);

        });

        // delete api
        app.delete("/trips/:tripId", async(req, res) => {
            const id = req.params.tripId;
            const query = { _id: ObjectId(id) };
            const deleteTrip = await tripsCollection.deleteOne(query);
            res.send(deleteTrip)
        })
    }
    finally{
    }
}

run().catch(console.dir);




app.get('/', (req, res) => res.send('pintrip server is working... Yay!!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));