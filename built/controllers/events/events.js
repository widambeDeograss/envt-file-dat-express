"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_1 = require("../../models/event");
function create(req, res) {
    var event = new event_1.default({
        _creator: req.body._creator,
        title: req.body.title,
        description: req.body.description,
        city: req.body.city,
        state: req.body.state,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        suggestLocations: req.body.suggestLocations,
        members: [req.body._creator]
    });
    event.save()
        .then(function (event) {
        res.status(200).json(event);
    })
        .catch(function (err) {
        res.status(500).json({ message: 'Event could not be created!' });
    });
}
function get(req, res) {
    event_1.default.findOne({ _id: req.params.id })
        .populate('members')
        .exec()
        .then(function (event) {
        res.status(200).json(event);
    })
        .catch(function (err) {
        if (err.name === 'CastError') {
            res.status(404).json({ message: 'This event does not exist.' });
        }
        else {
            res.status(404).json(err);
        }
    });
}
function getEventsForUser(req, res) {
    event_1.default.find({ members: req.params.id })
        .exec()
        .then(function (events) {
        if (!events.length) {
            res.status(204).json({ resource: 'events', message: 'This user is not a member of any events.' });
        }
        else {
            res.status(200).json(events);
        }
    })
        .catch(function (err) {
        if (err.name === 'CastError') {
            res.status(404).json({ message: 'This user does not exist.' });
        }
        else {
            res.status(500).json({ message: 'Something went wrong!' });
        }
    });
}
function all(req, res) {
    event_1.default.find({})
        .exec()
        .then(function (events) {
        res.status(200).json(events);
    })
        .catch(function (err) {
        res.status(500).json({ message: 'Something went wrong!' });
    });
}
function update(req, res) {
    event_1.default.findOne({ _id: req.params.id })
        .exec()
        .then(function (event) {
        event.title = req.body.title;
        event.description = req.body.description;
        event.city = req.body.city;
        event.state = req.body.state;
        event.startTime = req.body.startTime;
        event.endTime = req.body.endTime;
        event.suggestLocations = req.body.suggestLocations;
        event.save()
            .then(function (updatedEvent) {
            res.status(200).json(updatedEvent);
        })
            .catch(function (err) {
            res.status(500).json({ message: 'Event could not be updated!' });
        });
    })
        .catch(function (err) {
        res.status(500).json({ message: 'Event does not exist!' });
    });
}
function subscribe(req, res) {
    event_1.default.findOne({ _id: req.params.id })
        .exec()
        .then(function (event) {
        if (event._creator == req.body.user) {
            res.status(400).json({ message: 'You cannot unsubscribe from your own event.' });
        }
        else if (event.members.indexOf(req.body.user) === -1) {
            event.members.push(req.body.user);
            event.save()
                .then(function (result) {
                event_1.default.populate(result, { path: 'members' }).then(function (updatedEvent) {
                    res.status(200).json(updatedEvent);
                });
            })
                .catch(function (err) {
                res.status(500).json({ message: 'Something went wrong. Try again.' });
            });
        }
        else {
            var index = event.members.indexOf(req.body.user);
            event.members.splice(index, 1);
            event.save()
                .then(function (result) {
                event_1.default.populate(result, { path: 'members' }).then(function (updatedEvent) {
                    res.status(200).json(updatedEvent);
                });
            })
                .catch(function (err) {
                res.status(500).json({ message: 'Something went wrong. Try again.' });
            });
        }
    })
        .catch(function (err) {
        res.status(404).json({ message: 'This event does not exist!' });
    });
}
exports.default = { create: create, get: get, getEventsForUser: getEventsForUser, all: all, update: update, subscribe: subscribe };
