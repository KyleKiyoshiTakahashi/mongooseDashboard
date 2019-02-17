var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var flash = require('express-flash');
var session = require('express-session');

app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
app.use(session({
    secret: 'hasdflkjasfdpiuhwlkj',
    resave: false,
    saveUninitialized: true,
  }))
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/mongoose_DB');
mongoose.Promise = global.Promise;

var MongooseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        
    },
    food: { 
        type: String, 
        required: [true, 'Food is required'],
        
    },
    
},{timestamps: true});

mongoose.model('Animal', MongooseSchema); 
var Animal = mongoose.model('Animal')


app.get('/', function (req, res) {
    Animal.find({}, function(err, animals){
        res.render('index', {animals: animals})
    })
})

app.get('/mongooses/new', function(req, res){
	res.render('add')
})

app.get('/mongooses/:id', function(req, res){
	Animal.findOne({_id: req.params.id}, function(err, result){
		res.render('displayOne', {oneAnimal: result});
	
	})
})



app.post('/mongooses', function(req, res){
	var animal_inst = new Animal({ name: req.body.name, food: req.body.food});
    animal_inst.save(function (err) {
        if (err) {
            console.log("We have an error!", err);
            for (var key in err.errors) {
                req.flash('registration', err.errors[key].message);
            }
            res.redirect('/mongooses/new');
        } else {
            console.log("POST DATA", req.body);
            console.log('successfully added an animal!');
            res.redirect('/');   
        }
    });
})

app.get('/mongooses/edit/:id', function(req, res){
	Animal.findOne({_id: req.params.id}, function(err, results){
		res.render('edit', {oneAnimal: results});
	})
})

app.post('/mongooses/:id', function(req, res){
	Animal.findOneAndUpdate({_id: req.params.id}, {$set: {name: req.body.name, food: req.body.food}}, function(err, result){
		res.redirect("/")
	})
})

app.post('/mongooses/destroy/:id', function(req, res){
	Animal.remove({_id: req.params.id}, function(err, result){
			res.redirect('/')
	})
	
	
})


app.listen(8000, function() {
    console.log("listening on port 8000");
})