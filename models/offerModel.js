const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    offerType: {
        type: String,
        required: true,
        // enum: ['product', 'brand']
    },
    typeId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        refPath: 'offerType'
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    validFrom: {
        type: Date,
        required: true,
    },
    validTo: {
        type: Date,
        required: true,
        index:{expireAfterSeconds: 0}
    },
    status: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer
