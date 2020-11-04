const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const seeder = require('mongoose-seed');
const async = require('async');
const Board = require('../models/Board');
const _ = require('lodash');
const faker = require('faker');

new Promise((resolve) => {
  mongoose.connect(
    'mongodb+srv://guest:guest123@cluster0.2c3f8.mongodb.net/SprintRetrospective?retryWrites=true&w=majority',
    {
      promiseLibrary: require('bluebird'),
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
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
      for (i = 0; i < 3; i++) {
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
      'mongodb+srv://guest:guest123@cluster0.2c3f8.mongodb.net/SprintRetrospective?retryWrites=true&w=majority',
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
