## MYSQL ##
## Acrivity 2: FAVORITE_DB-No Data ##

*  In this activity, we created 3 tables and inserted data into them.

* For the table favorite_foods...

  * Create the column "food" which can take in a 50 character string and cannot be NULL
  * Create the column "score" which can take in an integer

* For the table favorite_songs...

  * Create the column "song" which can take in a 100 character string and cannot be NULL
  * Create the column "artist" which can take in a 50 character string
  * Create the column "score" which can take in an integer

* For the table favorite_movies...

  * Create a numeric column called "id" which automatically increments and cannot be null
  * Create the column "movie" which can take in a string and cannot be NULL
  * Create the column "five_times" which can take in a boolean
  * create the column "score" which can take in an integer
  * Set the primary key of the table to id

* favoritesDB

 ```
DROP DATABASE IF EXISTS favoritesDB;
CREATE DATABASE favoritesDB;

DROP TABLE IF EXISTS favorite_foods;
CREATE TABLE favorite_foods(
   food VARCHAR(50) NOT NULL,
   score INTEGER(10)
 ); 
 
 DROP TABLE IF EXISTS favorite_songs;
 CREATE TABLE favorite_songs(
   song VARCHAR(100) NOT NULL,
   artist VARCHAR(50),
   score INTEGER(10)
  );
  
  DROP TABLE IF EXISTS favorite_movies;
  CREATE TABLE favorite_movies(
    id INTEGER(10) AUTO_INCREMENT NOT NULL,
    movie VARCHAR(50) NOT NULL,
    five_times BOOLEAN DEFAULT false,
    score INTEGER(10),
    PRIMARY KEY(id)
   );
   
   INSERT INTO favorite_foods (food,score)
   VALUES ("hummus",10);
   
   INSERT INTO favorite_foods (food,score)
   VALUES ("bagel",5);
   
   SELECT * from favorite_foods;
   
   INSERT INTO favorite_songs (song,artist,score)
   VALUES ("I know","Placebo",10);
   
   INSERT INTO favorite_songs (song,artist,score)
   VALUES ("Post Blue","Placebo",10);
   
   SELECT * from favorite_songs;
   
   INSERT INTO favorite_movies (id,movie,five_times,score)
   VALUES (1,"Pulp Fiction",true,10);
   
   INSERT INTO favorite_movies (id,movie,five_times,score)
   VALUES (2,"Patch Adams",true,9);
   
   INSERT INTO favorite_movies (id,movie,score)
   VALUES (3,"Braveheart",10);
   
   SELECT * from favorite_movies;
```
---
## Activity 4: ProgrammingDB ##

* In this activity, we made a new database called "programming_db" and switched into it.

* We created a table called "programming_languages" which includes a primary key named "id" which automatically increments with each new row created, a string column called "languages," and a numeric column called "rating."

* We inserted some data into the table and then modified the data using the id column.

* BONUS: We studied up on how to add columns to a table and then created a boolean column called "mastered" which has a default value of true

```
DROP DATABASE IF EXISTS programming_db;
CREATE DATABASE programming_db;
USE programming_db;
DROP TABLE IF EXISTS programming_languages;
CREATE TABLE programming_languages(
  id INTEGER(10) AUTO_INCREMENT NOT NULL,
  languages VARCHAR(50),
  rating INTEGER(10),
  PRIMARY KEY(id)
 );
 
INSERT INTO programming_languages (id,languages,rating)
VALUES (1,"C",8);
INSERT INTO programming_languages (id,languages,rating)
VALUES (2,"C++",9);
INSERT INTO programming_languages (id,languages,rating)
VALUES (3,"JAVA",10);

ALTER TABLE programming_languages
ADD COLUMN mastered BOOLEAN DEFAULT true AFTER rating;

select * from programming_languages;

UPDATE programming_languages
SET mastered=false
WHERE id=1;

UPDATE programming_languages
SET mastered=false
WHERE id=2;

select * from programming_languages;
		   
```
---
## Activity 8: PLAYLISTREAD ##

