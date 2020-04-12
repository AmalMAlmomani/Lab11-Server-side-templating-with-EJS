'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.static('./public'));

// app.get('/incoming', (req, res) => {
//     console.log('this is what we are getting', req.query);
//     res.redirect('/index.ejs')
    
// });
app.listen(PORT, () => console.log(`up and running on port ${PORT}`));


// app.get('/', (req, res) => {
//     const url = 'https://www.googleapis.com/books/v1/volumes?q=quilting';
//     superagent.get(url).then((apiResponse) => {
//       console.log(apiResponse.body.items[0]);
//     });
//     res.render('/pages/index');
//   });