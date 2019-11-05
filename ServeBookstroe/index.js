var express = require("express");
var app = express();

app.set("view engine","ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.listen(3000);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// body-parser
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// moongose
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb+srv://HoangHung:278128314159hung@cluster0-odl1g.mongodb.net/BookStore?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology:true}, function(err){
    if(err){
        console.log("Mongoose connection error!!");
    }else{
        console.log("Mongoose connected successfully!");
    }
});

//multer
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if(file.mimetype=="image/bmp" ||
           file.mimetype=="image/png"||
           file.mimetype=="image/jpg" ||
           file.mimetype=="image/jpeg" ||
           file.mimetype=="image/gif" 
           ){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("BookImage");

const Category = require("./Models/Category");
const Book = require("./Models/Book");

// api
app.post("/api/cate",function(req,res){
    Category.find(function(err,items){
        if(err){
            res.json({kq:0, "err": err});
        }else{
            res.json(items);
        }
    });
});







app.get("/", function(req,res){
    res.render("home");
});

app.get("/cate", function(req,res){
    res.render("cate");
});

app.post("/cate", function(req,res){
    var newCate = new Category({
        name: req.body.txtCate,
        Books_id: []
    });
    newCate.save(function(err){
        if(err){
            console.log("Save category error!!!:"+err);
            res.json({kq:1});
        }else{
            console.log("Save successfully!!!");
            res.json({kq:1});
        }
    });
});

app.get("/book",function(req,res){
    Category.find(function(err, items){
        if(err){
            res.send("Error");
        }else{
            console.log(items);
            res.render("book",{Cates:items});
        }
    });
});

app.post("/book",function(req,res){
    //Upload Image
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          console.log("A Multer error occurred when uploading.");
          res.json({kq:0, "err": err}); 
        } else if (err) {
          console.log("An unknown error occurred when uploading." + err);
          res.json({kq:0, "err": err});
        }else{
            console.log("Upload is okay");
            console.log(req.file); // Thông tin file đã upload
           // res.json({kq:1, "file": req.file});

            // Save Book
            var book = new Book({
                name: req.body.txtName,
                image: req.file.filename,
                file: req.body.txtFile
            });

            //res.json(book);
            book.save(function(err){
                if(err){
                    res.json({
                        kq:0, "err": "Error save book"
                    });
                }else{
                    // Update Books_id
                    Category.findOneAndUpdate(
                        {_id:req.body.selectCate},
                        {$push:{Books_id:book._id}},
                        function(err){
                            if(err){
                                res.json({kq:0, "err":err});
                            }else{
                                res.json({kq:1});
                            }
                        }
                    );
                }
            });

            
        }
            
    });

   
});