"use strict";

console.log("MAIN.JS");


let $ = require('jquery'),
    _ = require('lodash'),
    db = require("./db-interactions"),
		Handlebars=require("hbsfy/runtime"),
		unwatchedcardsTemplate = require("../templates/unwatched-cards.hbs"),
		watchedcardsTemplate = require("../templates/watched-cards.hbs"),
    // templates = require("./dom-builder"),
    user = require("./user"),
    _ = require('lodash');

require("bootstrap");
require("bootstrap-star-rating");


var newMovieObj = {};






$("#auth-btn").click(function(){
	console.log("clicked on auth btn");
  	user.logInGoogle()
  	.then(function(result){
    console.log("result from Login", result.user.uid);
    user.setUser(result.user.uid);
    // loadUserMovies();
  });
});

// Tamela added focus, empty and breadcrumbs
//When find new movies is clicked - get matching title from movie database and display on page
//$("#find-new-movies").click(function(){
////    $(".toggle-buttons").toggle("toggle-selected");
//    $("#input").focus();
//    $(".movies").empty();
//    let breadcrumbs = "< Search Results";
//    $("#bread-crumbs").text(breadcrumbs);
//
//	var inputItem = $("#input").val();
//	db.getMovie(inputItem)
//	.then(function(movieData){
//
//		newMovieObj.results = movieData.results;
//		db.getActors(newMovieObj.id)
//		.then(function(actors){
//			newMovieObj.cast = [];
//			for (var i=0; i<5;i++){
//				newMovieObj.cast.push(actors.cast[i]);
//			}
//			newMovieObj.starValue = 0;
//
//			$(".movies").html(unwatchedcardsTemplate(newMovieObj));
//		});
//	});
//});

// var addToWatchList = function(movieElementArray, event){
// 	//function to add searched movies to watchlist
//     console.log("movieElementArray", movieElementArray);
//     var userID = user.getUser();
//     console.log(event.target.parentNode.firstElementChild.firstChild.nodeValue);
//     var movieTitle = event.target.parentNode.firstElementChild.firstChild.nodeValue;
//     //grabs movie title from clicked card
// 	console.log("movieTitle", movieTitle);
//     var titleToPush = {};
//     movieElementArray.forEach(function(movie){
//         if(movieTitle === movie.title){
//         	//compares title pulled from card to array of searched movies?
//             titleToPush = movie;
//             //takes matched movie object and assigns it to var
//         }
//     });
//     console.log("titleToPush", titleToPush);
//     db.pushToFirebaseArray(titleToPush, userID);
//     //should this call both functions?
//     db.pushToFirebase(titleToPush, userID)
//     .then(function(response){
//         console.log(response);
//         });
// };

var addToWatchList = function(event){
    var userID = user.getUser();
    let movieObj = {
        title: $(event.target).siblings(".title").html(),
        image: $(event.target).siblings(".poster").html(),
        actors: $(event.target).siblings(".actors").html(),
        overview: $(event.target).siblings(".title").html(),
        release: $(event.target).siblings(".release").html()
    };
    console.log("movieObj", movieObj);
    // var titleToPush = _.filter(movieElementArray, {'title': movieTitle});
    // db.pushToFirebaseArray(titleToPush, userID);//does this need a .then since it is calling a Promise?
    db.pushToFirebase(movieObj, userID)
    .then(function(response){
        console.log("response from pushToFirebase", response);
    });
};


$("#find-new-movies").click(function(){
	//on button press take value of user input and search api send to getMovie
	//
//    $(“.toggle-buttons”).toggle(“toggle-selected”);
    $("#input").focus();
    $(".movies").empty();
    let breadcrumbs = "< Search Results";
    $("#bread-crumbs").text(breadcrumbs);

    var inputItem = $("#input").val();
    db.getMovie(inputItem)
    //
    .then(function(movieData){
    	console.log("hi", movieData);
        newMovieObj = movieData.results;
    	console.log("yo", newMovieObj);
        //what does newMovieObj equal now and prior to?
        getActors(newMovieObj);
    });
});



