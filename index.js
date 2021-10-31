const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require("cors");
require('dotenv').config();

const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

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
        
        app.get("/trips/:tripId", async(req, res) => {
            const id = req.params.tripId;
            const query = { _id: ObjectId(id) };
            const singleTrip = await tripsCollection.findOne(query);
            res.send(singleTrip);
        });
        app.get("/bookedTrip/:bookingId", async(req, res) => {
            const id = req.params.bookingId;
            const query = { _id: ObjectId(id) };
            const singleBooking = await bookedTripCollection.findOne(query);
            res.send(singleBooking)
        })
        

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

        app.delete("/trips/:tripId", async(req, res) => {
            const id = req.params.tripId;
            const query = { _id: ObjectId(id) };
            const deleteTrip = await tripsCollection.deleteOne(query);
            res.send(deleteTrip)
        })
        app.delete("/bookedTrip/:bookingId", async(req, res) => {
            const id = req.params.bookingId;
            const query = { _id: ObjectId(id) };
            const deleteBooking = await bookedTripCollection.deleteOne(query);
            res.send(deleteBooking)
        })
    }
    finally{
    }
}

run().catch(console.dir);




app.get('/', (req, res) => res.send('pintrip server is working... Yay!!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));