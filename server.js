const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(
  "mongodb+srv://danbrs1993:Naruto8431@cluster0.k6qjqgv.mongodb.net/Courses/listOfCourses",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;

const courseSchema = new mongoose.Schema({
  name: { type: String, maxlength: 15 },
  students: { type: Number, max: 20 },
  year: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
});

const Course = mongoose.model("Course", courseSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.get("/addnewcourse", (req, res) => {
  res.sendFile(__dirname + "/public/addCourse.html");
});

app.post("/add", (req, res) => {
  const { name, students, year } = req.body;

  Course.findOne({ name: name }, (err, foundCourse) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error checking course existence");
    } else {
      if (foundCourse) {
        res.status(400).send("Course already exists");
      } else {
        const newCourse = new Course({
          name: name,
          students: students,
          year: year,
        });

        newCourse.save((err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error adding new course");
          } else {
            res.send("New course added successfully");
          }
        });
      }
    }
  });
});

app.get("/all", (req, res) => {
  Course.find({}, (err, courses) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving courses");
    } else {
      courses.sort((a, b) => a.name.localeCompare(b.name));
      res.json(courses);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