* In this activity, we created a database called `playlist_db`, then created a table inside of this database called `songs`. The songs table has four columns:

  1. id
  2. title
  3. artist
  4. genre

* We added some songs to this table so we have actual data to work with.

* We print playlists to the console based upon the genre or artist (inquirer package is used).

* We also created code that prints all songs within our database to the terminal.

* BONUS: We used a 'placeholder' value or string concatenation to build a MySQL query which allowsus to change pieces of the query on the fly (e.g. using a variable to build the `WHERE` clause, instead of a static string).

* playlist.sql

```
DROP DATABASE IF EXISTS playlist_db;
CREATE DATABASE playlist_db;
USE playlist_db;

CREATE TABLE songs(
	id INTEGER(11) AUTO_INCREMENT NOT NULL,
    title VARCHAR(100) NOT NULL,
    artist VARCHAR(50) NULL,
    genre VARCHAR(50) NULL,
    PRIMARY KEY (id)
 );   
 
 INSERT INTO songs (id,title,artist,genre)
 VALUES (1,"I Know","Placebo","Alternative Rock");
 
 INSERT INTO songs (id,title,artist,genre)
 VALUES (2,"Wake Up Call","Maroon 5","Pop");
 
 INSERT INTO songs (id,title,artist,genre)
 VALUES (3,"Trouble","Taylor Swift","Pop");
 ```

 * PlaylistRead.js

 ```
   var mysql = require("mysql");
var inquirer=require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "playlist_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  input();
  //genre_or_artist();
});

function input(){

    inquirer
    .prompt([
      {
         type:'list',
         name:"answer",
         message:"Please select a query below:",
         choices:["Select All Songs","List Songs of a Specific Genre","List Songs by an Artist"]
      }   
    ]).then(answer=>{
      switch(answer.answer){
        case "Select All Songs": AllSongs();break;
        case "List Songs of a Specific Genre": SongsByGenre(); break;
        case "List Songs by an Artist": SongsByArtist();break;
      }
    })

    
}
function AllSongs(){
  connection.query("SELECT * FROM songs", function(err,res){
      if (err) throw err;
      for(let i=0;i<res.length;i++){
        console.log("id:"+res[i].id+" || "+
                    "title: "+res[i].title+" || "+
                    "artist: "+res[i].artist+" || "+
                    "genre: "+res[i].genre);
      }
      connection.end();

  });
}

function SongsByGenre(){
  inquirer
  .prompt([
    {
      type:"input",
      name:"genre",
      message:"Please Enter a Genre to Sort Songs by:",
    }

  ])
  .then(genre=>{
    
       connection.query("SELECT * FROM songs WHERE genre = ?",genre.genre, function(err,res){
           if (err) throw err;
           for(let i=0;i<res.length;i++){
               console.log("id:"+res[i].id+" || "+
                  "title: "+res[i].title+" || "+
                  "artist: "+res[i].artist+" || "+
                  "genre: "+res[i].genre);
            }
             connection.end();
       });
       
   });
  }  

  function SongsByArtist(){
    inquirer
    .prompt([
      {
        type:"input",
        name:"artist",
        message:"Please Enter an Artist to Sort Songs by:",
      }
  
    ])
    .then(artist=>{
         connection.query("SELECT * FROM songs WHERE artist = ?",artist.artist, function(err,res){
             if (err) throw err;
             for(let i=0;i<res.length;i++){
                 console.log("id:"+res[i].id+" || "+
                    "title: "+res[i].title+" || "+
                    "artist: "+res[i].artist+" || "+
                    "genre: "+res[i].genre);
              }
               connection.end();
         });
         
     });
    }  

 ```
---

## Activity 9: ICECREAMCRUD:  

* In this activity, we made our ice cream application a little more functional through including all four C.R.U.D elements within it.

* We added in some pieces of code that CREATE, UPDATE, and DELETE specific pieces of data from our MySQL database. We made sure to include a READ statement at the end as well to ensure that the changes we are making are working properly.

