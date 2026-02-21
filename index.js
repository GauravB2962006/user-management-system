require("dotenv").config();
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const { count } = require("console");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");


// const port = 8080;
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta",
  password: process.env.DB_PASSWORD,
});

let getRandonUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

// let q = "insert into user (id,username,email,password) values ?";

// let data = [];
// for (let i = 0; i <= 100; i++){
//   data.push(getRandonUser());
// }

//Home Route
app.get("/", (req, res) => {
  let q = `select count(*) from user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occured");
  }
});
//------------------------------------------------------------------------------------------------------------------------------------------


//Show route

app.get("/user", (req, res) => {
  let q = `select * from user`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      // console.log(result);
      //res.send(result);
      res.render("showuser.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occured");
  }
});
//------------------------------------------------------------------------------------------------------------------------------------------


//Edit route

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occured");
  }
});

//------------------------------------------------------------------------------------------------------------------------------------------

//Update route

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPassword, username: newUser,email:newEmail} = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPassword != user.password) {
        res.send("WRONG Password");
      } else {
        let q2 = `update user set username='${newUser}', email='${newEmail}'where id='${id}'`; 
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occured");
  }
});

//------------------------------------------------------------------------------------------------------------------------------------------
//For Adding new user
app.get("/user/:id/new", (req, res) => {
    let { id } = req.params;
  res.render("new.ejs");
});

app.post("/user/:id/new", (req, res) => {
  let id = uuidv4();
  let { username, email, password } = req.body;
  let q = `insert into user (id,username,email,password) values('${id}','${username}','${email}','${password} ')`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("Added new user")
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occured");
  }

});

//------------------------------------------------------------------------------------------------------------------------------------------

app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `select * from user where id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs",{user});
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occured");
  }
});

app.delete("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `select * from user where id='${id}'`;
   try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (password != user.password) {
        res.send("WRONG Password");
      } else {
        let q2 = `delete from user where id='${id}'`; 
        connection.query(q2, (err, result) => {
          if (err) throw err;
          // console.log(result);
          console.log("user deleted");
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occured");
  }
})


app.listen("8080", () => {
  console.log("server is listening to port 8080");
});

// console.log(getRandonUser());

// try {
//   connection.query(q, [data], (err, result) => {
//     if (err) throw err;
//     console.log(result);
//   });
// } catch (err) {
//   console.log(err);
// }

// connection.end();
