const router = require('express').Router();
let Customer = require('../models/customer.model');

router.route('/').get((req, res) => {
  Customer.find()
    .then(customers => res.json(customers))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const customerID = req.body.customerID;
  const name = req.body.name;

  const newCustomer = new Customer({ customerID, name });

  newCustomer.save()
    .then(() => res.json('Customer added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/search').get((req, res) => {
  Customer.find({ customerID: req.query.customerID })
    .then(customer => res.json(customer))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
  Customer.findById(req.params.id)
    .then(customer => res.json(customer))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Customer.findByIdAndDelete(req.params.id)
    .then(() => res.json('Customer deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
  Customer.findById(req.params.id)
    .then(customer => {
      customer.customerID = req.body.customerID;
      customer.name = req.body.name;

      customer.save()
        .then(() => res.json('Customer updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
