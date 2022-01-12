const express = require('express');
const app = express();
app.use(express.static('public'))
app.use(express.json({
    limit: '1mb'
}));

const Datastore = require('nedb');

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on ${port}...`));

const database = new Datastore('database.db');
database.loadDatabase();



// find highscore data in database and send to client

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }

        // create array of timestamps and sort from old to new
        const idTimeArray = [];
        for (let i = 0; i < data.length; i++) {
            idTimeArray.push(data[i].timestamp);
        }
        idTimeArray.sort(function (a, b) {
            return a - b
        });

        // new database query to find most recent entry

        database.findOne({
            timestamp: {
                $gte: idTimeArray[idTimeArray.length - 1]
            }
        }, (err, doc) => {
            if (err) {
                response.end();
                return;
            }
            response.json(doc);
        });

    });

});


// receive highscore data from client and write to database (with timestamp and actual time)

app.post('/api', (request, response) => {
    const highscores = request.body;

    const currentdate = new Date();
    const time = "Time: " + currentdate.getDay() + "/" + currentdate.getMonth() +
        "/" + currentdate.getFullYear() + " @ " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes() + ":" + currentdate.getSeconds();
    const timestamp = Date.now();

    database.insert({
        highscores,
        timestamp,
        time
    });


    // autosave database
    database.persistence.compactDatafile();
});