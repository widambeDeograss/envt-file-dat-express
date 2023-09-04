import Event from '../../models/event';
import User from '../../models/user';
import server from '../../index';
import Utils from '../utils';

describe('Event', () => {
  let eventCreator;
  let subscribingUser;
  let eventlessUser;
  let eventId;

  before(() => {
    return Promise.all([
      Event.remove({}),
      User.remove({})
    ]);
  });

  before(() => {
    return Utils.getUserAndToken().spread((user, session: any) => {
      eventCreator = user;
      eventCreator._token = session.token;
    });
  });

  before(() => {
    return Utils.createUserAndToken({ username: 'subscriber', password: 'foobar' }).spread((user) => {
      subscribingUser = user;
    });
  });

  before(() => {
    return Utils.createUserAndToken({ username: 'noevents', password: 'foobar' }).spread((user) => {
      eventlessUser = user;
    });
  });

  describe('POST Event', () => {
    it('should return an Event object with a valid payload', () => {
      let event = new Event({
        _creator: eventCreator._id,
        title: 'Test Title',
        description: 'Description',
        city: 'Atlanta',
        state: 'GA',
        startTime: '2017-04-01T19:00:00.000Z',
        endTime: '2017-04-01T20:00:00.000Z',
        suggestLocations: false
      });

      return chai.request(server)
        .post('/api/events')
        .set('Authorization', eventCreator._token)
        .send(event)
        .then((res) => {
          res.should.have.status(200);
          res.body._creator.should.equal(eventCreator._id);
          res.body.members.should.contain(eventCreator._id);
          eventId = res.body._id;
        });
    });

    it('should return a 500 with an invalid payload', () => {
      let event = new Event({});

      return chai.request(server)
        .post('/api/events')
        .set('Authorization', eventCreator._token)
        .send(event)
        .catch((err) => {
          err.should.have.status(500);
          err.response.body.message.should.equal('Event could not be created!');
        });
    });
  });

  describe('GET Event', () => {
    it('should return an event object with a valid id', () => {
      return chai.request(server)
        .get('/api/events/' + eventId)
        .then((res) => {
          res.should.have.status(200);
          res.body._id.should.equal(eventId);
        });
    });

    it('should return a 404 if an event cannot be found', () => {
      return chai.request(server)
        .get('/api/events/' + 12345)
        .catch((err) => {
          err.should.have.status(404);
          err.response.body.message.should.equal('This event does not exist.');
        });
    })
  });

  describe('GET Events for User', () => {
    it('should return a collection of events for a user who is subscribed to events', () => {
      return chai.request(server)
        .get('/api/events/user/' + eventCreator._id)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
          res.body[0].members.should.contain(eventCreator._id);
        });
    });

    it('should return a 404 for a user who isn\'t subscribed to events', () => {
      return chai.request(server)
        .get('/api/events/user/' + eventlessUser._id)
        .catch((err) => {
          err.should.have.status(204);
          err.response.body.should.have.property('resource');
          err.response.body.should.have.property('message');
        });
    });

    it('should return a 404 for a user that doesn\'t exist', () => {
      return chai.request(server)
        .get('/api/events/user/' + 12345)
        .catch((err) => {
          err.should.have.status(404);
          err.response.body.message.should.equal('This user does not exist.');
        });
    });
  });

  describe('GET all events', () => {
    it('should return a collection of all events', () => {
      return chai.request(server)
        .get('/api/events')
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.an('array');
        });
    });
  });

  describe('PATCH Update an Event', () => {
    it('should return a 200 if the event is succesfully updated', () => {
      let payload = {
        _creator: eventCreator._id,
        _id: eventId,
        title: 'Updated Test Title',
        description: 'Description',
        city: 'Atlanta',
        state: 'GA',
        startTime: '2017-04-01T19:00:00.000Z',
        endTime: '2017-04-01T20:00:00.000Z',
        suggestLocations: true
      };

      return chai.request(server)
        .patch('/api/events/' + payload._id)
        .set('Authorization', eventCreator._token)
        .send(payload)
        .then((res) => {
          res.should.have.status(200);
          res.body.title.should.equal('Updated Test Title');
          res.body.suggestLocations.should.equal(true);
        });
    });

    it('should return a 500 if the event cannot be updated', () => {
      let payload = { _id: eventId };

      return chai.request(server)
        .patch('/api/events/' + payload._id)
        .set('Authorization', eventCreator._token)
        .send(payload)
        .catch((err) => {
          err.should.have.status(500);
          err.response.body.message.should.equal('Event could not be updated!');
        });
    });

    it('should return a 500 if the event cannot be found', () => {
      let payload = { _id: 1234 };

      return chai.request(server)
        .patch('/api/events/' + payload._id)
        .set('Authorization', eventCreator._token)
        .send(payload)
        .catch((err) => {
          err.should.have.status(500);
          err.response.body.message.should.equal('Event does not exist!');
        });
    });
  });

  describe('PATCH Subscribe to an Event', () => {
    it('should return a 404 if an event cannot be found', () => {
      let payload = { user: subscribingUser._id };

      return chai.request(server)
        .patch('/api/events/' + 12345 + '/subscribe')
        .set('Authorization', eventCreator._token)
        .send(payload)
        .catch((err) => {
          err.should.have.status(404);
          err.response.body.message.should.equal('This event does not exist!');
        });
    });

    it('should return a 400 if the event creator attempts to unsubscribe from the event', () => {
      let payload = { user: eventCreator._id };

      return chai.request(server)
        .patch('/api/events/' + eventId + '/subscribe')
        .set('Authorization', eventCreator._token)
        .send(payload)
        .catch((err) => {
          err.should.have.status(400);
          err.response.body.message.should.equal('You cannot unsubscribe from your own event.');
        });
    });

    it('should return a 200 if the user is successfully subscribed to the event', () => {
      let payload = { user: subscribingUser._id };

      return chai.request(server)
        .patch('/api/events/' + eventId + '/subscribe')
        .set('Authorization', eventCreator._token)
        .send(payload)
        .then((res) => {
          res.should.have.status(200);
          res.body.members.length.should.equal(2);
          res.body.members[1]._id.should.equal(subscribingUser._id);
        });
    });

    it('should return a 200 if the user is successfully unsubscribed from the event', () => {
      let payload = { user: subscribingUser._id };

      return chai.request(server)
        .patch('/api/events/' + eventId + '/subscribe')
        .set('Authorization', eventCreator._token)
        .send(payload)
        .then((res) => {
          res.should.have.status(200);
          res.body.members.length.should.equal(1);
        });
    });
  });

  after(() => {
    return Promise.all([
      Event.remove({}),
      User.remove({})
    ]);
  });
});
