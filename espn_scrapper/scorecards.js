const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const xlsx = require("xlsx");

function getInfoFromScorecard(url){
    // we have a url of a scorecard, we want to get html of that scorecard
    request(url, cb);
}

function cb(err, res, body){
    if(err){
        console.error("error", err);
    } else {
        getMatchDetails(body);
    }
}

function getMatchDetails(html) {
    // selecTool contains the html of ith scorecard
    let selecTool = cheerio.load(html);

    //1.get venue
    //2.get date

    let desc = selecTool(".match-header-info.match-info-MATCH");
    let descArr = desc.text().split(",");

    //Match (N), Abu Dhabi, Oct 25 2020, Indian Premier League
    // console.log(descArr);
    let dateOfMatch = descArr[2];
    let venueOfMatch = descArr[1];
    console.log(dateOfMatch);
    console.log(venueOfMatch);
    //3. get result
      let matchResEle = selecTool(
        ".match-info.match-info-MATCH.match-info-MATCH-half-width>.status-text"
      );
      console.log(matchResEle.text());
  //4. get team names
    let teamNames = selecTool(".name-detail>.name-link");

    let ownTeam = selecTool(teamNames[0]).text();
    let oppTeam = selecTool(teamNames[0]).text();
    console.log(ownTeam);
    console.log(oppTeam);

    //5. get innings

    let allBatsmenTable = selecTool(".table.batsman tbody");
   // console.log(allBatsmenTable.length); // length = 2 tables
    
    //let htmlString = "";
    let count = 0;

    for (let i = 0; i < allBatsmenTable.length; i++) {
       // htmlString += selecTool(allBatsmenTable[i]).html();

        let allRows = selecTool(allBatsmenTable[i]).find("tr"); // -> data of batsman

        for (let i = 0; i < allRows.length; i++) {
            //Check to see if any of the matched elements have the given className
            let row = selecTool(allRows[i]);
            let firstColumnOfRow = row.find("td")[0];
            if(selecTool(firstColumnOfRow).hasClass("batsman-cell")){
                //will be getting valid data
                // name | runs | balls | 4's | 6's | sr
                let playerName = selecTool(row.find("td")[0]).text(); //player name
                //console.log(playerName);

                
                let runs = selecTool(row.find("td")[2]).text();
                let balls = selecTool(row.find("td")[3]).text();
                let numberOf4 = selecTool(row.find("td")[5]).text();
                let numberOf6 = selecTool(row.find("td")[6]).text();
                let sr = selecTool(row.find("td")[7]).text();

                 console.log(
                     `Player Name -> ${playerName} 
                     Runs Scored -> ${runs} 
                     Balls Played -> ${balls} 
                     Fours Scored -> ${numberOf4} 
                     Sixs Scored -> ${numberOf6}`
                 );

                 processInformation(
                    dateOfMatch,
                    venueOfMatch,
                    matchResult,
                    team1,
                    team2playerName,
                    runs,
                    balls,
                    numberOf4,
                    numberOf6,
                    sr
                 );
            

            }
            
        }
        
    }

    function processInformation(dateOfMatch,venueOfMatch,matchResult,team1,team2playerName,runs, balls,numberOf4,numberOf6,sr){
           
        let teamNamePath = path.join(__dirname, "IPL", team1);
        if(!FileSystem.existsSync(teamNamePath)){
            fs.mkdirSync(teamNamePath);
        }

        let playerPath = path.join(teamNamePath, playerName+".xlsx");
        let content = excelReader(playerPath,playerName);

        let playerObj = {
            dateOfMatch,
            venueOfMatch,
            matchResult,
            team1,
            team2playerName,
            runs,
            balls,
            numberOf4,
            numberOf6,
            sr
        };

        content.push(playerObj);
        excelWriter(playerPath,content,playerName);
      }
    
}


function excelReader(playerPath,playerName){
    if(!fs.existsSync(playerPath)){
        return [];
    }
}

function excelWriter(playerPath,jsObject,sheetName) {
    //creates new workbook

    let newWorkBook = xlsx.utils.book_new();
    //converts an array of js object to worksheet
    let newWorkSheet = xlsx.utils.json_to_sheet(jsObject);
    //it appends a worksheet to a workbook
    xlsx.utils.book_append_sheet(newWorkBook, newWorkSheet,sheetName);

    xlsx.writeFile(newWorkBook,playerPath);
}

//visit every scorecard and get info 
module.exports = {
    gifs:getInfoFromScorecard
}
    
