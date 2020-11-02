const seeder = require('mongoose-seed');
const faker = require('faker');

let items = [];
for (i = 0; i < 15; i++) {
  items.push({
    username: faker.internet.userName() + i,
    password: '123456',
    email: faker.internet.email(),
    fullName: faker.internet.userName(),
  });
}

let data = [
  {
    model: 'User',
    documents: items,
  },
];

// connect mongodb
seeder.connect(
  'mongodb+srv://guest:guest123@cluster0.2c3f8.mongodb.net/SprintRetrospective?retryWrites=true&w=majority',
  function () {
    seeder.loadModels([
      '../models/User.js', // load mongoose model
    ]);
    seeder.clearModels(['User'], function () {
      seeder.populateModels(data, function () {
        seeder.disconnect();
      });
    });
  }
);
