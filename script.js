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

const displayMovements = function (movements, sort = false) {
  containerMovements.replaceChildren(); // removes existing children, also we could add elements if we want that

  // while (containerMovements.firstChild) {
  //   containerMovements.removeChild(containerMovements.lastChild);
  // }

  // containerMovements.textContent = ''; // .textContent is more efficient than .innerText and .innerHTML

  // sort
  const movs = sort ? [...movements].sort((a, b) => a - b) : movements; // SOLVE ascending because, it will be reversed by the end, so basically we were inserting all the elements at the start of the container, that's why

  movs.forEach((move, i) => {
    // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript?noredirect=1&lq=1
    // https://stackoverflow.com/questions/4991098/replacing-all-children-of-an-htmlelement
    const type = move > 0 ? `deposit` : `withdrawal`;

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${type}
           </div>
          <div class="movements__value">${move} EUR</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html); // SOLVE the afterbegin(unshift) keyword reverses the order, in case im not familiar, so to save the order we might use the beforeend(push) keyword in the first argument
  });
};

const calcDisplayBalance = function (acc) {
  // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
  // Object.defineProperty
  acc.balance = acc.movements.reduce((acc, currentValue) => acc + currentValue);

  // while (labelBalance.firstChild) {
  //   labelBalance.removeChild(labelBalance.lastChild);
  // }

  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function ({ movements, interestRate }) {
  const incomes = movements
    .filter(mov => mov > 0)
    .reduce((deposit, mov) => deposit + mov, 0);

  labelSumIn.textContent = `${incomes} EUR`;

  const outcomes = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(outcomes)} EUR`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0)
    .toFixed(2);

  labelSumInterest.textContent = `${interest} EUR`;
};

// each function should actually receive the data that it should work with, instead of using a global variable
const createUsernames = function (accs) {
  // there is a side effect, so in other words, to simply do some work without returning anything
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const clearFields = function (input1, input2) {
  if (input1) {
    input1.value = '';
  }

  if (input2) {
    input2.value = '';
  }

  input1?.blur();
  input2?.blur();

  // there is also focus method, which do opposite of the blur method
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

let currentAccount;

// Event Handler
btnLogin.addEventListener('click', e => {
  e.preventDefault();

  let account;

  if (
    (account = accounts.find(
      acc =>
        acc.username === inputLoginUsername.value &&
        acc.pin === +inputLoginPin.value
    ))
  ) {
    sorted = false;
    currentAccount = account;

    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }!`;
    containerApp.style.opacity = 1;
    containerApp.style.visibility = 'visible';

    updateUI(currentAccount);
    clearFields(inputLoginUsername, inputLoginPin);
  }

  console.log(account);
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    receiverAcc &&
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAcc !== currentAccount
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
    clearFields(inputTransferAmount, inputTransferTo);
  } else {
    console.log(
      'not enough money to transfer or selftransfer attempt or transferTo input is incorrect or empty'
    );
  }

  console.log(amount, receiverAcc);
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputLoanAmount.value;

  // at least one of the elements in the movements array has this condition
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
    clearFields(inputLoanAmount);
  } else {
    console.log(
      'amount is below zero or there is no deposit that is greater than 10% of requested amount'
    );
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // delete account
    accounts.splice(
      accounts.findIndex(acc => acc === currentAccount),
      1
    );

    // HIDE UI
    containerApp.style.opacity = 0;
    containerApp.style.visibility = 'hidden';

    // clear fields
    clearFields(inputCloseUsername, inputClosePin);

    // reset welcome
    labelWelcome.textContent = 'Log in to get started';
  } else {
    console.log('incorrect input');
  }
});

let sorted = false;

btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currentAccount.movements, (sorted = !sorted));
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

let movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/*
/////////////////////////////////////////////////
// Simple Array Methods

// SLICE method
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(2));
console.log(arr.slice(2, 4)); // 4 - 2 = 2, so length of the new resulting array
console.log(arr.slice(-2));
console.log(arr.slice(-1)); // returns a new array with the last(one) element
console.log(arr.slice(1, -2)); // from the first index to the second last index (not included)
console.log(arr.slice()); // just a matter of personal preferences, the only time you really need to use slice method is when you want to chain multiple methods together
console.log([...arr]); // analogy

// SPLICE method, fundamental difference is that it does actually change the original array, so it mutates that array;
// console.log(arr.splice(2)); // starting from the second index until the end extract elements from the original array, it returns an array with deleted elements, so it deletes elements from the original array
arr.splice(-1); // last element from an original array will be deleted, and it returns array with only one value, and still would modified original array
console.log(arr);
console.log(arr.splice(1, 2)); // second argument is deleteCount, first is starting index, if no elements are removed, an empty array is returned
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
console.log(arr.slice(-1)[0]); // slice returns new array with only one value(last value), so we just get that one out of the array, doesn't mutate the original one
console.log(arr.at(-1)); // at method is perfect for method chaining

// also works for strings
console.log('jonas'.at(0));
console.log('jonas'.at(-1));
*/

