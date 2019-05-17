const fetch = require("node-fetch");
const fs = require("fs");
const CronJob = require('cron').CronJob;

const _API_PATH = "https://reqres.in/api/users?page="
const _FILE_PATH = "data.json";
async function scrape(){
    if(fs.existsSync(_FILE_PATH)){
        let fileData = JSON.parse(fs.readFileSync(_FILE_PATH));
        if (fileData.shouldTry){
            let pageIndex = fileData.pageIndex+1;
            let res = await fetch(_API_PATH+pageIndex);
            let resJson = await res.json()
            if (pageIndex >=resJson.total_pages){
                fileData.shouldTry=false;
            }
            fileData.pageIndex = pageIndex;
            fileData.data = fileData.data.concat(resJson.data);
            fs.writeFile(_FILE_PATH,JSON.stringify(fileData),(err)=>{
                if (err){
                    console.error(err);
                }
            })
        }
    }else{
        let pageIndex = 1;
        let res = await fetch(_API_PATH+pageIndex);
        let resJson = await res.json()
        let fileData = {pageIndex:pageIndex, shouldTry:true};
        if (pageIndex >=resJson.total_pages){
            fileData.shouldTry=false;
        }
        fileData.data = resJson.data;
        fs.writeFile(_FILE_PATH,JSON.stringify(fileData),(err)=>{
            if (err){
                console.error(err);
            }
        })
    }
    console.log("done");
}


new CronJob('* 1 * * * *', function() {
    console.log('You will see this message every minute');
    scrape();
  }, null, true, '');