function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	let run_count = 0;
	let walk_count = 0;
	let bike_count = 0;
	let swim_count = 0;
	let hike_count = 0;
	for (let i = 0; i < tweet_array.length; i ++) {
		const tweet = tweet_array[i];
		if (tweet.source === "completed_event") {
			if (tweet.activityType === "run"){
				run_count += 1;
			}
			else if (tweet.activityType === "walk"){
				walk_count += 1;
			}
			else if (tweet.activityType === "bike"){
				bike_count += 1;
			}
			else if (tweet.activityType === "swim"){
				swim_count += 1;
			}
			else if (tweet.activityType === "hike"){
				hike_count += 1;
			}
		}
	}

	// activity count chart
	const activityData = [
		{activity: "run", count: run_count},
		{activity: "walk", count: walk_count},
		{activity: "bike", count: bike_count},
		{activity: "swim", count: swim_count},
		{activity: "hike", count: hike_count}
	];
	document.getElementById("numberActivities").innerText = 5;
    document.getElementById("firstMost").innerText = "run";
    document.getElementById("secondMost").innerText = "bike";
    document.getElementById("thirdMost").innerText = "walk";
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityData
	  },
	  //TODO: Add mark and encoding
	"mark": "bar",
	"encoding": {
		"x": { "field": "activity", "type": "nominal", "axis": {"title": "Activity Type"} },
		"y": { "field": "count", "type": "quantitative", "axis": {"title": "Tweet Count"} },
		"color": { "field": "activity", "type": "nominal" }
	}

	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	const dayOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
	const distanceByDayData = [];

	for (let i = 0; i < tweet_array.length; i++) {
		const tweet = tweet_array[i];
		if (tweet.source === "completed_event") {
			const day = dayOfWeek[tweet.time.getDay()];
			const type = tweet.activityType;
			const dist = tweet.distance;
			
			if ((type === "run" || type === "walk" || type === "bike") && dist > 0) {
				distanceByDayData.push({ day: day, activity: type, distance: dist });
			}
		}
	}

	// distance chart
	const distanceScatterSpec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"data": { "values": distanceByDayData },
		"mark": "point",
		"encoding": {
		  "x": { "field": "day", "type": "nominal", "title": "Day of Week" },
		  "y": { "field": "distance", "type": "quantitative", "title": "Distance (mi)" },
		  "color": { "field": "activity", "type": "nominal" }
		}
	};

	vegaEmbed('#distanceVis', distanceScatterSpec, {actions:false});
	// mean distance chart 
	const meanDistanceData = [];
	const grouped = {};

	for (let entry of distanceByDayData) {
		const key = entry.day + "-" + entry.activity;
		if (!grouped[key]) grouped[key] = []; 
		grouped[key].push(entry.distance); 
	}

	for (let key in grouped) {
		const [day, activity] = key.split("-");
		const distances = grouped[key];
		const average = distances.reduce((a,b)=>a+b, 0) / distances.length;

		meanDistanceData.push({ day, activity, meanDistance: average});
	}
	const meanChartSpec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"data": { "values": meanDistanceData },
		"mark": "point",
		"encoding": {
		"x": { "field": "day", "type": "nominal", "title": "Day of Week" },
		"y": { "field": "meanDistance", "type": "quantitative", "title": "Avg Distance (mi)" },
		"color": { "field": "activity", "type": "nominal", "title": "Activity" }
		}
	};

	let showingMean = false;

	document.getElementById("aggregate").onclick = function () {
		showingMean = !showingMean;

		if (showingMean) {
			vegaEmbed('#distanceVis', meanChartSpec, {actions:false});
			document.getElementById("aggregate").innerText = "Show all points";
		} else {
			vegaEmbed('#distanceVis', distanceScatterSpec, {actions:false});
			document.getElementById("aggregate").innerText = "Show means";
		}
	};

}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});