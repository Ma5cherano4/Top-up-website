const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files directly from the ROOT directory
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'J4X SHOPS Backend Active' });
});

// Serve index.html from the root folder
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`J4X SHOPS server running on port ${PORT}`);
});
