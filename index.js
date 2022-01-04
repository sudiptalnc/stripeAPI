const express = require('express');
const cors = require ('cors');
require('dotenv').config({ path : './.env'});
const fs = require('fs');

const createCheckoutSession = require('./api/checkout');
const webhook = require('./api/webhook');

const app = express();
const port = 8080;

app.use(function (req, res, next) {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
    );
    next();
  });

app.use(express.json({
    verify: ( req, res, buffer) => req['rawbody'] = buffer   
}));

app.use(cors({ origin : true }));

app.get('/', (req, res) => res.send('hello'));

app.post('/create-checkout-session', createCheckoutSession);

//webhook
app.post('/webhook', webhook)



//for courses CRUD

// Endpoint to Get a list of courses
app.get('/getCourses', function(req, res){
  fs.readFile(__dirname + "/courses/" + "courses.json", 'utf8', function(err, data){
      console.log(data);
      res.end(data); // you can also use res.send()
  });
})

//The addCourse endpoint

//const writeStream = fs.createWriteStream(__dirname + "/courses/" + "courses.json" )

app.post('/addCourse', function(req, res){
  //Step 2: read existing coursesrs
  fs.readFile(__dirname + "/courses/" + "courses.json", 'utf8', function(err, data){
      data = JSON.parse(data);
      const course = req.body;

      data.push(course);
      res.send(data)
      const x = JSON.stringify(data)
      fs.writeFile(__dirname + "/courses/" + "courses.json", x, function(err){
        if(err) {
          console.log(err)
        }
      })
      // if(data) {
      //   console.log('data', data)
      //   fs.createWriteStream(__dirname + "/courses/" + "courses.json", data )
      // }
      //writeStream.write(data)

      // console.log(data);
      // res.end(JSON.stringify(data));
  });
})

//Endpoint to get a single course by id
app.get('/:id', function (req, res) {
  // First retrieve existing course list
  fs.readFile( __dirname + "/courses/" + "courses.json", 'utf8', function (err, data) {
     const datas = JSON.parse( data );
     const course = datas[req.params.id.split(':')[1]] 
     res.end( JSON.stringify(course));
  });
})

 //Code to delete a course by id
 app.delete('/deleteCourse:id', function (req, res) {
    // First retrieve existing courses
    fs.readFile( __dirname + "/courses/" + "courses.json", 'utf8', function (err, data) {
       const datas = JSON.parse( data );

       const index = req.params.id.split(':')[1];
        if (index > -1) {
          datas.splice(index, 1);
        }

       //delete datas[req.params.id.split(':')[1]-1];
       const x = JSON.stringify(datas)
      fs.writeFile(__dirname + "/courses/" + "courses.json", x, function(err){
        if(err) {
          console.log(err)
        }
      }) 
       res.end( JSON.stringify(datas));
    });
 })

app.listen(port, ()=> console.log('server listening on port',port))