const express = require('express')
const app = express()
const handlers = require("./handlers/handlers");
const port = 3000
const fs = require("fs");

app.get('/api/user/:id', async (req, res) =>{
    let handle = await handlers.handleUserById(req.params.id);
    res.send(JSON.stringify(handle));
    return;
})

app.get('/api/user/:id/avatar', async (req, res) =>{
    let path = await handlers.handleImageRequest(req.params.id);
    let img = fs.readFileSync(path);
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
      });
      res.end(img);
})

app.delete('/api/user/:id/avatar', async(req, res)=>{
    try{
        await handlers.handleDeleteImage(req.params.id);
        res.send(JSON.stringify({"STATUS":"SUCCESS"}));
    }catch(e){
        console.error(e);
        res.send(JSON.stringify({"STATUS":"FAIL"}))
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))