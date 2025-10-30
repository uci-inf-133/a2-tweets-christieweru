function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	updateDates(tweet_array);
	tweetCategoryCounter(tweet_array);
	writtenTweetCounter(tweet_array);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);

});

function updateDates(runkeeper_tweets) {
	let time_stamps = []; 
	for (let i = 0; i < runkeeper_tweets.length; i++) {
			const tweet = runkeeper_tweets[i];
			const convert_time = tweet.time;
			time_stamps.push(convert_time.getTime());
	}
	const min_date = Math.min(...time_stamps);
	const max_date = Math.max(...time_stamps);
	const earliest_date = new Date(min_date);
	const latest_date = new Date(max_date);

	const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const formattedEarliest = earliest_date.toLocaleDateString("en-US", options);
    const formattedLatest = latest_date.toLocaleDateString("en-US", options);

    // update DOM
    document.getElementById("firstDate").innerText = formattedEarliest;
    document.getElementById("lastDate").innerText = formattedLatest;
}

function tweetCategoryCounter(runkeeper_tweets){
	let completed_count = 0;
	let live_count = 0;
	let achievement_count = 0;
	let miscellaneous_count = 0;
	for (let i = 0; i < runkeeper_tweets.length; i ++) {
		const tweet = runkeeper_tweets[i];
		if (tweet.source === "completed_event") {
			completed_count += 1;
		}
		else if (tweet.source === "live_event") {
			live_count += 1;
		}
		else if (tweet.source === "achievement") {
			achievement_count += 1;
		}
		else if (tweet.source === "miscellaneous") {
			miscellaneous_count += 1;
		}
	}
	document.querySelectorAll(".completedEvents").forEach(el => { el.innerText = completed_count});
    document.querySelectorAll(".liveEvents").forEach(el => { el.innerText = live_count});
    document.querySelectorAll(".achievements").forEach(el => { el.innerText = achievement_count});
    document.querySelectorAll(".miscellaneous").forEach(el => { el.innerText = miscellaneous_count});
	let total_tweets = completed_count + live_count + achievement_count +miscellaneous_count;
	document.querySelectorAll(".completedEventsPct").forEach(el => { el.innerText = parseFloat((completed_count/total_tweets*100).toFixed(2)) +'%'});
    document.querySelectorAll(".liveEventsPct").forEach(el => { el.innerText = parseFloat((live_count/total_tweets*100).toFixed(2)) +'%'});
    document.querySelectorAll(".achievementsPct").forEach(el => { el.innerText = parseFloat((achievement_count/total_tweets*100).toFixed(2)) +'%'});
    document.querySelectorAll(".miscellaneousPct").forEach(el => { el.innerText = parseFloat((miscellaneous_count/total_tweets*100).toFixed(2)) +'%'});
}

function writtenTweetCounter(runkeeper_tweets) {
	let written_ce = 0;
	let completed_count = 0;
	for (let i = 0; i < runkeeper_tweets.length; i ++) {
		const tweet = runkeeper_tweets[i];
		if (tweet.source === "completed_event") {
			completed_count += 1;
		}
		if (tweet.written === true) {
			written_ce += 1;
		}
	document.querySelectorAll(".written").forEach(el => { el.innerText = written_ce});
	document.querySelectorAll(".writtenPct").forEach(el => { el.innerText = parseFloat((written_ce/completed_count*100).toFixed(2)) +'%'});

	}
}