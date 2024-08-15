const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Dr Hifzur Rahman's website API");
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// MongoDB connection setup
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kqtkn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    const DB = client.db("DactorHifzurRahmanDataBase");
    const videos_collection = DB.collection("videos");
    const blogs_collection = DB.collection("blogs");
    const images_collection = DB.collection("images");
    const programms_collection = DB.collection("programms");
    const news_collection = DB.collection("news");
    const contacts_collection = DB.collection("contacts");
    const quotes_collection = DB.collection("quotes");

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // POST routes
    app.post("/videos", async (req, res) => {
      const video = req.body;
      const result = await videos_collection.insertOne(video);
      res.send(result);
    });

    app.post("/blogs", upload.single("image"), async (req, res) => {
      const { title, description } = req.body;
      const image = req.file ? req.file.path : null;
      const currentDateTime = new Date().toLocaleString();

      const blogData = {
        title,
        description,
        image,
        date: currentDateTime,
      };

      try {
        const result = await blogs_collection.insertOne(blogData);
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send("Error creating blog post");
      }
    });

    app.post("/images", async (req, res) => {
      const image = req.body;
      const result = await images_collection.insertOne(image);
      res.send(result);
    });

    app.post("/programms", upload.single("image"), async (req, res) => {
      const { title, description, programSpace, date, startTime, endTime } =
        req.body;
      const image = req.file ? req.file.path : null;

      const MainData = {
        title,
        description,
        programSpace,
        date,
        startTime,
        endTime,
        image,
      };

      try {
        const result = await programms_collection.insertOne(MainData);
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send("Error creating programmer post");
      }
    });

    app.post("/news", upload.single("image"), async (req, res) => {
      try {
        const news = {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          publicationDate: req.body.publicationDate,
          tags: req.body.tags,
          imagePath: req.file ? req.file.path : null, // Save file path if needed
          date: req.body.date,
        };
        const result = await news_collection.insertOne(news);
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ error: "An error occurred while creating the news post" });
      }
    });

    app.post("/contacts", async (req, res) => {
      const contact = req.body;
      const result = await contacts_collection.insertOne(contact);
      res.send(result);
    });

    app.post("/quotes", async (req, res) => {
      const quotes = req.body;
      const result = await quotes_collection.insertOne(quotes);
      res.send(result);
    });

    // GET routes
    app.get("/videos", async (req, res) => {
      const videos = await videos_collection.find().toArray();
      res.send(videos);
    });

    app.get("/blogs", async (req, res) => {
      const blogs = await blogs_collection.find().toArray();
      res.send(blogs);
    });

    app.get("/images", async (req, res) => {
      const images = await images_collection.find().toArray();
      res.send(images);
    });

    app.get("/programms", async (req, res) => {
      const programms = await programms_collection.find().toArray();
      res.send(programms);
    });

    app.get("/news", async (req, res) => {
      const news = await news_collection.find().toArray();
      res.send(news);
    });

    app.get("/quotes", async (req, res) => {
      const quotes = await quotes_collection.find().toArray();
      res.send(quotes);
    });

    app.get("/contacts", async (req, res) => {
      const contacts = await contacts_collection.find().toArray();
      res.send(contacts);
    });

    //delete data
    app.delete("/videos/:id", async (req, res) => {
      const { id } = req.params;
      const result = await videos_collection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 1) {
        res.status(200).send({ message: "Video deleted successfully." });
      } else {
        res.status(404).send({ message: "Video not found." });
      }
    });

    app.delete("/blogs/:id", async (req, res) => {
      const { id } = req.params;
      const result = await blogs_collection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 1) {
        res.status(200).send({ message: "Blog deleted successfully." });
      } else {
        res.status(404).send({ message: "Blog not found." });
      }
    });

    app.delete("/images/:id", async (req, res) => {
      const { id } = req.params;
      const result = await images_collection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 1) {
        res.status(200).send({ message: "Image deleted successfully." });
      } else {
        res.status(404).send({ message: "Image not found." });
      }
    });

    app.delete("/programms/:id", async (req, res) => {
      const { id } = req.params;
      const result = await programms_collection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 1) {
        res.status(200).send({ message: "Program deleted successfully." });
      } else {
        res.status(404).send({ message: "Program not found." });
      }
    });

    app.delete("/news/:id", async (req, res) => {
      const { id } = req.params;
      const result = await news_collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 1) {
        res.status(200).send({ message: "News deleted successfully." });
      } else {
        res.status(404).send({ message: "News not found." });
      }
    });

    app.delete("/quotes/:id", async (req, res) => {
      const { id } = req.params;
      const result = await quotes_collection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 1) {
        res.status(200).send({ message: "Quote deleted successfully." });
      } else {
        res.status(404).send({ message: "Quote not found." });
      }
    });

    app.delete("/contacts/:id", async (req, res) => {
      const { id } = req.params;
      const result = await contacts_collection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 1) {
        res.status(200).send({ message: "Contact deleted successfully." });
      } else {
        res.status(404).send({ message: "Contact not found." });
      }
    });
  } finally {
    // No closing connection here as it would close the connection after the first request
  }
}

run().catch(console.dir);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
