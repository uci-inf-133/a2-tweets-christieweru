let tweet_array = [];
let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	tweet_array = runkeeper_tweets.map(t => new Tweet(t.text, t.created_at));
	
	//TODO: Filter to just the written tweets
	writtenTweets = tweet_array.filter(t=> t.written);
	document.getElementById("searchCount").textContent = "0";
	document.getElementById("searchText").textContent = "";

}
function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const inputBox = document.getElementById("textFilter");
	const tableBody = document.getElementById("tweetTable");
	const searchCount = document.getElementById("searchCount");
	const searchText = document.getElementById("searchText");

	inputBox.addEventListener("input", function () {
		const query = inputBox.value.trim().toLowerCase();

		// reset table if empty
		if (query === "") {
			tableBody.innerHTML = "";
			searchCount.textContent = "0";
			searchText.textContent = "";
			return;
		}

		// filter written tweets based on user input
		const filtered = writtenTweets.filter(t => t.writtenText.toLowerCase().includes(query));

		searchCount.textContent = filtered.length;
		searchText.textContent = query;

		tableBody.innerHTML = "";
		tableBody.innerHTML = filtered
			.map((tweet, i) => tweet.getHTMLTableRow(i + 1))
			.join("");
	
	});
}
//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});