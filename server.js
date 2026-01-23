const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from root

// API to save order
app.post('/api/save-order', (req, res) => {
    const items = req.body;
    if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    const fileContent = `window.portfolioItems = ${JSON.stringify(items, null, 4)};\n`;
    const filePath = path.join(__dirname, 'data', 'items.js');

    fs.writeFile(filePath, fileContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ error: 'Failed to save data' });
        }
        console.log('Data saved successfully to', filePath);
        res.json({ success: true, message: 'Ordering saved successfully!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Admin page: http://localhost:${PORT}/admin`);
});
