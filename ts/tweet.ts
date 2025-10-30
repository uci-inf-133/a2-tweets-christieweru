class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const text = this.text.toLowerCase();
        if ((text.includes("just completed")) || (text.includes("just posted"))) {
            return "completed_event";
            }
            else if ((text.includes("achieved")) || (text.includes("goal"))) {
                return "achievement";
            }
            else if ((text.includes("watch my"))) {
                return "live_event";
            }
        
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        const text = this.text.toLowerCase();
        if (text.includes(" - ")) {
            return true;
        }
        if (!text.startsWith("just completed") && !text.startsWith("just posted") && !text.startsWith("achieved") && !text.startsWith("watch my")) {
            return true;
        }
          return false;
        }
    

    get writtenText():string {
    //TODO: parse the written text from the tweet

    if (!this.written) {
        return "";
    }

    const lower = this.text.toLowerCase();

    //user text comes AFTER the auto message 

    if (lower.includes(" - ")) {
        let afterDash = this.text.split(" - ")[1];

        // Clean off URLs
        afterDash = afterDash.split(" http")[0];

        // Clean off hashtags
        afterDash = afterDash.split(" #")[0];

        return afterDash.trim();
    }

    //user text comes BEFORE auto message
    const defaultPhrases = ["just completed", "just posted", "achieved", "watch my"];
    for (let phrase of defaultPhrases) {
        const idx = lower.indexOf(phrase);
        if (idx > 0) {
            return this.text.substring(0, idx).trim();
        }
    }

    //fallback (after-text case using @Runkeeper)
    const rkIndex = lower.indexOf("@runkeeper");
    if (rkIndex !== -1) {
        let after = this.text.substring(rkIndex + "@runkeeper".length);
        after = after.split(" http")[0];
        after = after.split(" #")[0];
        return after.trim();
    }

    return "";


    }
    

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        
        //TODO: parse the activity type from the text of the tweet
        let distanceIndex;
        let distanceType;
        
        const lower = this.text.toLowerCase();
        const kmIndex = lower.indexOf(" km");
        const miIndex = lower.indexOf(" mi");
        if (kmIndex === -1 && miIndex === -1){
            return "unknown";
        }
        else if (kmIndex !== -1){
            distanceIndex = kmIndex;
            distanceType = "km";
            const afterDistance = lower.substring(distanceIndex + distanceType.length + 1).trim();
            let activity = afterDistance.split(" ")[0];
            activity = activity.replace(/[.,!]/g, "");
            if (activity.startsWith("run")) return "run";
            if (activity.startsWith("walk")) return "walk";
            if (activity.startsWith("bike") || activity.startsWith("cycl")) return "bike";
            if (activity.startsWith("swim")) return "swim";
            if (activity.startsWith("hike")) return "hike";

        }
        else if(miIndex !== -1) {
            distanceIndex = miIndex;
            distanceType = "mi";
            const afterDistance = lower.substring(distanceIndex + distanceType.length + 1).trim();
            let activity = afterDistance.split(" ")[0];
            activity = activity.replace(/[.,!]/g, "");
            if (activity.startsWith("run")) return "run";
            if (activity.startsWith("walk")) return "walk";
            if (activity.startsWith("bike") || activity.startsWith("cycl")) return "bike";
            if (activity.startsWith("swim")) return "swim";
            if (activity.startsWith("hike")) return "hike";
        }

        else {
            if (miIndex !== -1){
                distanceIndex = miIndex;
                distanceType = "mi";
                const afterDistance = lower.substring(distanceIndex + distanceType.length + 1).trim();
                let checkNext = afterDistance.split(" ")[1];
                checkNext = checkNext.replace(/[.,!]/g, "");
                if (checkNext.startsWith("run")) return "run";
                if (checkNext.startsWith("walk")) return "walk";
                if (checkNext.startsWith("bike") || checkNext.startsWith("cycl")) return "bike";
                if (checkNext.startsWith("swim")) return "swim";
                if (checkNext.startsWith("hike")) return "hike";
            }
            if (kmIndex !== -1){
                distanceIndex = kmIndex;
                distanceType = "km";
                const afterDistance = lower.substring(distanceIndex + distanceType.length + 1).trim();
                let checkNext = afterDistance.split(" ")[1];
                checkNext = checkNext.replace(/[.,!]/g, "");
                if (checkNext.startsWith("run")) return "run";
                if (checkNext.startsWith("walk")) return "walk";
                if (checkNext.startsWith("bike") || checkNext.startsWith("cycl")) return "bike";
                if (checkNext.startsWith("swim")) return "swim";
                if (checkNext.startsWith("hike")) return "hike";
            }
        }
        
    return "unknown";    
        

        
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
    let phrase_array;
    const lower = this.text.toLowerCase();
    const kmIndex = lower.indexOf("km");
    const miIndex = lower.indexOf("mi");
        if (kmIndex !== -1){
        const beforeDistance = lower.substring(0, kmIndex).trim();
        phrase_array = beforeDistance.split(" ");
        let checkBefore = phrase_array[phrase_array.length -1];
        let distanceInMi = parseFloat(checkBefore)* 0.621;
        distanceInMi = parseFloat(distanceInMi.toFixed(2));
        return distanceInMi;
    }
    if (miIndex !== -1){
        const beforeDistance = lower.substring(0, miIndex).trim();
        phrase_array = beforeDistance.split(" ");
        let checkBefore = phrase_array[phrase_array.length -1];
        return parseFloat(checkBefore);
    }
    return 0;
    }
    

    getHTMLTableRow(rowNumber:number):string {
    const lower = this.text.toLowerCase();
    let link = "";
    const linkStart = lower.indexOf("https://t.co/");
    if (linkStart !== -1) {
        const afterLink = this.text.substring(linkStart).split(" ")[0];
        link = afterLink.trim();
    }

    const safeLink = link || "#";
    const activity = this.activityType || "–";
    const text = this.writtenText || "";

    return `
        <tr>
            <td>${rowNumber}</td>
            <td>${activity}</td>
            <td>${text}</td>
            <td><a href="${safeLink}" target="_blank">View</a></td>
        </tr>
    `;
}
}
    
