const express = require('express');
const mongoose = require('mongoose');
const Restaurant = require('./restaurantModel');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/restaurantDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/restaurants', async (req, res) => {
    const sortBy = req.query.sortBy || 'ASC';
    try {
        const restaurants = await Restaurant.find()
            .select('id cuisines name city restaurant_id')
            .sort({ restaurant_id: sortBy === 'ASC' ? 1 : -1});
        res.json(restaurants);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});

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

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
    const cuisine = req.params.cuisine;
    try {
        const restaurants = await Restaurant.find({cuisines: cuisine});
        res.json(restaurants);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

