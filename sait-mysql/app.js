const express = require("express");
const sequelize = require("./utils/database-seq");
const User = require("./models/user");
const { body, isLength } = require("express-validator");

const app = express();
localPort = 8000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

sequelize
  .sync({ force: false })
  .then(() => console.log("Database connected successfully!"))
  .catch((err) => console.error("Connection Failed", err));

// Present the User List
app.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.render("userList", { users: users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// add new user
app.get("/contact", (req, res) => {
  res.render("contact");
});

// thank you page
app.get("/thankyou", (req, res) => {
  const lastname = req.query.lastname;
  const firstname = req.query.firstname;
  const email = req.query.email;
  res.render("thankyou", {
    firstname: firstname,
    lastname: lastname,
    email: email,
  });
});

//request add new User
app.post(
  "/contact",
  [
    body("firstname")
      .isLength({ min: 3 })
      .withMessage("Firstname must be at least 3 characters long"),
    body("lastname")
      .isLength({ min: 3 })
      .withMessage("Lastname must be at least 3 characters long"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("phoneNumber")
      .matches(/^\(?([2-9]{1}[0-9]{2})\)?[-.●]?[0-9]{3}[-.●]?[0-9]{4}$/)
      .withMessage("Please enter a valid Canadian phone number"),
    body("city").isEmpty().withMessage("City is required"),
    body("postalCode")
      .matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/)
      .withMessage("Please enter a valid Canadian postal code"),
    body("feedback").isEmpty().withMessage("Feedback is required"),
  ],
  async (req, res) => {
    // console.log(req.body);
    const {
      firstname,
      lastname,
      email,
      phoneNumber,
      city,
      postalCode,
      feedback,
    } = req.body;
    await User.create({
      firstname,
      lastname,
      email,
      phoneNumber,
      city,
      postalCode,
      feedback,
    });
    res.redirect(
      `/thankyou?firstname=${firstname}&lastname=${lastname}&email=${email}`
    );
  }
);

// edit User
app.get("/edit/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.render("edit-contact", { user: user });
});

// Request edit User
app.post(
  "/edit/:id",
  [
    body("firstname")
      .isLength({ min: 3 })
      .withMessage("Firstname must be at least 3 characters long"),
    body("lastname")
      .isLength({ min: 3 })
      .withMessage("Lastname must be at least 3 characters long"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("phoneNumber")
      .matches(/^\(?([2-9]{1}[0-9]{2})\)?[-.●]?[0-9]{3}[-.●]?[0-9]{4}$/)
      .withMessage("Please enter a valid Canadian phone number"),
    body("city").isEmpty().withMessage("City is required"),
    body("postalCode")
      .matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/)
      .withMessage("Please enter a valid Canadian postal code"),
    body("feedback").isEmpty().withMessage("Feedback is required"),
  ],
  async (req, res) => {
    const {
      firstname,
      lastname,
      email,
      phoneNumber,
      postalCode,
      city,
      feedback,
    } = req.body;
    await User.update(
      { firstname, lastname, email, phoneNumber, postalCode, city, feedback },
      { where: { id: req.params.id } }
    );
    res.redirect("/");
  }
);

// Delete Student
app.get("/delete/:id", async (req, res) => {
  await Student.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.redirect("/");
});

//Delete User
app.get("/deleteUser/:id", async (req, res) => {
  await User.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.redirect("/");
});

app.listen(localPort, () => {
  console.log("running on port 8000~");
});