var getActors = function(newMovieObj){
    var movieElementArray = [];
    newMovieObj.forEach(function(element){
        movieElementArray.push(element);
        element.cast = [];
        db.getActors(element.id)
        .then(function(actors){
            if(actors.cast.length > 5){
                for(var i=0;i<5;i++){
                    element.cast.push(actors.cast[i]);
                }
            }else if (actors.cast.length < 5){
                for(var j=0;j<actors.cast.length;j++){
                    element.cast.push(actors.cast[j]);
                }
            }
            element.starValue = 0;
        $(".movies").append(unwatchedcardsTemplate(element));
        });
    });
    //     $(document).on("click", ".add-to-watchlist", function(){
    //             addToWatchList(movieElementArray, event);
    // });
};


$(document).on("click", '.add-to-watchlist', function(event){

    var userID = user.getUser();
    addToWatchList(event);
	// db.pushToFirebaseArray(newMovieObj.id, userID);
	// db.pushToFirebase(newMovieObj, userID)
	// .then(function(response){
	// 	console.log("response from pushToFirebase", response);
 //        console.log("newMovieObj", newMovieObj);
	// 	});
});


$("#logout").click(function(){
  console.log("logout clicked");
  user.logOut();
});


///Tam..buttons do not toggle color yet, pulls a list of movies added to watchlist
$("#show-unwatched-movies").click((event) =>{
    let breadcrumbs = "< Search Results/Unwatched";
    $("#bread-crumbs").text(breadcrumbs);
    $("#input").val("");
//    $(".toggle-buttons").toggle("toggle-selected");
    let userID = user.getUser();
    console.log("Checking user ID", userID);
    db.pullWatchFromFirebase(userID)
    .then((data) =>{
      console.log("unwatched data", data);
        displayWatchList(data);

    });
//    .prop('disabled', true)......don't think we need to disable

});

//Tam....empties Dom so only Watchlist will display, set FB unique ID to a var and passed it as an arg//did npm install of bootstrap dependency for stars
function displayWatchList (watchObj) {
    $("#input").val("");
    $(".movies").empty();
     for (let key in watchObj) {
//            console.log("is this a key?" + data[key].title);
            let newMovieObj = watchObj[key];
            newMovieObj.key = key;
            console.log("newMovieObj", newMovieObj);
            $(".movies").append(watchedcardsTemplate(newMovieObj));
            $("#star--" + key).rating({stars: 10, step: 1, min: 0, max: 10});
            $("#star--" + key).rating('update', newMovieObj.starValue);
        }

    $(".rating").on('rating.change', function(event, value, caption) {
        let currentStarID = event.currentTarget.id.replace("star--", ""); // chop off letters
        let starObj = {
            starValue: value
        };
        let currentUser = user.getUser();
        db.updateStars(currentStarID, starObj, currentUser);
//        console.log(value);
//        console.log(caption);
    });
}

function displayRatedMovies(rated) {
  let newObj = _.filter(rated, 'starValue');
  for (let key in newObj) {
//            console.log("is this a key?" + data[key].title);
         let newMovieObj = newObj[key];
         newMovieObj.key = key;
         console.log(newMovieObj);
         $(".movies").append(watchedcardsTemplate(newMovieObj));
         $("#star--" + key).rating({stars: 10, step: 1, min: 0, max: 10});
         $("#star--" + key).rating('update', newMovieObj.starValue);
     }
}

$("#show-watched-movies").click((event) =>{
  $(".movies").empty();
  let breadcrumbs = "< Search Results/Watched";
  $("#bread-crumbs").text(breadcrumbs);
  $("#input").val("");
  let userID = user.getUser();
  console.log("Checking user ID", userID);
  db.pullWatchFromFirebase(userID)
  .then((data) =>{
  displayRatedMovies(data);
});
});


//Tam...removed watched movie card from page
$(document).on("click", '.watch-list-delete', function(event){
    let firebaseKey = event.currentTarget.parentElement.id;
    console.log("which key is being deleted" + firebaseKey);
    let deleteButton = event.currentTarget.parentElement;
    let currentUser = user.getUser();
    db.deleteWatchedMovie(firebaseKey, currentUser);
    deleteButton.remove();
});
