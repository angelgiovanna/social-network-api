const { User, Thought } = require('../models');

const thoughtController = {
    getAllThought(req, res) {
        Thought.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .sort({ createdAt: -1 })
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            res.status(400).json(err);
        });
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .then((dbUserData) => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No thought found by that id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    },

    addThought({ params, body }, res) {
        console.log(params);
        Thought.create(body)
        .then((_id) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id} },
                { new: true }
            );
        })
        .then((dbUserData) => {
            console.log(dbUserData);
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId}, body, { new: true, runValidators: true })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.status(400).json(err))
    },

    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
        .then((deletedThought) => {
           if (!deletedThought) {
            return res.status(404).json({ message: 'No thought with this id found!' });
           } 
           User.findOneAndUpdate(
            { username: deletedThought.username},
            { $pull: { thoughts: params.thoughtId } },
            { new: true }
           ).then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user with this id found!'});
                return;
            }
            res.json(dbUserData);
           })
        })
        .catch(err => res.json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user was found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
    },

    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: {reactionId: params.reactionId } } },
            {new: true }
        )
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.json(err));
    },
};

module.exports = thoughtController;