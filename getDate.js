const getDate = function(){
    let now = new Date();
	now.setHours(now.getHours() + 3);
	let nowDate = now.getUTCFullYear() + "/" + (now.getUTCMonth() + 1) + "/" + now.getUTCDate();
    let nowTime = now.getUTCHours() + ":" + now.getUTCMinutes() + ":" + now.getUTCSeconds();
    return {
        "date": nowDate,
        "time": nowTime
    };
}

module.exports = getDate;