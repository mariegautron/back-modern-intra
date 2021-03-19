const express = require("express");
const db = require("./models");
const jwt = require("jsonwebtoken");
const checkTokenMiddleware = require("./spec/helpers/authMiddleware");
const app = express();

app.use(express.json({ type: "application/vnd.api+json" }));
app.use(express.urlencoded());
app.use(express.static("app/public"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Authorization, Content-Type, Accept"
  );
  next();
});

app.get("/api/users", checkTokenMiddleware, async (req, res) => {
  await db.User.findAll().then((result) => {
    let response = [];
    result.forEach((el) => {
      response.push({ attributes: el, type: "users" });
    });

    return res.json({
      data: response,
    });
  });
});

app.get("/api/companies", checkTokenMiddleware, async (req, res) => {
  await db.Company.findAll()
    .then((result) => {
      let response = [];
      result.forEach((el) => {
        response.push({ attributes: el, type: "companies" });
      });

      return res.json({
        data: response,
      });
    })
    .catch((e) => console.log(e.message));
});

// req.body from front is undefined so we made a fake one

fakeBody = {
  data: {
    attributes: {
      firstName: "John",
      lastName: "Doe",
      email: "john@mail.com",
      userType: "employee",
      company: 1,
      admin: false,
      clientDashboard: false,
      employeeDashboard: false,
      hourlyRate: "50",
      password: "1233",
    },
    type: "users",
  },
};

app.post("/api/users", async (req, res) => {
  if (req.body.data) {
    await db.User.create({
      firstName: req.body.data.attributes.firstName,
      lastName: req.body.data.attributes.lastName,
      email: req.body.data.attributes.email,
      userType: req.body.data.attributes.userType,
      company: req.body.data.attributes.company,
      admin: req.body.data.attributes.admin,
      password: req.body.data.attributes.password,
      clientDashboard: req.body.data.attributes.clientDashboard,
      employeeDashboard: req.body.data.attributes.employeeDashboard,
      hourlyRate: req.body.data.attributes.hourlyRate,
    })
      .then((result) => {
        return res.json({ data: { attributes: result } });
      })
      .catch((e) => console.log(e.message));
  } else {
    await db.User.create({
      firstName: fakeBody.data.attributes.firstName,
      lastName: fakeBody.data.attributes.lastName,
      email: fakeBody.data.attributes.email,
      password: fakeBody.data.attributes.password,
      userType: fakeBody.data.attributes.userType,
      company: fakeBody.data.attributes.company,
      admin: fakeBody.data.attributes.admin,
      clientDashboard: fakeBody.data.attributes.clientDashboard,
      employeeDashboard: fakeBody.data.attributes.employeeDashboard,
      hourlyRate: fakeBody.data.attributes.hourlyRate,
    })
      .then((result) => {
        return res.json({ data: { attributes: result } });
      })
      .catch((e) => console.log(e.message));
  }
});

app.post("/api/front_tokens", async (req, res) => {
  const body = req.body.data.attributes;
  if (!body.email || !body.password) {
    return res.status(400).json({
      error: new Error("Failed. Check request."),
    });
  }

  db.User.findOne({ where: { email: body.email } })
    .then((user) => {
      if (!user) {
        return res.status(403).json({
          error: new Error("User not found!"),
        });
      }

      try {
        const valid =
          body.password === user.password && body.email === user.email;
        if (!valid) {
          return res.status(403).json({
            error: new Error("Incorrect password!"),
          });
        }
        const EXPIRES_IN = 3600;
        const token = jwt.sign(
          {
            id: user.id,
          },
          "accessTokenSecret",
          { expiresIn: EXPIRES_IN }
        );

        res.setHeader("Authorization", token);
        res.status(200).json({
          data: {
            token: token,
            type: "tokens",
            id: "1",
            attributes: {
              authState: {
                expiresIn: 123456789, //Time ms
                token: token, //Token
                authState: {}, //User info...
              },
            },
          },
        });
      } catch (error) {
        res.status(500).json({
          error: error,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

module.exports = app;
