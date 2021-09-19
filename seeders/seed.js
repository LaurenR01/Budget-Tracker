const mongoose = require('mongoose');
const db = require('../models/transaction');

mongoose.connect("mongodb://localhost/transaction", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const transactions = [
{
    name: 'Starting Balance',
    value: 1000,
}
];

db.Transaction.deleteMany({});

db.Transaction.deleteMany({})
    .then(() => db.Transaction.collection.insertMany(transactions))
    .then((data) => {
        console.log(data.result.n + 'records inserted');
        process.exit(0);
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);    
    })