/*
///////////////////////////////////////////////////
// Looping Arrays_ forEach


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
    // }, objTest2); // doesn't work it's override that second argument as if we didn't even specify that(arrow function)
    // SOLVE it doesn't need thisArgs if it's arrow function(because if we were passed an argument no matter what you were passing into the second argument, it still will point to outer lexical scope in our case it's parent's function scope which is the object and we already know why is that)

    array.forEach(function (entry) {
      this.sum += entry;
      ++this.count;
    }, this); // SOLVE it works as expected
    // thisArgs(second argument) is actually something similar that was in bind, call and apply methods where we're manually set the "this" keyword, and we must specified exactly "this" VALUE(which is the object, the outer scope of function expression that is the method that is called by object) to prevent the "this" keyword points to the undefined(in strict mode)
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

const eurtoUsd = 1.1;

// const movementsUSD = movements.map(function (euro) {
//   console.log(this); // SOLVE window object, if it was an arrow function, or undefined - in our case function expression(in strict mode), but we could still specified the window object manually to the second argument of map method if we need to, specifying exactly the "this" VALUE which will be the outer scope
//   return Math.trunc(euro * eurtoUsd);
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
  console.log(this); // window object
  return `Movement ${
    i + 1
  }: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`;
}, this); // SOLVE if we didn't specified the second argument, then it will be undefined(simple function call), unlike to set in the second argument to the "this" VALUE, which will gonna be the window object

console.log(movementsDesc);
*/

/*
/////////////////////////////////////////////////
// The filter Method
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/isFinite
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite
// Number.isFinite() - false => NaN, +Infinity, -Infinity, null, undefined, string('0123'), so it checks if a certain value is a number

// https://stackoverflow.com/questions/19839952/all-falsey-values-in-javascript
// falsey values => String, Number, Boolean, Null, Undefined, BigInt, Symbol, Object
console.log(movements);

// it's more practical application and that's because we can actually chain all the methods together, basically use them all one after another to build a big final result, which is completely impossible to do with the for loop, so this is a big advantage of using the methods instead of regular for loop
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
const deposits = movements.filter(function (mov) {
  return mov > 0;
});

console.log(deposits);

// regular for loop
// const depositsFor = [];

// for (const mov of movements) {
//   if (mov > 0) {
//     depositsFor.push(mov); // push saves order of the elements
//   }
// }

// console.log(depositsFor);

// small challenge
const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});

console.log(withdrawals);

// SOLVE it's not that important to explain second argument "thisArgs"
*/

/*
/////////////////////////////////////////////////////////////////////
// The reduce Method
// it is by far the most powerful array method that there is, it can also be the hardest one to use
// essentially boils down all the elements in an array to one single value

console.log(`movements: ${movements.join(', ')}`);

// accumulator -> SNOWBALL
// accumulator will be the current sum of all the previous values and so we will really keep adding to this accumulator in each iteration of the loop
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);

const balance = movements.reduce((acc, mov, i, arr) => acc + mov, 0);

console.log(balance);

let balanceFor = 0;

for (let [i, mov] of movements.entries()) {
  // console.log(`Iteration ${i}: ${balanceFor}`);
  balanceFor += mov;
}

console.log(balanceFor);

// Maximum value of the movements array
let maxValue = movements.reduce((acc, mov) => (acc > mov ? acc : mov));
console.log(`Maximum value: ${maxValue}`);
*/

/*
/////////////////////////////////////////////////////
// The Magic of Chaining Methods

const eurtoUsd = 1.1;
console.log(movements);

// PIPELINE
const totalDepositsInUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * eurtoUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsInUSD);
*/

/*
////////////////////////////////////////////////////////
// The find Method
// The findIndex Method close cousin of the find Method, and findIndex method works exact the same way as find but as the name says, findIndex returns the index of the found element and not the element itself

console.log(movements);

// find, findIndex, map, filter, forEach and also Array.from(arrayLike, mapping function, thisArgs) have second argument which is thisArgs to specify a certain value to the "this" keyword, unlike those, the reduce method has initialValue as a second argument, so basically without having a thisArgs to manually set the "this" keyword

const firstWithdrawal = movements.find(mov => mov < 0); // unlike the filter method, the find method will actually not return a new array, but it will only return the first element in the array that satisfies this condition, so basically in other words, the first element in the array for which certain operation becomes true

console.log(firstWithdrawal);

const account = accounts.find(({ username }) => {
  return username === 'ss';
});

console.log(account);

// regular for loop
let accountFor;

for (const acc of accounts) {
  if (acc.username === 'js') {
    accountFor = acc;
    break;
  }
}

console.log(accountFor);
*/

