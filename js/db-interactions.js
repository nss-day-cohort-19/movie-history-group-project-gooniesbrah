"use strict";

let $ = require('jquery'),
    firebase = require("./firebaseConfig");

function getMovie(movie) {
	//takes user input from EL and puts into URL for query, resolves object of array of objects?
	return new Promise(function(resolve, reject){
		$.ajax({
			url: `https://api.themoviedb.org/3/search/movie?api_key=7cf213fd59bc986d0eb48bf0aead461a&language=en-US&query=${movie}&page=1&include_adult=false`
		}).done(function(movieData){
			resolve(movieData);
		}).fail(function(error){
			reject(error);
		});
	});
}

function getActors(movieID) {
	//duplicate func on main
	//called by getActors onmain takes single movie object
	return new Promise(function(resolve, reject){
		$.ajax({
			url: `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=7cf213fd59bc986d0eb48bf0aead461a`
		}).done(function(movieData){
			//resolves movieData(list of movie's actors)
			resolve(movieData);
		}).fail(function(error){
			reject(error);
		});
	});
}

function pushToFirebase(movieObj, userID){
	//movieObj should be single object not array
	console.log("pushToFB func", movieObj);
	return new Promise(function(resolve, reject){
		$.ajax({
			url: `${firebase.getFBsettings().databaseURL}/${userID}/movies/.json`,
			type: "POST",
			data: JSON.stringify(movieObj),
			dataType: "json"
		}).done(function(movieId){
			//what is movieId here, improper variable? should be movieObj?
			resolve(movieId);
		});
	});
}

// function pushToFirebaseArray(movieID, userID){
// 	//does the same thing as above except adds to an array under the user id instead of movie
// 	return new Promise(function(resolve, reject){
// 		$.ajax({
// 			url: `${firebase.getFBsettings().databaseURL}/${userID}/array.json`,
// 			type: "POST",
// 			data: JSON.stringify(movieID),
// 			dataType: "json"
// 		}).done(function(movieId){
// 			resolve(movieId);
// 		});
// 	});
// }

function pullWatchFromFirebase(userID){
	return new Promise(function(resolve, reject){
		$.ajax({
			url: `${firebase.getFBsettings().databaseURL}/${userID}/movies.json`,
			type: "GET",
			dataType: "json"
		}).done(function(data){
			resolve(data);
		});
	});
}
//not deleting yet
function deleteWatchedMovie(firebaseKey, userID) {
    return new Promise (function(resolve, reject){
        $.ajax({
            url: `${firebase.getFBsettings().databaseURL}/${userID}/movies/${firebaseKey}.json`,
            method: "DELETE"
        }).done(function(){
            resolve();
        });
    });
}
//not updating to FB
function updateStars(firebaseKey, starValue, userID) {
    return new Promise (function(resolve, reject){
        $.ajax({
            url: `${firebase.getFBsettings().databaseURL}/${userID}/movies/${firebaseKey}.json`,
            type: "PATCH",
            data: JSON.stringify(starValue)
        }).done(function(data){
            console.log("did this resolve");
            resolve(data);
        });
    });
}


module.exports = {
	getMovie,
	getActors,
	pushToFirebase,
	// pushToFirebaseArray,
    pullWatchFromFirebase,
    deleteWatchedMovie,
    updateStars
};
