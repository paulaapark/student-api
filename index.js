const express = require('express');
const app = express();
const config = require('./config');
const Student = require('./models/Student');
var count = 0;

const myLogger = function(req, res, next){
    count++;
    if(next);
    res.on('finish', () => {
        console.log(`HTTP Method: ${req.method}, Request #: ${count}`);
    });
    
    next();
};

app.use(express.urlencoded({extended: false}));

app.use(myLogger);


config.authenticate()
.then(function(){
    console.log('Database is connected');
})
.catch(function(err){
    console.log(err);
});


app.post('/', function(req, res){
    Student.create(req.body)
    .then(function(result){
        res.send(result);
    })
    .catch(function(err){
        res.send(err);
    });
});


app.get('/', function(req, res){
    let data = {
        where: {}
    };

    if(req.query.id !== undefined){
        data.where.id = req.query.id;
    }; 

    if(req.query.section !== undefined){
        data.where.section = req.query.section;
    }

    if(req.query.nationality !== undefined){
        data.where.nationality = req.query.nationality;
    }

    Student.findAll(data)
    .then(function(results){
        res.status(200).send(results);
    })
    .catch(function(err){
        res.status(500).send(err);
    });
});





app.patch('/:id', function(req, res){
    let id = parseInt(req.params.id);

    Student.findByPk(id)
    .then(function(result){
        if(result){
            result.name = req.body.name;
            result.section = req.body.section;
            result.gpa = req.body.gpa;
            result.nationality = req.body.nationality; 
            result.save().then(function(){
                res.status(200).send(result);
            })
            .catch(function(err){
                res.send(err);
            });

        }else{
            res.status(404).send('student record was not found');
        }
    })
    .catch(function(err){
        res.send(err);
    });
});


app.delete('/:id', function(req, res){
    let id = parseInt(req.params.id);

    Student.findByPk(id)
    .then(function(result){
        if(result){
            result.destroy().then(function(){
                res.status(200).send(result);
            }).catch(function(err){
                res.status(500).send(err);
            });
        }
        else{
            res.status(404).send('student record was not found');
        }
    })
    .catch(function(err){
        res.send(err);
    });
});



app.listen(3000, function(){
    console.log('Server is running on port 3000...');
});