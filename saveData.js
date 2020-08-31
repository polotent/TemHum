const DateDoc = require("./models/dateDoc");
const getDate = require("./getDate");

const saveData = async function(data) {
	let nowDate = getDate();

	let doc;
	let search_results
	try {
		search_results = await DateDoc.find({ "date": nowDate.date });
	} catch(err) {
		console.log(err);
	}

	if (search_results.length == 1){
		doc = search_results[0];
		doc.data.humidity.push(data.humidity);
		doc.data.temperature.push(data.temperature);
		doc.data.time.push(nowDate.time);
	} else {
		doc = new DateDoc({
			"date": nowDate.date,
			"data": {
				"humidity": [data.humidity],
				"temperature": [data.temperature],
				"time": [nowDate.time]
			}		
		});
	}
	try {
		await doc.save();
	} catch(err) {
		console.log(err);
	}
	return await DateDoc.findOne({ "date": nowDate.date });	
}

module.exports  =  saveData;
