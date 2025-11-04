const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const CommunityPost = require('../models/CommunityPost');

// @route   GET /api/posts
// @desc    Get all community posts
router.get('/', auth, async (req, res) => {
    try {
        const posts = await CommunityPost.find()
            .populate('author', 'name')
            .populate('replies.author', 'name')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', auth, async (req, res) => {
    try {
        const newPost = new CommunityPost({
            content: req.body.content,
            author: req.user.id,
            replies: [], // Start with an empty array of replies
        });
        const post = await newPost.save();
        await post.populate('author', 'name');
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/posts/reply/:id
// @desc    Reply to a post
router.post('/reply/:id', auth, async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        const newReply = {
            author: req.user.id,
            content: req.body.content,
        };
        post.replies.unshift(newReply);
        await post.save();
        
        // Populate and return the full post with all replies
        await post.populate('author', 'name');
        await post.populate('replies.author', 'name');
        res.json(post);
    } catch (err) {
        console.error("Reply Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/posts/:id (for Admins)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        await CommunityPost.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// REMOVED: The old '/react/:id' route has been deleted.

module.exports = router;