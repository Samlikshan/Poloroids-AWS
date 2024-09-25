const Orders = require("../../models/orderModel");
const moment = require("moment");


const getDashboard = async (req, res) => {
    try {
        // Step 1: Get the most sold product
        let topProduct = await Orders.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    // productName: { $first: "$items.productName" },
                    quantity: { $sum: "$items.quantity" },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $sort: { quantity: -1 } },

        ]);
    
        // Step 2: Get total sales by brand
        let brandSales = await Orders.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    quantity: { $sum: "$items.quantity" },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: "$productDetails.brand",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            { $sort: { totalQuantity: -1 } },
        ]);
        let typeSales = await Orders.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    quantity: { $sum: "$items.quantity" },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails",
                },
            },
            { $unwind: "$productDetails" },
            {
                $group: {
                    _id: "$productDetails.type",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            { $sort: { totalQuantity: -1 } },
        ]);
        res.render("admin/dashboard", {
            topProduct,
            brandSales,
            typeSales
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }  
};
const getSalesData = async (req, res) => {
    const { filter } = req.query;

    try {
        // Set the date range for the current filter
        let startDate, endDate;

        if (filter === "weekly") {
            endDate = moment().toDate();
            startDate = moment().subtract(6, 'days').toDate(); // Last 7 days
        } else if (filter === "monthly") {
            endDate = moment().toDate();
            startDate = moment().subtract(1, 'months').startOf('month').toDate(); // Last month
        } else if (filter === "yearly") {
            endDate = moment().toDate();
            startDate = moment().subtract(5, 'years').startOf('year').toDate(); // Last 5 years
        } else {
            endDate = moment().toDate();
            startDate = moment().startOf('day').toDate(); // Default to today
        }

        // Log the date range for debugging
        console.log(`Fetching orders from ${startDate} to ${endDate}`);

        // Fetch orders within the date range
        const orders = await Orders.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
        }).sort({ createdAt: -1 }); // Sort in descending order

        // Log the fetched orders

        // Return the orders to the front end for filtering
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getSalesData,
};




module.exports = {
  getDashboard,
  getSalesData
};
