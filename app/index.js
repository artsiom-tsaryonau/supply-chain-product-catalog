const express = require('express');

const app = express();
const port = 8080;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Supply management ver 1.0');
});
app.get('/health', (req, res) => {
    // query supply chain application
    if (200) {
        res.send('Supply chain is healthy!');
    } else {
        res.send('Supply chain is down!');
    }
})

app.listen(port, () => console.log(`Applicationn started on ${port}!`));

module.exports = app;