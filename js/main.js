"use strict";

console.log("MAIN.JS");

let db = require("./db-interactions"),
		Handlebars=require("hbsfy/runtime"),
		unwatchedcardsTemplate = require("../templates/unwatched-cards.hbs"),
		watchedcardsTemplate = require("../templates/watched-cards.hbs"),
    // templates = require("./dom-builder"),
    user = require("./user");


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


//When find new movies is clicked - get matching title from movie database and display on page
$("#find-new-movies").click(function(){
	$(".movies").html("");
	var inputItem = $("#input").val();
	db.getMovie(inputItem)
	.then(function(movieData){
		newMovieObj.results = movieData.results;
		getActors(newMovieObj);
	});
});

var getActors = function(movieObj){
	var movieElementArray = [];
	movieObj.results.forEach(function(element){
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
			$(".movies").append(unwatchedcardsTemplate(element));
			});
		});
		$(document).on("click", ".add-to-watchlist", function(){
				addToWatchList(movieElementArray, event);
	});
};






var addToWatchList = function(movieElementArray, event){
	console.log("movieElementArray", movieElementArray);
	var userID = user.getUser();
	var movieTitle = event.target.closest("div").querySelector(".movie-title").innerHTML;
	var titleToPush = {};
	movieElementArray.forEach(function(movie){
		if(movieTitle === movie.title){
			titleToPush = movie;
		}
	});
	console.log("titleToPush", titleToPush);
	db.pushToFirebaseArray(titleToPush, userID);
	db.pushToFirebase(titleToPush, userID)
	.then(function(response){
		console.log(response);
		});
};


$("#logout").click(function(){
  console.log("logout clicked");
  user.logOut();
});
