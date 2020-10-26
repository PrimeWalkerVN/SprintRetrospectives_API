const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const seeder = require('mongoose-seed');
const async = require('async');
const Board = require('../models/Board');
const _ = require('lodash');
const faker = require('faker');

new Promise((resolve) => {
  mongoose.connect('mongodb://localhost:27017/SprintRetrospective', {
    promiseLibrary: require('bluebird'),
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  async.parallel(
    [
      (callback) => {
        Board.find({}).exec((err, user_ids) => {
          callback(null, user_ids);
        });
      },
    ],
    (err, results) => {
      resolve(results);
      mongoose.connection.close();
    }
  );
})
  .then((results) => {
    return new Promise((resolve) => {
      let items = [];
      for (i = 0; i < 20; i++) {
        items.push({
          name: faker.name.jobTitle(),
          boardId: _.sample(results[0])._id,
          cards: [],
        });
      }
      resolve(items);
    });
  })
  .then((items) => {
    seeder.connect(
      'mongodb://localhost:27017/SprintRetrospective',
      function () {
        let data = [
          {
            model: 'List',
            documents: items,
          },
        ];
        seeder.loadModels(['../models/List.js']);
        seeder.clearModels(['List'], function () {
          seeder.populateModels(data, function () {
            seeder.disconnect();
          });
        });
      }
    );
  });
