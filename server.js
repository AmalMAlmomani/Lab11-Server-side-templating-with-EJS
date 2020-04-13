'use strict';
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
// const request = require('request');
// const pg = require('pg');
const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set('view engine', 'ejs');



// app.get('/', (req, res) => {
//     res.render('pages/index');
//   });

// app.get('/hello', (req, res) => {
//     res.render('pages/index');
// });


app.get('/', (req, res) => {
    res.render('./pages/index')
  });
  app.get('/searches/new', (req, res) => {
    res.render('./pages/searches/new');
  })
//   app.get('/', (req, res) => {
//     res.render('./pages/searches/new');
//   })

app.post('/searches',(req,res) =>{
    const enterBook = req.body.enter;
    console.log(enterBook);
    
    const radioType = req.body.radioType;
    let url; 
    if( radioType === 'title'){
        url = `https://www.googleapis.com/books/v1/volumes?q=${enterBook}`;
    }else if( radioType === 'author'){
        url = `https://www.googleapis.com/books/v1/volumes?q=${enterBook}`;
    }
    superagent.get(url)
    .then(bookData =>{
        const bookSummaries = bookData.body.items.map( bookVal =>{
            return new Book(bookVal);
        })
        res.render('./pages/searches/show',{search:bookSummaries});
    })
    .catch(err => { errorHandler(err,req,res);
    });


})


function Book(books){
    this.title = books.volumeInfo.title;
    this.author = books.volumeInfo.authors[0];
    this.img = books.volumeInfo.imageLinks.smallThumbnail;
    this.description = books.volumeInfo.description;
}

function errorHandler (err,req,res){
    res.status(500).send(err);
  }
  

app.use('*', (request, response) => {
    response.status(404).send('Page not found');
});

app.listen(PORT, () => console.log(`up and running on port ${PORT}`));