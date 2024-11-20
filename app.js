const express = require('express');
const path = require('path');
const app = express();
const routes = require('./routes');

app.use(express.static(path.join(__dirname, 'view')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));

});

app.use(express.json());

app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
