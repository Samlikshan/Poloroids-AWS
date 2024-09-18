const Offer = require("../../models/offerModel");
const Brand = require('../../models/brandModel')
const Product = require('../../models/productModel')

const viewOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate('typeId').sort({createdAt:-1});
    const Brands = await Brand.find();
    const Products = await Product.find();
    res.render("admin/offers", { offers ,Brands ,Products});
  } catch (error) {
    console.log("error listing offers", error);
  }
};

const addOffer = async (req, res) => {
  try {
    const {
      offerType,
      typeId,
      discountPercentage,
      validFrom,
      validTo,
    } = req.body.data;
    let { status } = req.body.data
    status = status === "active";
    const existOffer = await Offer.findOne({
      offerType: offerType,
      typeId:typeId
    });
    
    if(existOffer){
      return res.status(409).json({ message: 'Offer already exists.' });
    }
    await  Offer.create({
        offerType,
      typeId,
      discountPercentage,
      validFrom,
      validTo,
      status
    })
    res.status(200).json('offer added successfully')
  } catch (error) {
    console.log("error adding offer", error);
  }
};

const getEditOffer = async (req, res) => {
  try {
    const offerId = req.params.offerId
    const offer = await Offer.findById(offerId)
    res.json(offer)
  } catch (error) {
    console.log("error editing offer", error);
  }
};

const postEditOffer = async (req, res) => {
  try {
    const {
      offerId,
      offerType,
      typeId,
      discountPercentage,
      validFrom,
      validTo,
    } = req.body.data;
    let { status } = req.body.data
    status = status === "active";

    await  Offer.updateOne({
      _id:offerId
    },{
      offerType,
    typeId,
    discountPercentage,
    validFrom,
    validTo,
    status
  })
  res.status(200).json('offer updated succesfully')
  } catch (error) {
    console.log("error editing offer", error);
  }
};

const deleteOffer = async (req, res) => {
  try {
    const { offerId } = req.body
    await Offer.deleteOne({_id:offerId})
  } catch (error) {
    console.log("error deleting offer", error);
  }
};

module.exports = {
  viewOffers,
  addOffer,
  getEditOffer,
  postEditOffer,
  deleteOffer,
};
