const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Resource = require('../models/Resource');

// @route   GET /api/resources
// @desc    Get all resources
// @access  Public (for students to view)
router.get('/', async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.json(resources);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/resources
// @desc    Create a new resource
// @access  Private (Admin Only)
router.post('/', adminAuth, async (req, res) => {
    const { title, type, category, content } = req.body;
    try {
        const newResource = new Resource({ title, type, category, content });
        const resource = await newResource.save();
        res.json(resource);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/resources/:id
// @desc    Update a resource
// @access  Private (Admin Only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(resource);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/resources/:id
// @desc    Delete a resource
// @access  Private (Admin Only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Resource deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;