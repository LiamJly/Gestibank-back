const express = require('express');
const app = express();
const cors = require("cors");
const PORT = 85
app.use(express.json());


var corsOptions = {
    //origin: "http://localhost:4200"
    origin: "*"
};

app.use(cors(corsOptions));


app.listen(
    PORT,
    () => {
        console.log(`Serveur Express a l ecoute sur le port ${PORT} `);
    }
);

// connexion de notre serveur à la base mongo
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'Gestibank';

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

app.get('/agent/list', (req, res) => {
    db.collection('user').find({
        "role": "agent"
    }).toArray(function (err, docs) {
        if (err) {
            console.log(err)
            throw err
        }
        res.status(200).json(docs)
    })
})
app.post('/agent/add', async (req, res) => {
    try {
        const newAgent = req.body
        const agent = await db.collection('user').insertOne(newAgent)
        res.status(200).json(agent)
    } catch (err) {
        console.log(err)
        throw err
    }
});


//****************************** ADMIN Related routes *************************//
app.get('/admin/list', (req, res) => {
    db.collection('user').find({
        "role": "admin"
    }).toArray(function (err, docs) {
        if (err) {
            console.log(err)
            throw err
        }
        res.status(200).json(docs)
    })
})


//****************************** CLIENT Related routes *************************//
app.get('/client/list', (req, res) => {
    db.collection('user').find({
        "role": "client"
    }).toArray(function (err, docs) {
        if (err) {
            console.log(err)
            throw err
        }
        res.status(200).json(docs)
    })
})

app.get('/client/list/attente', (req, res) => {
    db.collection('user').find({
        "role": "client", "status":"en attente"
    }).toArray(function (err, docs) {
        if (err) {
            console.log(err)
            throw err
        }
        res.status(200).json(docs)
    })
})

app.get('/client/list/valide', (req, res) => {
    db.collection('user').find({
        "role": "client", "status":"valide"
    }).toArray(function (err, docs) {
        if (err) {
            console.log(err)
            throw err
        }
        res.status(200).json(docs)
    })
})

app.post('/client/add', async (req, res) => {
    try {
        const newClient = req.body
        const user = await db.collection('user').insertOne(newClient)
        res.status(200).json(user)
    } catch (err) {
        console.log(err)
        throw err
    }
});