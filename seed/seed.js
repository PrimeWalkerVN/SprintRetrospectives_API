const Board = require('../models/board');
const mongoose = require('mongoose');

const mongoDb = 'mongodb://localhost:27017/SprintRetrospective';

function exit() {
  mongoose.disconnect();
  console.log('exit'); // saved!
}
let done = 0;

mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true });

const boards = [
  new Board({
    name: 'The 1',
  }),
  new Board({
    name: 'The 2',
  }),
];

for (let i = 0; i < boards.length; i++) {
  // Save the new model instance, passing a callback
  boards[i].save(function (err, result) {
    done++;
    if (done === boards.length) exit();
  });
}
done = 0;
