const request = require("request");
//cheerio parses the html and traverse it to extract and manipulate the data required by the user

request("https://www.worldometers.info/coronavirus/",cb);


function cb(err,res,body){
    if(err){
        console.error("error",err);
    }
}