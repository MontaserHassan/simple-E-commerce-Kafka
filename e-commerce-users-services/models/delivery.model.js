const mongoose = require('mongoose');


const deliverySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        received: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true
    }
);


const Delivery = mongoose.model('Delivery', deliverySchema);



module.exports = {
    Delivery
};