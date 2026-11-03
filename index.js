import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb';

import multer from 'multer';
import { createRemoteJWKSet, jwtVerify } from 'jose';
const upload = multer({
  storage: multer.memoryStorage()
});

//create an instance of the Express application
const app = express();
const port = 5000;
//middleware to allow cross-origin requests
 app.use(cors());
app.use(express.json());

//middleware to parse incoming JSON requests
const verifiToken= async(req,res,next)=>{
  const authHeader=req.headers.authorization
  if(!authHeader){
     return res.status(401).send({mes:"not autheratization"})
  }
  const token=authHeader.split(" ")[1]
  console.log(token)
  if(!token){
    return res.status(401).send({mes:"not autheratization"})
  }
  const JWKS=createRemoteJWKSet(new URL(`${process.env.Client_URL}/api/auth/jwks`))
  try {
     const { payload }=await jwtVerify(token,JWKS)
      req.user = payload;
       next()
     
  } catch (error) {
    return res.status(401).send({mes:"not authorization"})
  }
 
}
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

app.post('/add-studios', verifiToken, async (req, res)=>{
  const studio = req.body;
  const result = await allStudios.insertOne(studio);
  res.send(result);
});
app.patch("/studios-update/:id",verifiToken, async (req, res) => {
  const id = req.params.id;
  const updatedStudio = req.body;

  // JWT থেকে পাওয়া authenticated user
  const userEmail = req.user.email;

  // Studio খুঁজে বের করো
  const studio = await allStudios.findOne({
    _id: new ObjectId(id),
  });

  if (!studio) {
    return res.status(404).send({
      message: "Studio not found",
    });
  }

  // Owner Email যাচাই
  if (studio.useremail !== userEmail) {
    return res.status(403).send({
      message: "You are not authorized to update this studio",
    });
  }

  // Owner হলে Update
  delete updatedStudio.useremail;

  const result = await allStudios.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedStudio }
  );

  res.send(result);
});
app.delete("/studios/:id", verifiToken, async (req, res) => {
  const id = req.params.id;
  const result = await allStudios.deleteOne({_id:new ObjectId(id)});
  res.send(result);
});
//booking api
app.post('/bookings', verifiToken, async (req, res) => {
  const booking = req.body;
    const existingBookings = await BookingCollection.find({
    studioId: booking.studioId,
    bookingDate: booking.bookingDate,
    status: { $ne: "Cancelled" }
  }).toArray();
   const isBooked = existingBookings.some((existing) => {
    return (
      new Date(booking.startDate) < new Date(existing.endDate) &&
      new Date(booking.endDate) > new Date(existing.startDate)
    );
  });
    if (isBooked) {
    return res.status(409).send({
      message: "This studio is already booked for this time."
    });}
  const result = await BookingCollection.insertOne(booking);
  res.send(result);
})
app.get("/my-bookings/:email", async (req, res) => {
  const email = req.params.email;
  const result = await BookingCollection.find({ userEmail: email }).toArray();
  res.send(result);
});
app.patch("/cancel-booking", async (req, res) => {
  const {id,status} = req.body
  
  const result = await BookingCollection.updateOne({ _id: new ObjectId(id) }, {$set:{status:status}} )
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

export default app