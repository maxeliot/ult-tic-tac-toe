const express = require('express');
const { readFile } = require('fs').promises;


const app = express();


app.get('/', async (request, response) => {
    // readFile("./index.html", "utf-8", (err, html) => {
    //     if(err) {
    //         response.status(500).send("sorry");
    //     }

    //     response.send(html);
    // });

    response.send( await readFile("./index.html", "utf-8"));
});

app.use(express.static("."));
app.listen(process.env.PORT || 3000, () => console.log("App available on http://localhost:3000"));