* BONUS: After successfully adding CRUD to our application, we tested our mettle and saw if we can make it so this app is more dynamic. We added the ability for users to dynamically input their own data into the database using the Inquirer NPM package.

* iceCreamCRUD.js


```
var mysql = require("mysql");
var inquirer=require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database:"ice_creamDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  input();
});

function input(){
  inquirer
  .prompt([
    {
      type:'list',
      name:'operation',
      choices:["Create Product","Update Product", "Delete Product", "Read Products","Quit"]
    }

  ]).then(result=>{
         switch (result.operation){
           case "Create Product": createProduct();break;
           case "Update Product": updateQuantity();break;
           case "Delete Product": deleteProduct();break;
           case "Read Products":  readProducts();break;
           case "Quit": connection.end();
         }
  });

}
//Creates a new Product
function createProduct(){
  inquirer
  .prompt([
    {
      type:"input",
      name:"id",
      message:"Please Enter the ID of the Product:"
    },
    {
      type:"input",
      name:"flavor",
      message:"Please Enter the Flavor of the Ice Cream:"
    },
    {
      type:"input",
      name:"price",
      message:"Please Enter the Price of the Ice Cream:"
    },
    {
      type:"input",
      name:"quantity",
      message:"Please Enter the Quantity:"
    }
  ]).then(answer=>{
    console.log("Inserting a new product...\n");
    var query=connection.query("INSERT INTO products SET ?",
                               { id: answer.id,
                                flavor:answer.flavor,
                                price:answer.price,
                                quantity:answer.quantity},function(err,res){
                                  if (err) throw err;
                                  console.log(res.affectedRows+" product was inserted");
                                  input();
                                }) ;
    console.log(query.sql+ " runs!!");                            
  });
}

//Updates the quantity of specific flavor to restock
function updateQuantity(){
  inquirer
  .prompt([
    {
      type:"input",
      name:"flavor",
      message:"Enter the flavor of the ice cream to be restocked:"
    },
    {
      type:"input",
      name:"quantity",
      message:"Enter the quantity:"
    }

  ]).then(answer=>{
      var query=connection.query("UPDATE products SET ? WHERE ?",[{quantity: answer.quantity},{flavor:answer.flavor}],function(err,res){
                 if (err) throw err;
                 console.log(res.affectedRows+" rows are affected");
                 input();
      });
      console.log(query.sql+" runs");
  });
}

//Delete All the products of a specific flavor
function deleteProduct(){
  inquirer
  .prompt([
    {
      type:"input",
      name:"flavor",
      message:"Enter the flavor of the ice cream to be deleted:"
    }

  ]).then(answer=>{
      var query=connection.query("DELETE  FROM products WHERE ?",[{flavor:answer.flavor}],function(err,res){
                 if (err) throw err;
                 console.log(res.affectedRows+" rows are affected");
                 input();
      });
      console.log(query.sql+" runs");
  });
}

//returns all the products
function readProducts(){
   var query=connection.query("SELECT * FROM products",function(err,res){
     if (err) throw err;
     for(let i=0;i<res.length;i++){
       console.log("id: "+res[i].id+" || "+
                   "flavor: "+res[i].flavor+" || "+
                   "price: "+res[i].price+" || "+
                   "quantity: "+res[i].quantity+" || ");
     }
     input();
    
   });
   console.log(query.sql+" runs!!");
}

```
--- 
## Activity 10: GREAT_BAY

* We created a Node application called "Great-Bay" which allows users to create and bid on assorted items, tasks, jobs, or projects.

* The basic application is fairly simple: Upon loading up the program, the user is prompted on whether they would like to "POST AN ITEM" or "BID ON AN ITEM"

* If the user selects "POST AN ITEM" they are prompted for an assortment of information regarding the item and then that information is added to the database so that others can bid on it

* If the user selects "BID ON AN ITEM" they are shown a list of all available items and then are prompted to select what they would like to bid on. The console then asks them how much they would like to bid, and their bid is compared to the previous highest bid. If their bid is higher, inform the user of their success and replace the previous bid with the new one. If their bid is lower (or equal), inform the user of their failure and boot them back to the selection screen.

