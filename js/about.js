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
