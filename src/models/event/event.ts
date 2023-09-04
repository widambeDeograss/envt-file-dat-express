import * as mongoose from 'mongoose';
import * as moment from 'moment';
const Schema = mongoose.Schema;

interface Event extends mongoose.Document {
  _creator: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  members: [mongoose.Schema.Types.ObjectId],
  city: String,
  state: String,
  startTime: Date | Number,
  endTime: Date | Number,
  suggestLocations: Boolean
}

const EventSchema = new mongoose.Schema({
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

EventSchema.pre('save', function(next) {
  if (moment(this.endTime).isBefore(moment(this.startTime))) {
    return next(new Error('Your start date must be before the end date.'));
  } else {
    return next();
  }
});

export default mongoose.model<Event>('Event', EventSchema);
