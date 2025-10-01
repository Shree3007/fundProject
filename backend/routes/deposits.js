const router = require('express').Router();
let Deposit = require('../models/deposit.model');

router.route('/').get((req, res) => {
  Deposit.find().populate('customer')
    .then(deposits => res.json(deposits))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const customer = req.body.customer;
  const week = Number(req.body.week);
  const amount = Number(req.body.amount);

  // Check for duplicate deposit for the same customer and week
  Deposit.findOne({ customer: customer, week: week })
    .then(existingDeposit => {
      if (existingDeposit) {
        return res.status(400).json('Error: Deposit for this customer and week already exists!');
      }

      const newDeposit = new Deposit({ customer, week, amount });

      newDeposit.save()
        .then(() => res.json('Deposit added!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Deposit.findById(req.params.id).populate('customer')
    .then(deposit => res.json(deposit))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Deposit.findByIdAndDelete(req.params.id)
    .then(() => res.json('Deposit deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Deposit.findById(req.params.id)
    .then(deposit => {
      deposit.customer = req.body.customer;
      deposit.week = Number(req.body.week);
      deposit.amount = Number(req.body.amount);

      deposit.save()
        .then(() => res.json('Deposit updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
