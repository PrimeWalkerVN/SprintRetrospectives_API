const seeder = require('mongoose-seed');
const faker = require('faker');

const unique = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
];
let items = [];
for (i = 0; i < 15; i++) {
  items.push({
    username: faker.internet.userName() + unique[i],
    password: '123456',
    email: faker.internet.email(),
  });
}

let data = [
  {
    model: 'User',
    documents: items,
  },
];

// connect mongodb
seeder.connect('mongodb://localhost:27017/SprintRetrospective', function () {
  seeder.loadModels([
    '../models/User.js', // load mongoose model
  ]);
  seeder.clearModels(['User'], function () {
    seeder.populateModels(data, function () {
      seeder.disconnect();
    });
  });
});
