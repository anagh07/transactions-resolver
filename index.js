const fs = require('fs');
const path = require('path');

const paymentsPath = path.join('data', 'payments.json');
const duesPath = path.join('data', 'dues.json');
const balancePath = path.join('data', 'balance.json');

/**
 * Two JSON files contain transaction data of bills and payments.
 * Create a balance sheet that contains one row for each user
 */

// Parse data
const dues = JSON.parse(fs.readFileSync(duesPath));
const payments = JSON.parse(fs.readFileSync(paymentsPath));

// Aggregate dues
const balance = dues.reduce((accumulator, due) => {
  const userId = due.userId;
  if (!accumulator[userId]) {
    const { id, billAmount, ...newBalance } = due;
    accumulator[userId] = { ...newBalance, balance: due.billAmount };
  } else {
    accumulator[userId].balance += due.billAmount;
  }
  return accumulator;
}, {});

// Iterate payments and update balance map
for (let payment of payments) {
  const userId = payment.userId;
  if (!balance[userId]) {
    const { id, paymentAmout, ...newPayment } = payment;
    balance[userId] = { ...newPayment, balance: -payment.paymentAmout };
  } else {
    balance[userId].balance -= payment.paymentAmount;
  }
}

// Write to file
const result = Object.values(balance);
fs.writeFile(balancePath, JSON.stringify(result), (err) => {
  if (err) console.log(err);
  console.log('done');
});
