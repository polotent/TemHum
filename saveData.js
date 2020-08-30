const DateDoc = require("./models/dateDoc");

const saveData = async function(data) {
	let now = new Date();
	now.setHours(now.getHours() + 3);
	let nowDate = now.getUTCFullYear() + "/" + (now.getUTCMonth() + 1) + "/" + now.getUTCDate();
	let nowTime = now.getUTCHours() + ":" + now.getUTCMinutes() + ":" + now.getUTCSeconds();

	let doc;
	let search_results
	try {
		search_results = await DateDoc.find({ "date": nowDate });
	} catch(err) {
		console.log(err);
	}

	if (search_results.length == 1){
		doc = search_results[0];
		doc.data.humidity.push(data["humidity"]);
		doc.data.temperature.push(data["temperature"]);
		doc.data.time.push(nowTime);
	} else {
		doc = new DateDoc({
			"date": nowDate,
			"data": {
				"humidity": [data["humidity"]],
				"temperature": [data["temperature"]],
				"time": [nowTime]
			}		
		});
	}
	try {
		doc.save();
	} catch(err) {
		console.log(err);
	}	
	console.log("Data saved to", nowDate);
}

module.exports  =  saveData;
