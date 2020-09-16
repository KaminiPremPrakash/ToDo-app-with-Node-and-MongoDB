
var bodyParser = require('body-parser');

var mongoose = require('mongoose')

//connect to DB
mongoose.connect('mongodb+srv://test:test@mycluster.so20k.mongodb.net/<dbname>?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

//create schema- blueprint for our data
var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);



var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {

    app.get('/todo', function (req, res) {
        //we are passing data in todos object to the view
        //get data from mongo db and pass it to the view
        Todo.find({}, function (err, data) {
            if (err) throw err;
            res.render('todo', { todos: data });
        });

    });

    app.post('/todo', urlencodedParser, function (req, res) {
        //get data from view and add it to mongodb
        Todo(req.body).save(function (err, data) {
            if (err) throw err;
            res.json(data);
        })

    });

    app.delete('/todo/:item', function (req, res) {
        //delete requested item from mongoDB
        Todo.find({ item: req.params.item.replace(/\-/g, " ") }).remove(function (err, data) {
            if (err) throw err;
            res.json(data);
        })
    });
}