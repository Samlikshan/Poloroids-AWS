const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");

const viewAddress = async (req, res) => {
  
  try {
    const token = req.cookies["Token"];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    let addresses = await User.findOne({username:decoded.username},{address:1,_id:0});
    res.render('user/address',{addresses})
    // res.json({addresses})
  } catch (error) {
    console.log(error);
  }
};

const fetchAddress =  async (req, res) => {
  try {
    const token = req.cookies["Token"];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    let addresses = await User.findOne({username:decoded.username},{address:1,_id:0});
    res.json({ addresses });
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
 

const addAddress = async (req, res) => {
  console.log(req.body)
  const {
    firstName,
    lastName,
    address,
    city,
    state,
    country,
    company,
    postalCode,
    phoneNumber,
    email,
    addressType,
  } = req.body;
  const token = req.cookies["Token"];
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({
    $or: [
      { username: decoded.username },
      { email: decoded.email }
    ],
    isActive: true
  });
  
  console.log(decoded)
  console.log(user)
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
              company:company ,
              postalCode: postalCode,
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
  
};

const deleteAddress = async(req,res) => {
 try{
  const addressId = req.body.addressId
  const token = req.cookies["Token"];
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const user = await User.findOne({username:decoded.username})
  await User.updateOne({_id:user._id},{$pull:{address:{_id:addressId}}})
  res.status(200).json({message:'address deleted succssfully'})
 }catch(error){
  console.log('error while deleting address',error)
 }
}

module.exports = {
  addAddress,
  fetchAddress,
  viewAddress,
  updateAddress,
  deleteAddress
};
