const express = require("express");
const db = require("./utils/database");
const path = require("path");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname, "asset")));
app.use(express.urlencoded({ extended: true }));

const port = 8000;

// Connect to Database
db.connect((err) => {
  if (err) throw err;
  console.log("Connection to db successful");
});

//add new student
app.get("/add", (req, res) => {
  res.render("add-student");
});

//request add new Student
app.post("/add", (req, res) => {
  // console.log(req.body);
  const { firstname, lastname, email, age } = req.body;
  const sql =
    "INSERT INTO student (firstname, lastname, email, age) VALUES (?,?,?,?);";
  db.query(sql, [firstname, lastname, email, age], (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// show Home Page(Student List)
app.get("/", (req, res) => {
  const sql = "select * from student";

  db.query(sql, (err, result, field) => {
    if (err) throw err;
    // console.log(res);
    res.render("index", { students: result });
    // console.log(field);
  });
});

// Grade List
app.get("/grade", (req, res) => {
  const sql =
    "select course.courseName, student.firstname, student.lastname, grade.GradeId, grade.CourseId, grade.StudentId, grade.Score from grade" +
    " inner join student on grade.StudentId = student.id" +
    " inner join course on grade.CourseId = course.id" ;
  // " where grade.StudentId = ?";
  db.query(sql, (err, result, field) => {
    if (err) throw err;
    // console.log(result);
    res.render("student-grade", { grade: result });
    // console.log(field);
  });
});

// add new Grade
app.get("/add-grade", (req, res) => {
  const sql = "select * from student";
  db.query(sql, (err, result, field) => {
    if (err) throw err;
    // console.log(res);
    res.render("add-grade", { students: result });
    // console.log(field);
  });
});

// request Add new Grade
app.post("/add-grade", (req, res) => {
  const { StudentId, CourseId, Score } = req.body;
  // console.log(req.body);
  const sql = "INSERT INTO grade (StudentId, CourseId, Score) VALUES (?,?,?);";
  db.query(sql, [StudentId, CourseId, Score], (err, result) => {
    if (err) throw err;
    res.redirect("/grade");
  });
});

// edit Student
app.get("/edit/:id", (req, res) => {
  //   console.log(req.params);
  const sql = "select * from student where id=?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    // console.log(result);
    res.render("edit-student", { student: result[0] });
  });
});

// edit Grade
app.get("/edit-grade/:id", (req, res) => {
  //   console.log(req.params);
  const sqlStudent = "select * from student";
  const sqlGrade = "select * from grade where GradeId=?";
  db.query(sqlGrade, [req.params.id], (err, result) => {
    if (err) throw err;
    db.query(sqlStudent, (error, studentRes) => {
      // console.log(result);
      // console.log(studentRes);
      res.render("edit-grade", { grade: result[0], students: studentRes });
    });
    // console.log(result);
  });
});

// Request edit Student
app.post("/edit/:id", (req, res) => {
  //   console.log(req.body);
  const { firstname, lastname, email, age } = req.body;
  const sql =
    "UPDATE student" +
    " SET firstname=?, lastname=?, email=?, age=?" +
    " where id=?";
  db.query(
    sql,
    [firstname, lastname, email, age, req.params.id],
    (err, result) => {
      if (err) throw err;
      console.log("student updated");
      res.redirect("/");
    }
  );
});

//Request edit Grade
app.post("/edit-grade/:id", (req, res) => {
  //   console.log(req.body);
  const { CourseId, StudentId, Score } = req.body;
  const sql =
    "UPDATE grade" +
    " SET CourseId=?, StudentId=?, Score=?" +
    " where GradeId=?";
  db.query(sql, [CourseId, StudentId, Score, req.params.id], (err, result) => {
    if (err) throw err;
    console.log("Grade Updated");
    res.redirect("/grade");
  });
});

// Delete Student
app.get("/delete/:id", (req, res) => {
  // DELETE FROM `sait-db`.`student` WHERE (`id` = '5');
  const sql = "DELETE FROM student WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    // console.log(result);
    res.redirect("/");
  });
});

// Delete Grade
app.get("/delete-grade/:id", (req, res) => {
  // DELETE FROM `sait-db`.`student` WHERE (`id` = '5');
  const sql = "DELETE FROM grade WHERE GradeId = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    // console.log(result);
    res.redirect("/grade");
  });
});

// listen to port
app.listen(port, () => {
  console.log("server is running in port 8000");
});
