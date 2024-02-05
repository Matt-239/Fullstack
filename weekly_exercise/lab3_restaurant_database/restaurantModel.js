const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    address: {
        building: String,
        street: String,
        zipcode: String
    },
    cuisines: String,
    name: String,
    city: String,
    restaurant_id: Number
});

module.exports = mongoose.model('Restaurant', restaurantSchema);