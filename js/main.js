"use strict";

console.log("MAIN.JS");

let $ = require('jquery'),
    db = require("./db-interactions"),
		Handlebars=require("hbsfy/runtime"),
		cardsTemplate = require("../templates/cards.hbs"),
        watchListTemplate = require("../templates/watch.hbs"),
    // templates = require("./dom-builder"),
    user = require("./user");

$("#auth-btn").click(function(){
	console.log("clicked on auth btn");
  	user.logInGoogle()
  	.then(function(result){
    console.log("result from Login", result.user.uid);
    user.setUser(result.user.uid);
    // loadUserMovies();
  });
});

$("#find-new-movies").click(function(){
	var newMovieObj = {};
	console.log("find new movies clicked");
	var inputItem = $("#input").val();
	console.log("inputItem", inputItem);
	db.getMovie(inputItem)
	.then(function(movieData){
		console.log(movieData);
		newMovieObj = movieData.results[0];

	db.getActors(newMovieObj.id)
	.then(function(actors){
		newMovieObj.cast = [];
		for (var i=0; i<5;i++){
			newMovieObj.cast.push(actors.cast[i]);
		}
		console.log("movie data", newMovieObj);
		console.log("movie data", newMovieObj.cast[0]);


        $(".movies").html(cardsTemplate(newMovieObj));
        $(".butts").click((event) =>{
            addtoWatchList(event, newMovieObj);
            });
	});


	});
});

$("#logout").click(function(){
  console.log("logout clicked");
  user.logOut();
});

function addtoWatchList(event, newMovieObj){


    let watchlist = watchListTemplate(newMovieObj);

    console.log("this is the new movie", newMovieObj);
    $(".movies").html(watchListTemplate(newMovieObj));
    $(".untrack").click((event) =>{
        $(".movies").remove();
    });
    return pushToDataBase(newMovieObj);
}
