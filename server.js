'use strict';

require('dotenv').config();
const express = require('express');
const pg = require('pg');
const app = express();
const PORT = process.env.PORT || 4000;
const superagent = require('superagent');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

//view engine
app.set('view engine', 'ejs');
//api's

//Route
app.get('/', getBooks);
app.get('/books/:book_id', getOneBook);
app.get('/add', getForm);
app.post('/add', addBook);
app.get('/searches/new', formRender);
app.post('/searches', formNew );
app.use('*', notFoundHandler);



function getBooks(req, res) {
    const SQL = 'SELECT * FROM books;';
    client.query(SQL).then(results => {
        console.log(results);
            res.render('./pages/index', { books: results.rows });
        })
        .catch((err) => {
            errorHandler(err, req, res);
        });

}
function getOneBook(req, res) {
    const SQL = 'SELECT * FROM books WHERE id=$1;';
    const values = [req.params.book_id];
    client.query(SQL, values).then(results => {
            res.render('./pages/books/detail', { book: results.rows[0] });
        })
        .catch((err) => {
            errorHandler(err, req, res);
        });
}
function  getForm(req,res){
    res.render('./pages/books/show');
}
function addBook(req,res){
    const {image_url, title, author, description, isbn, bookshelf} = req.body;
    const SQL = 'INSERT INTO books (image_url, title, author, description,isbn,bookshelf) VALUES($1, $2, $3 , $4, $5, $6 );'
    const values = [image_url, title, author, description, isbn, bookshelf];
    client.query(SQL,values).then(result =>{
       res.redirect('/');  
    }) .catch(err => {
        errorHandler(err, req, res);
    });
   
}

function formRender(req, res) {
    res.render('./pages/searches/new');
}

function formNew(req, res){
    const enterBook = req.body.enter;
    const radioType = req.body.radioType;
    let url = `https://www.googleapis.com/books/v1/volumes?q=${enterBook}&in${radioType}=${enterBook}`;
    superagent.get(url)
        .then(bookData => {
            const bookSummaries = bookData.body.items.map(bookVal => {
                return new Book(bookVal);
            })
            res.render('./pages/searches/show', { search: bookSummaries });
        })
        .catch(err => {
            errorHandler(err, req, res);
        });


}


function Book(books) {
    this.title = books.volumeInfo.title ? books.volumeInfo.title : "Defult Title";
    this.author = books.volumeInfo.authors[0] ? books.volumeInfo.authors[0] : "Unknown Authors";
    this.image_url = books.volumeInfo.imageLinks.smallThumbnail ? books.volumeInfo.imageLinks.smallThumbnail : "No Image Found";
    this.isbn = books.volumeInfo.industryIdentifiers ? books.volumeInfo.industryIdentifiers[0].identifier : "No ISBN Found";
    this.description = books.volumeInfo.description ? books.volumeInfo.description : "No Description Found";
}



function notFoundHandler(req, res) {
    res.status(404).send('PAGE NOT FOUND');
}
function errorHandler(err, req, res) {
    res.status(500).render('pages/error', { error: err });
}
client.connect().then(() => {
    app.listen(PORT, () => console.log('up on', PORT));
});