const express = require('express')
const app = express()

app.use('/static', express.static(__dirname + '/public/static'));
app.use('/fonts', express.static(__dirname + '/public/fonts'));
app.use('/img', express.static(__dirname + '/public/img'));

app.use((_, res) => res.sendFile(`${__dirname}/public/index.html`))

app.listen(3000, () => {
    console.log(`Example app listening on port http://localhost:3000/`);
})