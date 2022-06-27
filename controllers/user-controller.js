const { User } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .select('-__v')
        .sort({_id: -1 })
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    getUserById({ params}, res) {
        User.findOne({ _id: params.userId })
        .select('__v')
        .populate({
            path: 'friends',
        })
        .populate({
            path: 'thoughts',
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    addUser({ params, body }, res) {
        console.log(params);
        User.create(body)
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.status(400).json(err));
    },

    updateUser({ params, body}, res) {
        User.findOneAndUpdate(
            {_id: params.userId },
            { $set: body},
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    removeUser({ params }, res) {
        User.findOneAndDelete({ _id: params.userId })
        .then(dbUserData => {
            if (!dbUserData) {
                return res.status(404).json({ message: 'No user with this id found! '});
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
    },

    addFriend({ params, body }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId}},
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id found!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    removeFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => res.json(err));
    },
};

module.exports = userController;