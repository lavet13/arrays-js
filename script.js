'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.replaceChildren(); // removes existing children, also we could add elements if we do want that

  // while (containerMovements.firstChild) {
  //   containerMovements.removeChild(containerMovements.lastChild);
  // }

  // containerMovements.textContent = ''; // .textContent is more efficient than .innerText and .innerHTML

  movements.forEach((move, i) => {
    // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript?noredirect=1&lq=1
    // https://stackoverflow.com/questions/4991098/replacing-all-children-of-an-htmlelement
    const type = move > 0 ? `deposit` : `withdrawal`;

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${type}
           </div>
          <div class="movements__value">${move}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

displayMovements(account1.movements);

const createUsernames = function (user) {
  let username = user
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');

  return username;
};

accounts.forEach(({ owner }) => {
  console.log(createUsernames(owner));
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*
/////////////////////////////////////////////////
// Simple Array Methods

// SLICE method
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2));
console.log(arr.slice(2, 4)); // 4 - 2 = 2, so length of the new resulting array
console.log(arr.slice(-2));
console.log(arr.slice(-1)); // returns an new array with the last(one) element
console.log(arr.slice(1, -2)); // from the first index to the second last index (not included)
console.log(arr.slice()); // just a matter of personal preferences, the only time you really need to use slice method is when you want to chain multiple methods together
console.log([...arr]); // analogy

// SPLICE method, fundamental difference is that it does actually change the original array, so it mutates that array;
// console.log(arr.splice(2)); // starting from the second index until the end extract elements from the original array, it returns an array with deleted elements, so it deletes elements from the original array
arr.splice(-1); // last element from an original array will be deleted, and it returns array with only one value, and still would modified original array
console.log(arr);
console.log(arr.splice(1, 2)); // second argument is deleteCount, first is starting index;
console.log(arr);

// REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];

arr2.reverse(); // mutate the original array

// CONCAT
const letters = arr.concat(arr2);
console.log(letters); // concat returns new array based on these two ones, so it doesn't mutate the original array
console.log([...arr, ...arr2]); // and again it's just a matter of your personal preference to what you are really prefer to use, so spread operator or concat

// JOIN
console.log(letters.join(' - ')); // new string
*/

/*
////////////////////////////////////////////////////////
// The new at Method

const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

// getting the last array element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]); // slice returns new array with only one value(last value), so we just get that one out of the array, doesn't mutate the original array
console.log(arr.at(-1)); // at method is perfect for method chaining

// also works for strings
console.log('jonas'.at(0));
console.log('jonas'.at(-1));
*/

/*
///////////////////////////////////////////////////
// Looping Arrays_ forEach

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const move of movements) {
for (const [i, move] of movements.entries()) {
  if (move > 0) {
    console.log(`Movement ${i + 1}: You deposited ${move}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(move)}`);
  }
}

console.log('----------- FOREACH ------------');

// higher order function which requires callback function in order to tell it what to do
// break and continue statements don't work in a forEach loop at all
movements.forEach((move, i) => {
  if (move > 0) {
    console.log(`Movement ${i + 1}: You deposited ${move}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(move)}`);
  }
});
*/

/*
// testing
const objTest2 = {
  sum: 0,
  count: 0,
};

class Counter {
  constructor() {
    this.sum = 0;
    this.count = 0;
  }

  add(array) {
    // array.forEach(entry => {
    //   this.sum += entry;
    //   ++this.count;
    // }, objTest2); // doesn't work it's override that second argument as if we didn't even specify that
    // SOLVE it doesn't need thisArgs if it's arrow function(because if it passed an argument no matter what you pass into the second argument, it still will point to outer lexical scope in our case it's parent's function scope which is the object and we already know why is that), so if it's function expression and we know that "add" function is the method, and we already know that the "this" keyword is set to the object, because it's calling that method(add method)

    array.forEach(function (entry) {
      this.sum += entry;
      ++this.count;
    }, objTest2); // SOLVE it works as expected
    // thisArgs(second argument) is actually something similar that was in bind, call and apply methods where we're manually set the "this" keyword, and we must specified exactly "this"(which is the object) to prevent the "this" keyword points to the undefined(in strict mode), but we are specifying on objTest2 to check certain situations with arrow function
  }
}

const obj = new Counter();
obj.add([2, 5, 6]);
console.log(`sum: ${obj.sum}`);
console.log(`count: ${obj.count}`);
console.log(objTest2);

// private properties
// console.log(obj._sum);
// console.log(obj._count);
*/

/*
///////////////////////////////////////////////////////
// forEach With Maps and Sets

// Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach((currency, key, map) => {
  console.log(`${key}: ${currency}`);
});

// Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);

// key is exactly the same as the value, because a set doesn't have keys, and it doesn't have indexes either, and so there is no value that would make sense for the key
// underscore means in JavaScript a throwaway variable that is completely unnecessary, so it's just a convention
currenciesUnique.forEach((currency, _, set) => {
  console.log(`${_}: ${currency}`);
});
*/

//////////////////////////////////////////////////////////////
// Data Transformations_ map, filter, reduce
// reduce - you can imagine this as a snowball, it keeps getting bigger and bigger as it rolls down a hill, so this is known as the snowball effect, this whole process has now reduced the original array to one single value, this value that then actually gets returned from the reduce method in the end, so there is no new array in this case but only the reduced value;

/*
/////////////////////////////////////////////////////////////
// The map Method
// the map method is yet another way that we can use to loop over arrays, but unlike forEach method, the map method will give us a brand new array, and this new array will contain in each position the results of applying a callback function to the original array elements;

let movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurtoUsd = 1.1;

// const movementsUSD = movements.map(function (euro) {
//   console.log(this); // SOLVE window object, if it was an arrow function, or undefined - it it was function expression(in strict mode), - works the same as for function declaration
//   Math.trunc(euro * eurtoUsd);
// });

const movementsUSD = movements.map(euro => Math.trunc(euro * eurtoUsd));

console.log(movements, movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) {
  movementsUSDfor.push(Math.round(mov * eurtoUsd));
}

console.log(movementsUSDfor);

// testing
const objTest = {
  name: 'Ivan',
  surname: 'Skinder',
};

// in each iteration we printed each line individually to the console, as we were looping over the array, so in each iteration we perform some action that was then visible in the console and we can call this a side effect, so the forEach method creates a side effects
// we didn't create a side effect in each of the iteration, all we did was to build a brand new array
const movementsDesc = movements.map(function (mov, i) {
  console.log(this);
  return `Movement ${
    i + 1
  }: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`;
}, objTest); // SOLVE works only with function expression, but not with arrow function

console.log(movementsDesc);
*/