* auctionDB.sql

```
 DROP DATABASE IF EXISTS auctionDB;
CREATE DATABASE auctionDB;
USE auctionDB;

CREATE TABLE artifact(
	id INTEGER(11) AUTO_INCREMENT NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    item_category VARCHAR(50) NOT NULL,
    starting_bid INTEGER(11) DEFAULT 0,
    highest_bid INTEGER(11) DEFAULT 0,
    PRIMARY KEY (id)
 );   

```
* itemConnectionDB.js

```
var mysql = require("mysql");
var inquirer=require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
 // database: "ice_creamDB"
 database:"auctionDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  input();
  
});

function input(){
  inquirer
  .prompt([
    {
      type:"list",
      name:"operation",
      choices:["Post an Item", "Bid on an Item","Quit"],
      message:"Please Select one:"

    }

  ]).then(answer=>{
     switch(answer.operation){
       case "Post an Item":PostItem();break;
       case "Bid on an Item":BidItem();break;
       case "Quit":connection.end();break;
     }

  });
}
//posts an item
function PostItem(){
  inquirer
  .prompt([
    {
      type:"input",
      name:"item",
      message:"What's the item that you want to list?"

    },
    {
      type:"input",
      name:"category",
      message:"What category would you like to put the item into?"
    },
    {
      type:"input",
      name:"sbid",
      message:"What's the starting bid?",
      validate: function(value){
                if(isNaN(value)===false){
                  return true;
                }
                else{
                  return false;
                }
      }
    }

  ]).then(answer=>{
    connection.query("INSERT INTO artifact SET ?",[{item_name:answer.item,
                                                   item_category:answer.category,
                                                   starting_bid:answer.sbid,
                                                  highest_bid:answer.sbid}], function(err,res){
                                                    if (err) throw err;
                                                    console.log(res.affectedRows+" row is inserted");
                                                    input();
                                                  });

  });
}
//take bit on item
function takeBid(){
  return inquirer
         .prompt([
           {
             type:"input",
             name:"bid",
             message:"How much would you like to bid?"
           }

         ]);
}
//Bid on the selected item
function BidItem(){
  connection.query("SELECT * FROM artifact ORDER BY item_category",function(err,res){
    if(err) throw err;
    const arr1=[];
    const arr2=[];
    
    for(let i=0;i<res.length;i++){
      let obj={};
      obj.id=res[i].id;
      obj.name=res[i].item_name;
      obj.category=res[i].item_category;
      obj.highest_bid=res[i].highest_bid;

      obj.txt=obj.name+"("+obj.category+")";
      arr1.push(obj);
      arr2.push(obj.txt);
    }
    arr2.push("quit");
    inquirer
    .prompt([
      {
        type:"list",
        name:"item",
        choices:arr2,
        message:"Please Enter the Item you Want to Bid on:"
      }
    ]).then(answer=>{
        if(answer.item==="quit"){return input();}
        const index=arr2.indexOf(answer.item);
        const myBid=takeBid();
        myBid.then(mbid=>{
             const num1=parseInt(mbid.bid);
             const num2=parseInt(arr1[index].highest_bid);
             if(num1<=num2){
               console.log("You are outbid!!");
               input();
             }
             else{
              var q= connection.query("UPDATE artifact SET ? WHERE ?",[{highest_bid:num1},{id:arr1[index].id}],function(err,res){
                    console.log("You successfully placed the bid!!");
                    input();
               });
               
             }
            

        })
    })
  })
}

```

---
## Activity 11: POP QUIZ ##
## Using the `terminal` or your favorite MySQL GUI
1. Connect to MySQL server : `mysql -u root -p`
2. Create a new Database: `CREATE DATABASE monday;`
3. Create a new table with a primary key that auto-increments, and a text field
   `CREATE TABLE message(
     id INTEGER(11) AUTO_INCREMENT NOT NULL,
     msg VARCHAR(100) NOT NULL,
     PRIMARY KEY (id)
   );`
