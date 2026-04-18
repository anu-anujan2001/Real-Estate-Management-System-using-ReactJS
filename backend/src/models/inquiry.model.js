const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
},
{ timestamps: true }
);


module.exports = mongoose.model("Inquiry", inquirySchema);