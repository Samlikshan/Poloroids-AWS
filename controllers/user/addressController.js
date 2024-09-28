const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");

const viewAddress = async (req, res) => {
  try {
    const token = req.cookies["Token"];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    let addresses = await User.findOne(
      { username: decoded.username },
      { address: 1, _id: 0 }
    );
    res.render("user/address", { addresses });
    // res.json({addresses})
  } catch (error) {
    console.log(error);
  }
};

const fetchAddress = async (req, res) => {
  try {
    const token = req.cookies["Token"];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    let addresses = await User.findOne(
      { username: decoded.username },
      { address: 1, _id: 0 }
    );
    res.json({ addresses });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addAddress = async (req, res) => {
  console.log(req.body);
  const {
    firstName,
    lastName,
    address,
    city,
    state,
    country,
    company,
    pincode,
    phoneNumber,
    email,
    addressType,
  } = req.body;
  const token = req.cookies["Token"];
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({
    $or: [{ username: decoded.username }, { email: decoded.email }],
    isActive: true,
  });

  console.log(decoded);
  console.log(user);
  try {
    if (user) {
      await User.updateOne(
        { _id: user._id },
        {
          $push: {
            address: {
              firstName: firstName,
              lastName: lastName,
              address: address,
              city: city,
              state: state,
              country: country,
              company: company,
              pincode: pincode,
              phoneNumber: phoneNumber,
              email: email,
              addressType: addressType,
            },
          },
          $set: { updatedAt: Date.now() },
        }
      );
      res.status(200).json({ message: "Address added successfully" });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateAddress = async (req, res) => {
  try {

    const token = req.cookies["Token"];
    if (!token) {
      return res.redirect("/auth/login");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ username: decoded.username });
    await User.updateOne(
      { _id: user._id, "address._id": req.body.id },
      {
        $set: {
          "address.$.firstName": req.body.firstName,
          "address.$.lastName": req.body.lastName,
          "address.$.company": req.body.company,
          "address.$.address": req.body.address,
          "address.$.city": req.body.city,
          "address.$.state": req.body.state,
          "address.$.country": req.body.country,
          "address.$.phoneNumber": req.body.phoneNumber,
          "address.$.email": req.body.email,
          "address.$.pincode": req.body.pincode,
          "address.$.addressType": req.body.addressType,
        },
      }
    );
    res.status(200).json({message:'Address updated Successfully'})
  } catch (error) {
    console.log(error, "error updating address");
  }
};

const deleteAddress = async (req, res) => {
  try {
    const addressId = req.body.addressId;
    const token = req.cookies["Token"];
    if (!token) {
      return res.redirect("/auth/login");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ username: decoded.username });
    await User.updateOne(
      { _id: user._id },
      { $pull: { address: { _id: addressId } } }
    );
    res.status(200).json({ message: "address deleted succssfully" });
  } catch (error) {
    console.log("error while deleting address", error);
  }
};

const availableAdderss = async(req,res) => {
  const { addressId } = req.params; // Extract addressId and userId from the request parameters

  try {
    const token = req.cookies["Token"];
    if (!token) {
      return res.redirect("/auth/login");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ username: decoded.username });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the specified addressId exists in the user's addresses
    const addressExists = user.address.some(address => address._id.toString() === addressId);
    
    return res.status(200).json({ exists: addressExists });
  } catch (error) {
    console.error("Error checking address availability:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  addAddress,
  fetchAddress,
  viewAddress,
  updateAddress,
  deleteAddress,
  availableAdderss
};