4. Insert 3 Rows into your new table:
  `INSERT INTO message SET msg="Goodbye Dear Friend!!";`
  `INSERT INTO message SET msg="We had fun two days!!";`
  `INSERT INTO message SET msg="Again came the ruthless Monday!";`

 ## Using Node / IDE of your choice
1. Create a package.json: npm init;
2. Require `mysql`
3. Connect to MySQL
4. Print the 3 rows of data to the `console`

* pop.js

```
const mysql=require("mysql");
var connection=mysql.createConnection({
    host:"localhost",
    port:3306,
    user:"root",
    password:"",
    database:"monday"

});
connection.connect((err)=>{
     if (err) throw err;
     read();
});
function read(){
    connection.query("SELECT * from message",(err,res)=>{
        if(err) throw err;

        for(let i=0;i<res.length;i++){
            console.log("id: "+res[i].id+" || "+"msg: "+res[i].msg);
        }
        connection.end();

    });
}
```

---

## Activity 12: TOP5000SCHEMA ##

* In this activity, we created database called `top_songsDB` that houses all of the music data contained within `TopSongs.csv`

* Within our database create a table called `Top5000` and created columns capable of holding all of the data contained within `TopSongs.csv` properly.

* All of our code is written and saved within a file called `schema.sql` so that we can use this same code later should the need ever arise

* BONUS: We  created a `seeds.sql` file that contains the data for the first three songs found within `TopSongs.csv`

* BONUS: Look into how MySQL Workbench can import and export data files. What file types does it accept? It accepts csv and json file types.
* How does it convert the data? It matches each column of data with a field in the table that's shown in our table schema.

* schema.sql

```
DROP DATABASE IF EXISTS top_songsDB;
CREATE DATABASE top_songsDB;
USE top_songsDB;
CREATE TABLE top5000(
	position INT NOT NULL,
    artist VARCHAR(50) NULL,
    song VARCHAR(100) NULL,
    syear INT NULL,
    raw_total DECIMAL(10,4) NULL,
    raw_usa DECIMAL(10,4) NULL,
    raw_uk DECIMAL(10,4) NULL,
    raw_eur DECIMAL(10,4) NULL,
    raw_row DECIMAL(10,4) NULL,
    PRIMARY KEY (position)
  );  
    
```
* seeds.sql

```
USE top_songsDB;
SELECT * FROM top5000 WHERE position<4;
```
---
## Activity 13: TOP5000CODE ##

* With all of our data successfully imported into the database, we implemented a Node console application which allows us to collect more specialized pieces of data. For example...

  * A query which returns all data for songs sung by a specific artist
  * A query which returns all artists who appear within the top 5000 more than once
  * A query which returns all data contained within a specific range
  * A query which searches for a specific song in the top 5000 and returns the data for it

