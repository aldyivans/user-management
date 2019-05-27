const express = require('express');
const app = express();
var admin = require("firebase-admin");
var bodyParser = require('body-parser');
var serviceAccount = require("./user-management-6b85d-firebase-adminsdk-6tkej-b88c01cdf7");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://user-management-6b85d.firebaseio.com"
});

var db = admin.firestore();

var usersRef = db.collection('user');

app.post('/api/user',(req,res) => {
	usersRef.add({
	  username: req.body.username,
	  birthday: req.body.birthday,
	  email: req.body.email,
	  password: req.body.password
	}).then(ref => {
	  console.log('Added document with ID: ', ref.id);
	});
})

app.get('/api/users', (req, res) => {
	console.log("get")
	var userArr = []
  usersRef.get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      userArr.push(doc.data())
      res.status(200).send({
      	message: "get user success",
      	result: userArr
      })
    });
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });
});

const port = 5000;

app.listen(port, () => console.log("running on port "+port));