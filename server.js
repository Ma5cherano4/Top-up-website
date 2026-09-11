const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files (index.html, CSS, client-side JS)
app.use(express.static(path.join(__dirname, 'public')));

// Port setup for Render
const PORT = process.env.PORT || 3000;

// API Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'J4X SHOPS Backend Active' });
});

// Paystack Webhook endpoint (Listens for automatic payment confirmations)
app.post('/api/webhook/paystack', async (req, res) => {
    const event = req.body;

    // Verify successful payment event from Paystack
    if (event.event === 'charge.success') {
        const data = event.data;
        const metadata = data.metadata || {};

        const playerId = metadata.player_id;
        const game = metadata.game;
        const packageId = metadata.package_id;
        const amountPaid = data.amount / 100; // Paystack sends kobo, convert to NGN

        console.log(`[PAYMENT VERIFIED] Game: ${game} | Player ID: ${playerId} | Amount: ₦${amountPaid}`);

        // Trigger automatic game distributor top-up API (e.g., Reloadly / UniPin / SmileOne)
        try {
            /* 
            Example top-up integration:
            await axios.post('https://api.distributor.com/v1/topup', {
                player_id: playerId,
                package_id: packageId
            }, {
                headers: { 'Authorization': `Bearer ${process.env.DISTRIBUTOR_API_KEY}` }
            });
            */
            
            return res.status(200).send('Top-up processed successfully');
        } catch (error) {
            console.error('Top-up execution failed:', error.message);
            return res.status(500).send('Top-up API error');
        }
    }

    res.status(200).send('Event received');
});

// Serve frontend fallback for SPA routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`J4X SHOPS server is running on port ${PORT}`);
});