/*
/////////////////////////////////////////////////////////////
// some and every methods
console.log(movements);

// EQUALITY
console.log(movements.includes(-130)); // true

// we could rewrite above like this
console.log(movements.some(mov => mov === -130));

// SOME: CONDITION
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

// EVERY: CONDITION
// it returns true if only all the elements in the array satisfy the condition that we pass in, in other words if every element passes the test in our callback function only then the "every" method returns true and that's why the method is called "every"
console.log(account4.movements.every(mov => mov > 0)); // we essentially check if all of our movements are deposits

// Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.filter(deposit));
console.log(movements.every(deposit));
*/

/*
////////////////////////////////////////////////////////////////
// flat and flatMap (were introduced in ES2019, they are pretty recent)
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat()); // depth, default is 1

const arrDeep = [
  [1, [2, 3]],
  [4, [5, 6]],
  [7, 8],
];

console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(({ movements }) => movements);
// const allMovements = accountMovements.flat();
// console.log(`all movements: ${allMovements.join(', ')};`);
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov);
// console.log(`overAllBalance: ${overallBalance}`);

// flat
const overallBalance = accounts
  .map(({ movements }) => movements)
  .flat()
  .reduce((acc, mov) => acc + mov);

console.log(`overAllBalance: ${overallBalance}`);

// it's better for performance to use flatMap instead of using map and flat separately
// flatMap, but it goes only one level deep, so if we do need to go deeper than just one level, we still need to use the flat method
const overallBalance2 = accounts
  .flatMap(({ movements }) => movements) // essentially a map method, but it does flattens the result at the end
  .reduce((acc, mov) => acc + mov);

console.log(`overAllBalance2: ${overallBalance2}`);
*/

/*
/////////////////////////////////////////////////////
// Sorting Arrays

// Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort()); // mutate the original array
console.log(owners);

// Numbers
console.log(movements);
// console.log(movements.sort()); // the sort method does the sorting based on strings, so that might sound weird, but that's just how it works by default
// so basically what it does is to convert everything to strings and then it does the sorting itself and the result is as if they were strings then the result actually makes sense, and in fact we can fix this by passing in a compare callback function into the sort method

// return < 0, compareFunction(a, b) - A, B (keep order)
// return > 0, compareFunction(a, b) - B, A (switch order)
// return = 0, compareFunction(a, b) - A, B (keep original order)

// Ascending
// movements.sort((a, b) => {
//   if (a > b) {
//     // B, A (switch order)
//     return 1; 
//   }
//   if (a < b) {
//     // A, B (keep order)
//     return -1; 
//   }
// });

// similar as above
// movements.sort((a, b) => a - b); // Ascending
console.log(movements);

// Descending
movements.sort((a, b) => {
  if (a > b) {
    // A, B (keep order)
    return -1; 
  }
  if (a < b) {
    // B, A (switch order)
    return 1; 
  }
});

// same as above
movements.sort((a, b) => b - a); // Descending
console.log(movements);
*/

