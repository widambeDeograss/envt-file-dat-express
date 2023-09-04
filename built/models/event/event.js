"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var moment = require("moment");
var Schema = mongoose.Schema;
var EventSchema = new mongoose.Schema({
    _creator: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    city: { type: String, required: true },
    state: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    suggestLocations: { type: Boolean, default: false }
}, { usePushEach: true });
EventSchema.pre('save', function (next) {
    if (moment(this.endTime).isBefore(moment(this.startTime))) {
        return next(new Error('Your start date must be before the end date.'));
    }
    else {
        return next();
    }
});
exports.default = mongoose.model('Event', EventSchema);
