const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const bcrypt = require("bcrypt");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb"); // Include ObjectId
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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

    // PATCH route
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
      try {
        const result = await users_collection.updateOne(query, updateData);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error updating user");
      }
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
      try {
        const video = req.body;
        const result = await videos_collection.insertOne(video);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error creating video");
      }
    });

    app.post("/ContactsMessages", async (req, res) => {
      try {
        const message = req.body;
        const result = await ContactsMessages_collection.insertOne(message);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error creating contact message");
      }
    });

    app.post("/blogs", async (req, res) => {
      try {
        const blogData = req.body;
        const result = await blogs_collection.insertOne(blogData);
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send("Error creating blog post");
      }
    });

    app.post("/images", async (req, res) => {
      try {
        const image = req.body;
        const result = await images_collection.insertOne(image);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error creating image");
      }
    });

    app.post("/programms", async (req, res) => {
      try {
        const MainData = req.body;
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
        res.status(500).send("Error creating book post");
      }
    });

    app.post("/news", async (req, res) => {
      try {
        const news = req.body;
        const result = await news_collection.insertOne(news);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error creating news post");
      }
    });

    app.post("/contacts", async (req, res) => {
      try {
        const contact = req.body;
        const result = await contacts_collection.insertOne(contact);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error creating contact");
      }
    });

    app.post("/quotes", async (req, res) => {
      try {
        const quotes = req.body;
        const result = await quotes_collection.insertOne(quotes);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error creating quote");
      }
    });

    // GET routes
    app.get("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;
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
      try {
        const users = await users_collection.find().toArray();
        res.send(users);
      } catch (error) {
        res.status(500).send("Error fetching users");
      }
    });

    app.get("/ContactsMessages", async (req, res) => {
      try {
        const messages = await ContactsMessages_collection.find().toArray();
        res.send(messages);
      } catch (error) {
        res.status(500).send("Error fetching contact messages");
      }
    });

    app.get("/videos", async (req, res) => {
      try {
        const videos = await videos_collection.find().toArray();
        res.send(videos);
      } catch (error) {
        res.status(500).send("Error fetching videos");
      }
    });

    app.get("/books", async (req, res) => {
      try {
        const books = await books_collection.find().toArray();
        res.send(books);
      } catch (error) {
        res.status(500).send("Error fetching books");
      }
    });

    app.get("/blogs", async (req, res) => {
      try {
        const blogs = await blogs_collection.find().toArray();
        res.send(blogs);
      } catch (error) {
        res.status(500).send("Error fetching blogs");
      }
    });

    app.get("/images", async (req, res) => {
      try {
        const images = await images_collection.find().toArray();
        res.send(images);
      } catch (error) {
        res.status(500).send("Error fetching images");
      }
    });

    app.get("/programms", async (req, res) => {
      try {
        const programms = await programms_collection.find().toArray();
        res.send(programms);
      } catch (error) {
        res.status(500).send("Error fetching programs");
      }
    });

    app.get("/news", async (req, res) => {
      try {
        const news = await news_collection.find().toArray();
        res.send(news);
      } catch (error) {
        res.status(500).send("Error fetching news");
      }
    });

    app.get("/quotes", async (req, res) => {
      try {
        const quotes = await quotes_collection.find().toArray();
        res.send(quotes);
      } catch (error) {
        res.status(500).send("Error fetching quotes");
      }
    });

    app.get("/contacts", async (req, res) => {
      try {
        const contacts = await contacts_collection.find().toArray();
        res.send(contacts);
      } catch (error) {
        res.status(500).send("Error fetching contacts");
      }
    });

    // DELETE routes
    app.delete("/images/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await images_collection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error deleting image");
      }
    });

    app.delete("/blogs/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await blogs_collection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error deleting blog");
      }
    });

    app.delete("/videos/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await videos_collection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error deleting video");
      }
    });

    app.delete("/books/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await books_collection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error deleting book");
      }
    });

    app.delete("/programms/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await programms_collection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error deleting program");
      }
    });

    app.delete("/news/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await news_collection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error deleting news");
      }
    });

    app.delete("/contacts/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await contacts_collection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error deleting contact");
      }
    });

    app.delete("/quotes/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await quotes_collection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error deleting quote");
      }
    });

    // Server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

run().catch(console.dir);
