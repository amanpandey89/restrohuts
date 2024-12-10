const mongoose = require('mongoose');

const FoodMenuSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  category: { type: String },
  mainImage: { type: String },
  multipleImage: { type: String },
  price: { type: Number, required: true },
  type: { type: String }, // e.g., "Veg", "Non-Veg"
  customizations: [
    {
      name: { type: String, required: true }, // e.g., "Size", "Extra Cheese"
      options: [
        {
          label: { type: String, required: true }, // e.g., "Small", "Large", "Yes"
          additionalPrice: { type: Number, default: 0 }, // Additional cost for this option
        },
      ],
    }
  ]
});

module.exports = mongoose.model('FoodMenu', FoodMenuSchema);