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
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}