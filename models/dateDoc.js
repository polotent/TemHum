const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;

const  dataSchema  =  new Schema(
    {
        humidity: {
            type: [Number]
        },
        temperature: {
            type: [Number]
        },
        time: {
            type: [String]
        }
    }
);

const  dateSchema  =  new Schema(
    {
        date: String,
        data: dataSchema,
    }
);

let DateDoc  =  mongoose.model("DateDoc", dateSchema, "sensor_data");
module.exports  =  DateDoc;