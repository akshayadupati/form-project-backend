// Code for mongoose config in backend
// Filename - backend/index.js

// To connect with your mongoDB database
const mongoose = require("mongoose");
const { MongoClient, ObjectId } = require('mongodb');


mongoose
  .connect("mongodb://127.0.0.1:27017/google-form-database")
  .catch((error) => console.log(error));
// mongoose.connect('mongodb://localhost:27017/', {
// 	dbName: 'google-form-database',
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true
// }, err => err ? console.log(err) :
// 	console.log('Connected to yourDB-name database'));

// Schema for users of app
const FormSchema = new mongoose.Schema({
  formData: [
    {
      type: {
        type: String,
      },
      index: {
        type: Number,
      },
      answerType: {
        type: String,
      },
      selectedValue: {
        type: String,
      },
      name: {
        type: String
      },
      options: {
        type: Array,
      },
      question: {
        type: String,
      },
    },
  ],
});
const Form = mongoose.model("addNewForm", FormSchema);
Form.createIndexes();

// For backend and express
const express = require("express");
const app = express();
const cors = require("cors");
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/forms", async (req, resp) => {
  const data = await Form.find();
  console.log(data);
  resp.json(data);
});

app.post("/find", async (req, resp) => {
  const data = await Form.findOne({ _id: new ObjectId(req.body.id.id) });
  console.log(data);
  resp.json(data);
});

app.post("/submitForm", async (req, resp) => {
  let arra = {
    formData: req.body,
  };
  console.log("emtereeded", arra);
  try {
    const user = new Form(arra);
    console.log("success", user);
    let result = await user.save();
    result = result.toObject();
    if (result) {
      delete result.password;
      resp.send(req.body);
      console.log(result);
    } else {
      console.log("Form already register");
    }
  } catch (e) {
    resp.send("Something Went Wrong");
  }
});
app.listen(5000);
