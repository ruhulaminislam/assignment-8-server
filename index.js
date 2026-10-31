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

app.post('/add-studios', async (req, res)=>{
  const studio = req.body;
  const result = await allStudios.insertOne(studio);
  res.json(result);
});

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