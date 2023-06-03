const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

var history = require('connect-history-api-fallback');

const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: 'https://todo-xkoh.onrender.com'}));
app.use(history());

const lists = require('./routes/api/lists');
const tasks = require('./routes/api/tasks');

app.use('/api/lists', lists);
app.use('/api/tasks', tasks);

app.get(/.*/, (req, res) => {
    res.setHeader("Access-Control-Allow-Creditials", "true");
    res.send("API is running...")
});


//Handle production
if(process.env.NODE_ENV === 'production'){
    //Static folder
    app.use(express.static(__dirname + '/dist/'));

    //Handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + 'dist/index.html'));
}

const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server started on port ${port}`) );
