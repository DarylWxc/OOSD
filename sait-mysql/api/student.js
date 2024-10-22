const Student = require("./models/student");

const getStudent = app.get("/edit/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json("......");
});

const editStudent = app.get("/edit/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json("......");
});

const delStudent = app.get("/edit/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json("......");
});
