const express = require("express");
const app = express();
const cors = require("cors");
var nodemailer = require("nodemailer");
const PORT = 85;
app.use(express.json());

var nodemailer = require("nodemailer");

var corsOptions = {
  //origin: "http://localhost:4200"
  //origin: "*",
  "Access-Control-Allow-Origin": "http://192.168.1.17:8100/*",
  "Access-Control-Allow-Methods": "*",
};

app.use(cors(corsOptions));

app.listen(PORT, () => {
  console.log(`Serveur Express a l ecoute sur le port ${PORT} `);
});

// connexion de notre serveur à la base mongo
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const dbName = "Gestibank";

let db;

MongoClient.connect(url, function (err, client) {
  console.log("Connexion réussi avec Mongo");
  db = client.db(dbName);
});

/*
app.get('/users', (req, res) => {
    db.collection('user').find({}).toArray(function (err, docs) {
        if (err) {
            console.log(err)
            throw err
        }
        res.status(200).json(docs)
    })
});

app.get('/users/:id', async (req, res) => {
    const login = req.params.id;
    try {
        const docs = await db.collection('user').findOne({
            login
        })
        res.status(200).json(docs)
    } catch (err) {
        console.log(err)
        throw err
    }
});

app.post('/users', async (req, res) => {
    try {
        const userData = req.body
        const user = await db.collection('user').insertOne(userData)
        res.status(200).json(user)
    } catch (err) {
        console.log(err)
        throw err
    }
});
app.put('/users/:id', async (req, res) => {
    try {
        const login = req.params.id;
        const replacementUser = req.body;
        const user = await db.collection('user').replaceOne({
            login
        }, replacementUser)
        res.status(200).json(user);
    } catch (err) {
        console.log(err)
        throw err
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const login = req.params.id
        const user = await db.collection('user').deleteOne({
            login
        })
        res.status(200).json(user)
    } catch (err) {
        console.log(err)
        throw err
    }
}); */

//****************************** AGENT Related routes *************************//

app.get("/agent/list", (req, res) => {
  db.collection("user")
    .find({
      role: "agent",
    })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});
app.get("/agent/list/attente", (req, res) => {
  db.collection("user")
    .find({
      role: "agent",
      status: "en attente",
    })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.post("/agent/add", async (req, res) => {
  try {
    const newAgent = req.body;
    const agent = await db.collection("user").insertOne(newAgent);
    res.status(200).json(agent);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

app.delete("/agent/:matricule", async (req, res) => {
  try {
    const matricule = req.params.matricule;
    const user = await db.collection("user").deleteOne({ matricule });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

app.get("/:agent/clients", (req, res) => {
  const agent = req.params.agent;
  db.collection("user")
    .find({
      role: "client",
      status: "en attente",
      agent: agent,
    })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.get("/:agent/clientsValide", (req, res) => {
  const agent = req.params.agent;
  db.collection("user")
    .find({
      role: "client",
      status: "valide",
      agent: agent,
    })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

//****************************** ADMIN Related routes *************************//
app.get("/admin/list", (req, res) => {
  db.collection("user")
    .find({
      role: "admin",
    })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.get("/admin/:email", (req, res) => {
  const email = req.params.email;
  db.collection("user")
    .find({
      role: "admin",
      email,
    })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

//****************************** CLIENT Related routes *************************//
app.get("/client/list", (req, res) => {
  db.collection("user")
    .find({
      role: "client",
    })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.get("/client/noAgent", (req, res) => {
  db.collection("user")
    .find({
      role: "client",
      status: "en attente",
      agent: { $exists: false },
    })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.get("/client/list/attente", (req, res) => {
  db.collection("user")
    .find({
      role: "client",
      status: "en attente",
    })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.get("/client/list/valide", (req, res) => {
  db.collection("user")
    .find({
      role: "client",
      status: "valide",
    })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.post("/client/add", async (req, res) => {
  try {
    const newClient = req.body;
    const user = await db.collection("user").insertOne(newClient);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

app.put("/forClient/:emailClient", async (req, res) => {
  try {
    const login = req.params.emailClient;
    const replacementUser = req.body;
    const user = await db.collection("user").update(
      {
        email: login,
      },
      {
        $set: replacementUser,
      }
    );
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    throw err;
  }
});
app.get("/client/list/attente/:email", (req, res) => {
  const email = req.params.email;
  db.collection("user")
    .find({
      role: "client",
      status: "en attente",
      email,
    })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.get("/client/:email", (req, res) => {
  db.collection("user")
    .find({
      email: req.params.email,
    })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

app.get("/newClient/:email/:mdp", (req, res) => {
  console.log("envoie mail!!");
  db.collection("user")
    .find({
      email: req.params.email,
      mdp: req.params.mdp,
    })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      var email = req.params.email;
      var mdp = req.params.mdp;
      var mailOptions = {
        from: "gestibank2021@gmail.com",
        to: email,
        subject: "Validation de création de compte GestiBank",
        text:
          "Félicitations votre compte a été créer avec succès Login : " +
          email +
          " Votre mot de passe :" +
          mdp,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      res.status(200).json(docs);
    });
});

app.put("/client/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const replacement = req.body;
    const user = await db.collection("user").updateOne(
      {
        email: email,
      },
      { $set: replacement }
    );
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    throw err;
  }
});

//****************************** USER Related routes *************************//
app.get("/user/:email", (req, res) => {
  const email = req.params.email;
  db.collection("user")
    .find({
      email,
    })
    .toArray(function (err, docs) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.status(200).json(docs);
    });
});

//*********************************************************************************** */

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gestibank2021@gmail.com",
    pass: "gkmars2021",
  },
});

//var mailClient = "sundabedelo@gmail.com";
//var password = "abc123";
/*var mailOptions = {
  from: "gestibank2021@gmail.com",
  to: mailClient,
  subject: "Validation de création de compte GestiBank",
  text:
    "Félicitations votre compte a été créer avec succès Login : " +
    mailClient +
    " Votre mot de passe :" +
    password,
};*/

/*
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
*/

//*********************************************************************************** */
