const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
// const path = require("path");
const bcrypt = require("bcrypt");
// const fs = require("fs");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb"); // Include ObjectId
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
// const uploadsDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// // Set up storage engine for multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

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

// Create collections
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
    const books_collection = DB.collection("books");
    const contacts_collection = DB.collection("contacts");
    const quotes_collection = DB.collection("quotes");
    const users_collection = DB.collection("users");
    const ContactsMessages_collection = DB.collection("ContactsMessages");

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const status = req.body;
      console.log(status);
      const updateData = {
        $set: {
          status: status.status,
        },
      };
      const result = await users_collection.updateOne(query, updateData);
      res.send(result);
    });

    // POST routes
    app.post("/signup", async (req, res) => {
      try {
        const { name, email, password, status } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object with the hashed password
        const newUser = {
          name,
          email,
          password: hashedPassword,
          status,
        };

        // Insert the new user into the collection
        const result = await users_collection.insertOne(newUser);

        // Send a response back to the client
        res.send(result);
      } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("An error occurred during signup.");
      }
    });

    app.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await users_collection.findOne({ email });

        if (!user) {
          return res.status(404).send("User not found");
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(401).send("Invalid credentials");
        }

        // Successful login
        res.send("Login successful");
      } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("An error occurred during login.");
      }
    });

    app.post("/videos", async (req, res) => {
      const video = req.body;
      const result = await videos_collection.insertOne(video);
      res.send(result);
    });

    app.post("/ContactsMessages", async (req, res) => {
      const video = req.body;
      const result = await ContactsMessages_collection.insertOne(video);
      res.send(result);
    });

    app.post("/blogs", async (req, res) => {
      const blogData = req.body;

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

    app.post("/programms", async (req, res) => {
      const MainData = req.body;

      try {
        const result = await programms_collection.insertOne(MainData);
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send("Error creating programmer post");
      }
    });

    app.post("/books", async (req, res) => {
      try {
        const book = req.body;

        const result = await books_collection.insertOne(book);
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ error: "An error occurred while creating the book post" });
      }
    });

    app.post("/news", async (req, res) => {
      try {
        const news = req.body;
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
    app.get("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;
        console.log(email);
        const user = await users_collection.findOne({ email: email });

        if (user) {
          res.send(user);
        } else {
          res.status(404).send({ message: "User not found" });
        }
      } catch (error) {
        res.status(500).send({ message: "Server error" });
      }
    });

    app.get("/users", async (req, res) => {
      const users = await users_collection.find().toArray();
      res.send(users);
    });

    app.get("/ContactsMessages", async (req, res) => {
      const users = await ContactsMessages_collection.find().toArray();
      res.send(users);
    });

    app.get("/videos", async (req, res) => {
      const videos = await videos_collection.find().toArray();
      res.send(videos);
    });

    app.get("/books", async (req, res) => {
      const books = await books_collection.find().toArray();
      res.send(books);
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

    // DELETE routes
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

    app.delete("/users/:id", async (req, res) => {
      const { id } = req.params;
      const result = await users_collection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 1) {
        res.status(200).send({ message: "Image deleted successfully." });
      } else {
        res.status(404).send({ message: "Image not found." });
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

    app.delete("/ContactsMessages/:id", async (req, res) => {
      const { id } = req.params;
      const result = await ContactsMessages_collection.deleteOne({
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
      const result = await news_collection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 1) {
        res.status(200).send({ message: "News deleted successfully." });
      } else {
        res.status(404).send({ message: "News not found." });
      }
    });

    app.delete("/books/:id", async (req, res) => {
      const { id } = req.params;
      const result = await books_collection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 1) {
        res.status(200).send({ message: "Book deleted successfully." });
      } else {
        res.status(404).send({ message: "Book not found." });
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
  } finally {
    // Optionally close the MongoDB connection
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
