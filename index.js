import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb';

import multer from 'multer';
const upload = multer({
  storage: multer.memoryStorage()
});

//create an instance of the Express application
const app = express();
const port = 5000;
//middleware to allow cross-origin requests
 app.use(cors());
app.use(express.json());
// connect to MongoDB

const client = new MongoClient(process.env.MONGODB_URI);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!a");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const momgodbCoectiion= await connectToMongoDB()
const db = momgodbCoectiion.db("StudioSpace")
const allStudios = db.collection("studios");
const BookingCollection = db.collection("bookings");
//connect to MongoDB


app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.get('/all-studios', async (req,res) => {
  const studios = await allStudios.find().toArray();
  res.json(studios);
});

app.get('/studios/:id', async (req,res) => {

  const studio = await allStudios.findOne({ _id: new ObjectId(req.params.id) });
  res.send(studio);
});
app.get('/featured-studios', async (req, res) =>{
  const result = await allStudios.find().sort({_id:-1}).limit(6).toArray();
  res.json(result);
});
app.get('/my-listings/:email', async (req, res) =>{
  const email = req.params.email;
  const result = await allStudios.find({ useremail:email }).toArray();
  res.send(result);
});

app.post('/add-studios', async (req, res)=>{
  const studio = req.body;
  const result = await allStudios.insertOne(studio);
  res.send(result);
});
app.patch("/studios-update/:id", async (req, res) => {
  const id = req.params.id;
  const updatedStudio = req.body;
  const result = await allStudios.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedStudio }
  );
  res.send(result);
});
app.delete("/studios/:id", async (req, res) => {
  const id = req.params.id;
  const result = await allStudios.deleteOne({_id:new ObjectId(id)});
  res.send(result);
});

app.post('/bookings', async (req, res) => {
  const booking = req.body;
  const result = await BookingCollection.insertOne(booking);
  res.send(result);
})


app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    const image = req.file.buffer.toString('base64');

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: 'POST',
        body: new URLSearchParams({ image })
      }
    );

    const data = await response.json();

    res.send({ imageUrl: data.data.url });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});