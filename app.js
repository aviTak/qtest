var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

const mongoose = require("mongoose");
const Meeting = require("./models/meeting");
/*
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
*/

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://test:test@cluster0.k0y8n.mongodb.net/test?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (error) {
        console.log("Something went wrong with the database :(");
        return;
    }
    console.log("Yahoooo! Connected to the database.");
};

connectDB();


app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json());



// Schedule a meeting

app.post('/meeting', async (req, res) => {

    let val = {
        date: req.body.date,
        startTime: Number(req.body.startTime),
        endTime: Number(req.body.endTime)
    };

    // Check if meeting slot is available

    // Find meetings on that day
    let present = await Meeting.findOne({
        date: val.date,
        $or: [
            { endTime: { $gt: val.startTime } },
            { startTime: { $lt: val.endTime } }
        ]
    });

    if (present) {
        res.status(500).send({ error: true, message: "Time slot not available" });
        return;
    }

    await Meeting.create(val);
    res.status(201).send(val);

});


// Get free meeting slots in a day

app.get('/meeting', (req, res) => {

});


// Reschedule a meeting

app.put('/meeting', (req, res) => {

});


// Delete a meeting

app.delete('/meeting', async (req, res) => {
    let val = {
        date: req.body.date,
        startTime: Number(req.body.startTime),
        endTime: Number(req.body.endTime)
    };

    let present = await Meeting.findOne(val);

    if(!present) {
        res.status(500).send({ error: true, message: "Meeting not found" });
        return;
    }

    let day = Number(val.date.substr(0, val.date.indexOf('/')));
    let month = Number(val.date.substr(val.date.indexOf('/') + 1, val.date.lastIndexOf('/')));
    let year = Number(val.date.substr(val.date.lastIndexOf('/') + 1, val.date.length));

    let d = new Date();
    d.setFullYear(year, month, day);
    d.setHours(val.date.startTime);
    d.setMinutes(0);

    let p = new Date();

    if(p > d) {
        res.status(500).send({ error: true, message: "Meeting is already over" });
        return;
    }

    await Meeting.deleteOne(val);
    res.status(200).send({ success: true, message: "Meeting deleted" });
});



app.listen(3000, () => {
    console.log("SERVER IS RUNNING!");
});