/*
//////////////////////////////////////////////
// More Ways of Creating and Filling Arrays
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Typed_arrays
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from

console.log(new Array(1, 2, 3, 4, 5, 6, 7)); // passing numbers to the rest array basically
console.log(new Array(10)); // by passing only one value we would get the array with the length and simply get the empty elements, basically in there it contains nothing

// Empty array + fill method(map doesn't workout with empty values) = we created an array programmatically, so without actually having to write it down manually
const x = new Array(10); // 10 empty values, so essentially 10 is the length of the array that we specified in the constructor
x.fill(1, 1, 4); // first argument is the value that the array is gonna be filled, and second argument is where we want it to start to fill and third argument is the end of the fill(arr.length), and just like in slice method the final index is not gonna be included in the array
console.log(x);

const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(arr.fill(23, 2, 6)); // SOLVE MUTATE original array and returns one, and it reminds me splice and slice at the same time

// way better approach to fill array with one specific value
console.log(Array.from({ length: 7 })); // unlike new Array(7) which is gonna contain 7 empty values, this one will be contain 7 undefined values, so that it will take us to the point where we could use mapping function
const y = Array.from({ length: 7 }, () => 1); // we are not using the from as a method on an array, instead we are using it on the Array() constructor, so this is function object on which we call the from() method; first argument is arrayLike object and second argument is the mapping function, so it is exactly like the callback function that we pass into the map() method
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1); // callback function is exactly like the one in a map() method
console.log(z);

// keys are indexes, so if it does not maintain that then it will simply be undefined
const textObj = {
  0: 'Ivan',
  1: 'Pavel',
  2: 'Sasha',
  3: 'Nikita',
  length: 4,
};

console.log(Array.from(textObj));

const f = function () {
  console.log(arguments); // [[Prototype]]: Object
  for (let arg of arguments) {
    // iterable
    console.log(arg);
  }
  return Array.from(arguments); // arguments keyword is an iterable
};

console.log(f(1, 2, 3, 4, 5)); // [[Prototype]]: Array(0)

// 100 random dice rolls
console.log(
  Array.from(
    { length: 100 },
    (element, i, _) => Math.trunc(Math.random() * 6) + 1 // third argument is undefined, because processed array wasn't provided by mapping function(callback function)
  ) // 1 .. 6
);

// getting data from UI
labelBalance.addEventListener('click', function () {
  // const movementsUI = Array.from(
  //   document.querySelectorAll('.movements__value'),
  //   node => +node.textContent.replace('EUR', '')
  // );

  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    node => parseInt(node.textContent) // SOLVE in mapping function we don't have access to the processed array, so the third argument in the callback function will be undefined
  );

  console.log(movementsUI);
});

// subtle difference
console.log(
  Array.from([1, 2, 3], (_, __, arr) => {
    // there is no arr in there just an undefined
    console.log(`intermediate: ${arr}`); // intermediate: undefined
    return 0;
  })
);

console.log(
  Array.from([1, 2, 3]).map((_, __, arr) => {
    // there were separated, that's why it's not undefined
    console.log(`intermediate: ${arr}`); // intermediate: 1,2,3
    return 0;
  })
);
*/

/*
////////////////////////////////////////////////////////////////////////////////
// Summary Which Array Method to Use

// To mutate original array
    // Add to original:
    .push(); // (end)
    .unshift(); // (start)

    // Remove from original: 
    .pop(); // (end)
    .shift(); // (start)
    .splice(); // (any)

    // Others:
    .reverse();
    .sort();
    .fill();

// A new array
    // Computed from original:
    .map(); // (loop)

    // Filtered using condition:
    .filter();

    // Portion of original:
    .slice();

    // Adding original to other:
    .concat();

    //Flatteing the original:
    .flat();
    .flatMap();

// An array index
    // Based on value:
    .indexOf();
    .lastIndexOf();

    // Based on test condition:
    .findIndex();

// An array element
    // Based on test condition:
    .find();

// Know if array includes
    // Based on value:
    .includes();
    .startsWith();
    .endsWith();

    // Based on test condition:
    .some();
    .every();

// A new string
    // Based on separator string:
    .split();
    .join();

// To transform to value
    // Based on accumulator:
    .reduce();
    // (Boil down array to single value of any type: number, string, boolean, or even new array or object)

// To just loop array
    // Based on callback:
    .forEach();
    // (Does not create a new array, just loops over it)
*/

//////////////////////////////////////////////////
// Array Methods Practice

// 1.
const bankDepositSum = accounts
  .flatMap(({ movements }) => movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);

console.log(bankDepositSum);

// 2.
const numDeposits = accounts
  .flatMap(({ movements }) => movements)
  .reduce((acc, cur) => (cur >= 1000 ? ++acc : acc), 0);

const numDeposits2 = accounts
  .flatMap(({ movements }) => movements)
  .filter(mov => mov >= 1000).length;

console.log(numDeposits);
console.log(numDeposits2);

// Prefixed ++ operator
let a = 10;
console.log(++a);
console.log(a);

// 3.
const sums = accounts
  .flatMap(({ movements }) => movements)
  .reduce(
    (acc, cur) => {
      // cur > 0 ? (acc.deposits += cur) : (acc.withdrawals += cur);
      acc[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return acc;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(sums);

// recreate any of examples that we did previously in the section with map filter and reduce to use only the reduce method

// 4.
const convertTitleCase = function (title) {
  const capitalize = str => str.replace(str[0], str[0].toUpperCase());

  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .trim()
    .split(' ')
    .map(word => (!exceptions.includes(word) ? capitalize(word) : word))
    .join(' ');

  return capitalize(titleCase);
  // return titleCase[0].toUpperCase() + titleCase.slice(1);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
