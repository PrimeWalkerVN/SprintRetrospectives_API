const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const seeder = require('mongoose-seed');
const async = require('async');
const List = require('../models/List');
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
        List.find({}).exec((err, user_ids) => {
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
          content: faker.lorem.text(),
          listId: _.sample(results[0])._id,
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
            model: 'Card',
            documents: items,
          },
        ];
        seeder.loadModels(['../models/Card.js']);
        seeder.clearModels(['Card'], function () {
          seeder.populateModels(data, function () {
            seeder.disconnect();
          });
        });
      }
    );
  });
