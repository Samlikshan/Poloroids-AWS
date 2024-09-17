const pdf = require('html-pdf');
const path = require('path');
const exphbs = require('express-handlebars');
const Orders = require('../models/orderModel');
const moment = require('moment');
const hbs = exphbs.create(); 
const getDashboard = async (req, res) => {
    const { filter, startDate, endDate } = req.query; // get the filter and custom date range from the query
    let start, end;

    // Set date ranges based on filter or custom date range
    if (startDate && endDate) {
        start = moment(startDate).startOf('day');
        end = moment(endDate).endOf('day');
    } else if (filter == 'weekly') {

        start = moment().startOf('isoWeek'); // Set Monday as start of the week
        end = moment().endOf('isoWeek');     // Set Sunday as end of the week
        console.log("Week range:", start.format(), end.format()); // Debugging
    } else if (filter == 'monthly') {
        start = moment().startOf('month');
        end = moment().endOf('month');
        console.log("Month range:", start.format(), end.format()); // Debugging
    } else if (filter == 'yearly') {
        start = moment().startOf('year');
        end = moment().endOf('year');
        console.log("Year range:", start.format(), end.format()); // Debugging
    } else {
        // Default to today's data
        start = moment().startOf('day');
        end = moment().endOf('day');
    }

    // Query orders within the date range
    try {
        const orders = await Orders.find({
            createdAt: {
                $gte: start.toDate(),
                $lte: end.toDate()
            }
        });

        // Calculate sales count, total amount, and discounted amount
        let salesCount = 0;
        let totalAmount = 0;
        let discountedAmount = 0;

        orders.forEach(order => {
            salesCount += order.items.reduce((acc, item) => acc + item.quantity, 0); // total items sold
            totalAmount += parseFloat(order.finalPrice);
            discountedAmount += parseFloat(order.totalAmount) - parseFloat(order.finalPrice);
        });

        res.render('admin/dashboard', { orders, salesCount, totalAmount, discountedAmount });
    } catch (error) {
        console.error('Error querying orders:', error);
        res.status(500).send('Server Error');
    }
};

const generatePDFReport = async (req, res) => {
    try {
        const { filter, startDate, endDate } = req.query; // Get the filter and date range from the query
        let start, end;

        // Set the date ranges based on the filter or custom date range
        if (startDate && endDate) {
            start = moment(startDate).startOf('day');
            end = moment(endDate).endOf('day');
        } else if (filter == 'weekly') {
            start = moment().startOf('isoWeek'); // Monday start of the week
            end = moment().endOf('isoWeek');     // Sunday end of the week
        } else if (filter == 'monthly') {
            start = moment().startOf('month');
            end = moment().endOf('month');
        } else if (filter == 'yearly') {
            start = moment().startOf('year');
            end = moment().endOf('year');
        } else {
            // Default to today's data
            start = moment().startOf('day');
            end = moment().endOf('day');
        }

        // Query orders within the date range
        const orders = await Orders.find({
            createdAt: {
                $gte: start.toDate(),
                $lte: end.toDate()
            }
        });

        // Calculate sales count, total amount, and discounted amount
        let salesCount = 0;
        let totalAmount = 0;
        let discountedAmount = 0;

        orders.forEach(order => {
            salesCount += order.items.reduce((acc, item) => acc + item.quantity, 0); // total items sold
            totalAmount += parseFloat(order.finalPrice);
            discountedAmount += parseFloat(order.totalAmount) - parseFloat(order.finalPrice);
        });

        // Render HTML from Handlebars template
        res.render('admin/report', { orders, salesCount, totalAmount, discountedAmount }, (err, html) => {
            if (err) {
                return res.status(500).send('Error generating HTML for PDF');
            }

            // Generate PDF from the rendered HTML
            pdf.create(html).toStream((err, stream) => {
                if (err) {
                    return res.status(500).send('Error generating PDF');
                }
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
                stream.pipe(res); // Stream the PDF as a download
            });
        });

    } catch (error) {
        console.error('Error generating PDF report:', error);
        res.status(500).send('Error generating PDF report');
    }
};



module.exports = {getDashboard,generatePDFReport};

