import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { MongoClient } from 'mongodb';

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
const allStudios = db.collection("all-studios");
//connect to MongoDB


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/all-studios', async (req,res) => {
  const studios = await allStudios.find().toArray();
  res.json(studios);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});