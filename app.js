//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin:Askme%4012345@cluster0.b3ub8ba.mongodb.net/todolistDB");

const todolistSchema = {
  name: String,
};

mongoose.set("strictQuery", true);
const Cat = mongoose.model("item", todolistSchema);

const newItem  = new Cat({name : "Rabindra"})
const newItem1  = new Cat({name : "Sakshi"})
const newItem2  = new Cat({name : "Subhi"})

const defaultItems = [newItem,newItem1,newItem2];

// Cat.insertMany(defaultItems,function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("data Inserted");
//   }
// })

app.get("/", function (req, res) {
  Cat.find({}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      // result.forEach(item => {
      // console.log(item);
      // arr.push(item.name);
      // console.log(result);
      res.render("list", { listTitle: "Today", newListItems: result });

      // });
    }
  });
});

app.post("/", function (req, res) {

  const item = req.body.newItem;
  const list  = req.body.list;
  const Insitem = new Cat({ name: item });

  if(list === "Today"){
    Insitem.save();
    res.redirect("/");
  }else{
    listModel.findOne({name : list},function(err,result){
        if(err){
          console.log(err);
        }
        else{
          result.lists.push(item);
          result.save();
          res.redirect("/"+list);
        }
    })
  }


  // Cat.insertOne(Insitem,function(err){
  // if(err){
  //   console.log(err);
  // }else{
  //   console.log("data Inserted");
  // }
  // })
});

app.post("/delete", function (req, res) {
  var id = req.body.checkbox;

  Cat.findByIdAndRemove(id, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("deleted");
    }
  });

  res.redirect("/");
});

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });

const listSchema = ({
   name : String,
   lists : [todolistSchema]
});

const listModel = mongoose.model("list", listSchema);

app.get("/:params", function (req, res) {
  const title = req.params.params;

  listModel.findOne({name : title},function(err,result){
    if(err){
      console.log(err);
    }else{
      if(!result){
        const list = new listModel({
          name : title,
          lists : defaultItems
        })

        list.save();
        res.redirect("/"+title);
      }
      else{
        console.log("Exists");
          res.render("list", { listTitle: title, newListItems: result.lists });
      }
    }
  })

});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
