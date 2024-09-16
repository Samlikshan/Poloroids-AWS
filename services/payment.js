const Razorpay = require('razorpay')
const path = require('path');
const fs = require('fs');


const razorpay = new Razorpay({
    key_id:process.env.PAYMENT_KEY_ID,
    key_secret:process.env.PAYMENT_KEY_SECRET
});


// Function to read data from JSON file
const readData = () => {
    if (fs.existsSync('orders.json')) {
      const data = fs.readFileSync('orders.json');
      return JSON.parse(data);
    }
    return [];
  };
  
  // Function to write data to JSON file
  const writeData = (data) => {
    fs.writeFileSync('orders.json', JSON.stringify(data, null, 2));
  };
  
  // Initialize orders.json if it doesn't exist
  if (!fs.existsSync('orders.json')) {
    writeData([]);
  }
  

module.exports = {razorpay,readData,writeData}