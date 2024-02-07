const express = require('express');
const mongoose = require('mongoose');
const Restaurant = require('./restaurantModel');

const app = express();
const PORT = 3000;

const mongodbURI = 'mongodb+srv://mprice239:FbaMOio4rVkizpRJ@cluster0.cbbhvr6.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => { console.log('Connected to MongoDB') }).catch(err => console.log(err));

// GET all restaurants
app.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET all restaurants of type cuisine
app.get('/restaurants/cuisine/:style', async (req, res) => {
    try {
        const style = req.params.style;
        const restaurants = await Restaurant.find({cuisines: style});
        res.json(restaurants);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET all restaurants sorted by name
app.get('/restaurants', async (req, res) => {
    const sortBy = req.query.sortBy || 'ASC';
    try {
        const restaurants = await Restaurant.find()
        .select('id cuisines name city restaurant_id')
        .sort({restaurant_id: sortBy === 'ASC' ? 1 : -1});
        res.json(restaurants);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// get restaurant by condition
app.get('/restaurants/:cuisine', async (req, res) => {
  const cuisine = req.params.cuisine;
  try {
    const restaurants = await Restaurant.find({
      cuisines: cuisine,
      city: { $ne: 'Brooklyn' }
    })
      .select('cuisines name city -id')
      .sort({ name: 1 });
    res.json(restaurants);
  } catch (error) {
    res.status(500).send(error.message);
  }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

