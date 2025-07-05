const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");
const Type = require("../models/typeModel");
const Gear = require("../models/gearModel");

const showProducts = async (req, res) => {
  const searchQuery = req.query.q || "";
  const isAjax = req.headers["x-requested-with"] === "fetch";

  let query = {};
  if (searchQuery) {
    query = {
      $or: [
        { productName: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } },
        { type: { $regex: searchQuery, $options: "i" } },
      ],
    };
  }

  const products = await Product.find(query).lean();
  if (isAjax) {
    return res.json({ products });
  }

  res.render("admin/products", { products });
};

const getEditProducts = async (req, res, next) => {
  let productId = req.params.id;
  let product = await Product.findById(productId);
  let brands = await Brand.find({ isActive: true });
  let types = await Type.find({ isActive: true });
  let gears = await Gear.find({ isActive: true });

  res.render("admin/editProduct", { product, brands, types, gears });
};

// const postEditProducts = async (req, res, next) => {
//     console.log(req.body);

//     let productId = req.params.id
//     let product = await Product.findById(productId)
//     let {productName,productDescription,price,Brand,Type,Gear,SensorSize,stock} = req.body
//     let productImages = req.files.map((files)=>files.path.replace("..\\Polaroids\\public", ''))
//     await Product.updateOne({_id:productId},{$set:{productName:productName,productDescription:productDescription,price:price,productImages:productImages,brand:Brand,type:Type,gear:Gear,sensorSize:SensorSize,stock,updatedAt:Date()}})
//     res.redirect('/admin/products')
// }

const postEditProducts = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    // Handle Main Image
    if (req.body.deleteMainImage) {
      product.mainImage = null;
    } else if (req.files.mainImage) {
      product.mainImage = req.files.mainImage[0].filename;
    }

    // Handle Additional Images
    for (let i = 0; i < product.additionalImages.length; i++) {
      if (req.body[`deleteImage${i}`]) {
        product.additionalImages.splice(i, 1);
      } else if (req.files[`replaceImage${i}`]) {
        product.additionalImages[i] = req.files[`replaceImage${i}`][0].filename;
      }
    }

    // Add New Additional Images
    if (req.files.newAdditionalImages) {
      req.files.newAdditionalImages.forEach((file) => {
        product.additionalImages.push(file.filename);
      });
    }

    // Update other product fields
    product.productName = req.body.productName;
    product.productDescription = req.body.productDescription;
    product.price = req.body.price;
    product.brand = req.body.Brand;
    product.type = req.body.Type;
    product.gear = req.body.Gear;
    product.stock = req.body.stock;
    product.updatedAt = Date.now();

    await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating product");
  }
};

const getAddProduct = async (req, res, next) => {
  // let category = await Category.find()
  let brands = await Brand.find({ isActive: true });
  let types = await Type.find({ isActive: true });
  let gears = await Gear.find({ isActive: true });
  res.render("admin/addProduct", { brands, types, gears });
};

// const postAddProduct = async (req,res,next) => {
//     console.log(req.body,req.fil);

//     try{
//         let {productName,productDescription,price,Brand,Type,Gear,SensorSize,stock} = req.body
//         let productImages = req.files.map((files)=>files.path.replace("..\\Polaroids\\public", ''))
//         await Product.create({productName:productName,productDescription:productDescription,price:price,productImages:productImages,brand:Brand,type:Type,gear:Gear,sensorSize:SensorSize,stock})
//         res.redirect('/admin/products')
//     }catch(err){
//         if(err.code == 11000){
//             console.log("product already exist")
//         }
//     }

// }

const postAddProduct = async (req, res, next) => {
  console.log(req.files, "images");
  try {
    const newProduct = new Product({
      productName: req.body.productName,
      productDescription: req.body.productDescription,
      price: req.body.price,
      brand: req.body.brand,
      type: req.body.type,
      gear: req.body.gear,
      stock: req.body.stock,
      mainImage: req.files.mainImage[0].filename,
      additionalImages: req.files.additionalImages.map((file) => file.filename),
    });

    await newProduct.save();
    res.redirect("/admin/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding product");
  }
};

const toggleProductAvailability = async (req, res) => {
  const id = req.params.id;
  const { availability } = req.body;

  try {
    await Product.updateOne({ _id: id }, { $set: { availability } });
    res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
};

module.exports = {
  showProducts,
  getEditProducts,
  postEditProducts,
  getAddProduct,
  postAddProduct,
  toggleProductAvailability,
};