* songs.js
```
var mysql = require("mysql");
var inquirer=require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
 // database: "ice_creamDB"
 database:"top_songsDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  input();
  
});
function input(){
  inquirer.prompt([
    {
      type:"list",
      name:"choice",
      message:"Please choose one of the queries below:",
      choices:["List data for songs sung by an Artist",
               "List Artists that appear in Top5000 more than once",
               "List data between specified range",
               "Search for a specific song within Top5000",
               "Quit"
              ]
    }

  ]).then(answer=>{
    switch(answer.choice){
      case "List data for songs sung by an Artist":songByArtist();break;
      case "List Artists that appear in Top5000 more than once":artistAppearMore();break;
      case "List data between specified range":rangeData();break;
      case "Search for a specific song within Top5000":searchSong();break;
      case "Quit":connection.end();break;
    }

  });
}

function songByArtist(){
  inquirer
  .prompt([{
    type:"input",
    name:"artist",
    message:"Please enter the artist you want to search for:"

  }]).then(answer=>{
      connection.query("SELECT * FROM Top5000 WHERE ?",{artist:answer.artist},function(err,res){
              if (err) throw err;
              for (let i=0;i<res.length;i++){
                console.log("Position: "+res[i].position+" || "+"Artist: "+res[i].artist+" || "+
                            "Song: "+res[i].song+" || "+"Year: "+res[i].syear+" || "+"Total: "+res[i].raw_total+" || "+
                            "Usa: "+res[i].raw_usa+" || "+"UK: "+res[i].raw_uk+" || "+"Eur: "+res[i].raw_eur+" || "+
                            "Others:"+res[i].raw_row);            
                          
              }
              input();
      });
      

  });
}

function artistAppearMore(){
  connection.query("SELECT artist,Count(*) as number FROM Top5000 GROUP BY artist having number>1 ORDER BY number DESC;",function(err,res){
    if (err) throw err;
    for (let i=0;i<res.length;i++){
      console.log("Artist: "+res[i].artist+" || "+"Number of Occurence: "+res[i].number);
    }
    input();
  });

}

function rangeData(){
  inquirer.prompt([{
    type:"input",
    name:"start",
    message:"Please enter the start position:"

  },
  {
    type:"input",
    name:"end",
    message:"Please enter the end position:"

  }]).then(answer=>{
       
      connection.query("SELECT * FROM Top5000 WHERE position BETWEEN ? and ?",[answer.start,answer.end],function(err,res){
            if (err) throw err;
            for (let i=0;i<res.length;i++){
              console.log("Position: "+res[i].position+" || "+"Artist: "+res[i].artist+" || "+
                          "Song: "+res[i].song+" || "+"Year: "+res[i].syear+" || "+"Total: "+res[i].raw_total+" || "+
                          "Usa: "+res[i].raw_usa+" || "+"UK: "+res[i].raw_uk+" || "+"Eur: "+res[i].raw_eur+" || "+
                          "Others:"+res[i].raw_row);            
                        
            }
            input();              
      });

  });
}

function searchSong(){
  inquirer.prompt([{
    type:"input",
    name:"song",
    message:"Please enter the song you want to search:"

  },
  ]).then(answer=>{
       
      connection.query("SELECT * FROM Top5000 WHERE ?",[{song:answer.song}],function(err,res){
            if (err) throw err;
            for (let i=0;i<res.length;i++){
              console.log("Position: "+res[i].position+" || "+"Artist: "+res[i].artist+" || "+
                          "Song: "+res[i].song+" || "+"Year: "+res[i].syear+" || "+"Total: "+res[i].raw_total+" || "+
                          "Usa: "+res[i].raw_usa+" || "+"UK: "+res[i].raw_uk+" || "+"Eur: "+res[i].raw_eur+" || "+
                          "Others:"+res[i].raw_row);            
                        
            }
            input();              
      });

  });

}

```
---

## Activity 14:TWOTABLES ##

* When dealing with big databases, it is very likely that you will have to work with two or more datasets that are related, but which have some degree of separation between them. In this case we have a table of the top 5000 songs and a table of the top 3000 albums.

* We took these two large sets of data and come up with a method to join them together in order to figure out if a given artist's song and album made it into the charts at the time of their release.

* topAlbumsCode.js

```
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "orhanpamuk77",
  database: "top_songsDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});
function runSearch(){
  inquirer
  .prompt([{
    type:"input",
    name:"artist",
    message:"Enter an artist to find if he/she has both top songs and top albums in the same year:"
  }]).then(answer=>{
      connection.query("SELECT top_albums.syear,top_albums.album,top_albums.position,top_albums.artist,Top5000.song"+
                       " FROM top_albums INNER JOIN Top5000 WHERE top_albums.syear=Top5000.syear AND top_albums.artist=Top5000.artist AND top_albums.artist=? ORDER BY top_albums.syear ",[answer.artist],
                       function(err,res){
                         if(err)throw err;
                         console.log(res);
                         for (let i=0;i<res.length;i++){
                           console.log(i+1+")"+"Year: "+res[i].syear+" || "+
                                              "Album: "+res[i].album+" || "+
                                              "Album Position: "+res[i].position+" || "+
                                              "Artist: "+res[i].artist+" || "+
                                              "Song: "+res[i].song+" || ");
                                              
                         }
                         connection.end();

                       });
  });
}

```

