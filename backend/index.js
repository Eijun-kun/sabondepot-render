const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const middleware = require('./middlewares/middleware');
const path = require('path');

dotenv.config({ path: './.env' });
const app = express();

// Load cron jobs
require('./cronJobs/dailyInventoryReport');

// Middleware
app.use(middleware);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    })
    .then(() => console.log('Database connected successfully'))
    .catch((error) => console.error('Database connection failed:', error));

// Additional MongoDB connection event handlers
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination');
    process.exit(0);
});

// Routes - Customer
app.use('/customerAuth', require('./routers/CustomerRouters/CustomerAuthRouter'));
app.use('/customerProduct', require('./routers/CustomerRouters/CustomerProductRouter'));
app.use('/customerCart', require('./routers/CustomerRouters/CustomerCartRouter'));
app.use('/customerOrder', require('./routers/CustomerRouters/CustomerOrderRouter'));
app.use('/customerNotification', require('./routers/CustomerRouters/CustomerNotificationRouter'));

// Routes - Staff
app.use('/staffAuth', require('./routers/StaffRouters/StaffAuthRouters'));
app.use('/staffProduct', require('./routers/StaffRouters/StaffProductRouters'));
app.use('/staffOrders', require('./routers/StaffRouters/StaffOrdersRouter'));
app.use('/staffOrderWalkin', require('./routers/StaffRouters/StaffOrdersWalkinRouter'));
app.use('/staffOrderRefill', require('./routers/StaffRouters/StaffOrdersRefillRouter'));
app.use('/staffCart', require('./routers/StaffRouters/StaffCartRouter'));
app.use('/staffOrderOverview', require('./routers/StaffRouters/StaffOrderOverviewRouter'));
app.use('/staffAccounts', require('./routers/StaffRouters/StaffAccountsRouter'));
app.use('/staffNotifications', require('./routers/StaffRouters/StaffNotificationRouter'));

// Routes - Admin
app.use('/adminAuth', require('./routers/AdminRouters/AdminAuthRouter'));
app.use('/adminProduct', require('./routers/AdminRouters/AdminProductRouter'));
app.use('/adminOrders', require('./routers/AdminRouters/AdminOrdersRouter'));
app.use('/adminAccounts', require('./routers/AdminRouters/AdminAccountsRouter'));
app.use('/adminReports', require('./routers/AdminRouters/AdminReportRouter'));
app.use('/adminOrderOverview', require('./routers/AdminRouters/AdminOrderOverviewRouter'));
app.use('/adminWorkinProgressProduct', require('./routers/AdminRouters/AdminWorkinProgressRouter'));

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Server
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
