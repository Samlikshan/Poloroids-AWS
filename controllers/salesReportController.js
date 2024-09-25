const pdf = require('html-pdf');
const path = require('path');
const exphbs = require('express-handlebars');
const Orders = require('../models/orderModel');
const moment = require('moment');
const hbs = exphbs.create(); 
const ExcelJS = require('exceljs');

const getSalesReport = async (req, res) => {
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
        res.render('admin/salesReport', { orders, salesCount, totalAmount, discountedAmount });
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


const generateExcelReport = async (req, res) => {
    try {
        const { filter, startDate, endDate } = req.query;
        let start, end;

        // Set the date ranges based on the filter or custom date range
        if (startDate && endDate) {
            start = moment(startDate).startOf('day');
            end = moment(endDate).endOf('day');
        } else if (filter == 'weekly') {
            start = moment().startOf('isoWeek');
            end = moment().endOf('isoWeek');
        } else if (filter == 'monthly') {
            start = moment().startOf('month');
            end = moment().endOf('month');
        } else if (filter == 'yearly') {
            start = moment().startOf('year');
            end = moment().endOf('year');
        } else {
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

        // Create a new Excel workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales Report');

        // Add the title and summary section
        worksheet.addRow(['Sales Report']);
        worksheet.addRow([]); // Empty row for spacing
        worksheet.addRow(['Sales Count:', salesCount]);
        worksheet.addRow(['Total Amount:', totalAmount]);
        worksheet.addRow(['Total Discount:', discountedAmount]);
        worksheet.addRow([]); // Empty row for spacing

        // Add the header row for the table
        worksheet.addRow(['Date', 'Order ID', 'Customer', 'Status', 'Payment Method', 'Quantity', 'Total']);

        // Add data rows
        orders.forEach(order => {
            order.items.forEach(item => {
                worksheet.addRow([
                    order.createdAt.toISOString().split('T')[0],  // Format date as YYYY-MM-DD
                    order._id.toString(),
                    order.address.firstName,
                    order.orderStatus,
                    order.paymentMethod,
                    item.quantity,
                    item.totalPrice
                ]);
            });
        });

        // Set headers for the Excel file download
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="sales_report.xlsx"');

        // Write the workbook to the response stream
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Error generating Excel report:', error);
        res.status(500).send('Error generating Excel report');
    }
};



module.exports = {getSalesReport,generatePDFReport,generateExcelReport};

