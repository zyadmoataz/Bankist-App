'use strict';
///////////////////////////////////////////////////   data    ///////////////////////////////////////////////////
const account1 = {
  owner: 'Mohamed Mahmoud',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    '2023-01-01T13:15:33.035Z',
    '2023-01-30T09:48:16.867Z',
    '2023-02-25T06:04:23.907Z',
    '2023-03-29T14:18:46.235Z',
    '2023-03-30T16:33:06.386Z',
    '2023-04-09T14:43:26.374Z',
    '2023-04-12T18:49:59.371Z',
    '2023-04-13T12:01:20.894Z',
  ],
  currency: 'EUR',
  local: 'en-UK',
};

const account2 = {
  owner: 'Zyad Moataz',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 3333,
  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2023-03-28T09:15:04.904Z',
    '2023-03-01T10:17:24.185Z',
    '2023-04-08T14:11:59.604Z',
    '2023-04-27T17:01:17.194Z',
    '2023-04-11T23:36:17.929Z',
    '2023-04-12T10:51:36.790Z',
  ],
  currency: 'USD',
  local: 'en-US',
};

const accounts = [account1, account2];
///////////////////////////////////////////////////     Elements     ///////////////////////////////////////////////////
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

///////////////////////////////////////////////////    Functions     ///////////////////////////////////////////////////
let currentAccount, timer; //global vairables:
//i)Display Date
const displayDateFun = function (date, local) {
  const calDateInDay = (currDate, futureDate) =>
    Math.round(Math.abs(currDate - futureDate) / (1000 * 24 * 60 * 60));
  const daysPassed = calDateInDay(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(local).format(date);
  }
};
//ii)Currency Format
const formatCurrency = function (val, loc, curr) {
  const formatMov = new Intl.NumberFormat(loc, {
    style: 'currency',
    currency: curr,
  }).format(val);
  return formatMov;
};
//1-create display function that receives one array of movements and work with it
const displayMovements = function (acc, sorting = false) {
  containerMovements.innerHTML = '';
  const movs = sorting
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = displayDateFun(date, acc.local);

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatCurrency(
      mov,
      acc.local,
      acc.currency
    )}</div>
      </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//2-Create a Username function using Map and foreach method:
const userNameFun = function (acc) {
  acc.forEach(function (val) {
    val.userName = val.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
userNameFun(accounts);
//3-create balance
const displayBalance = function (account) {
  //creating a new property and store inside it
  account.balance = account.movements.reduce((acc, val) => (acc += val), 0);
  labelBalance.textContent = `${formatCurrency(
    account.balance,
    account.local,
    account.currency
  )} `;
};
//5-Magic of chaining =>
const displaySummary = function (account) {
  const incomes = account.movements
    .filter(val => val > 0)
    .reduce((acc, val) => (acc += val), 0);

  labelSumIn.textContent = `${formatCurrency(
    incomes,
    account.local,
    account.currency
  )} `;
  const outcomes = account.movements
    .filter(val => val < 0)
    .reduce((acc, val) => (acc += val), 0);
  labelSumOut.textContent = `${formatCurrency(
    Math.abs(outcomes),
    account.local,
    account.currency
  )} `;
  const interst = account.movements
    .filter(val => val > 0)
    .map(val => (val * account.interestRate) / 100)
    .filter(val => {
      return val >= 1;
    })
    .reduce((acc, val) => (acc += val), 0);
  labelSumInterest.textContent = `${formatCurrency(
    interst,
    account.local,
    account.currency
  )}% `;
};
//6-Login
const updateUi = function (curr) {
  displayBalance(curr);
  displaySummary(curr);
  displayMovements(curr);
};

//iii) Set Timer
const startLogoutTimer = function () {
  let time = 300;
  //we call the callback function outside in order to start executiong it when page reloaded then wait 1 sec after that
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`; //in each call print remaining time in the ui
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  tick();
  timer = setInterval(tick, 1000);
  return timer; //timer is global variable
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    val => val.userName === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    } 🎉❤️`;
    //dates
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUi(currentAccount);
    //set timer
    if (timer) clearInterval(timer); //clear previous timer
    timer = startLogoutTimer(); //set timer from beginning
  }
});
//7-tranfer money from one user to another
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = inputTransferAmount.value;
  const transferTo = accounts.find(
    val => val.userName === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  if (
    currentAccount.balance >= amount &&
    transferTo &&
    amount > 0 &&
    transferTo?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    transferTo.movements.push(amount);
    //add date
    currentAccount.movementsDates.push(new Date().toISOString());
    transferTo.movementsDates.push(new Date().toISOString());
    updateUi(currentAccount);
    //reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});
//8-delete account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount?.userName === inputCloseUsername.value &&
    currentAccount?.pin === +inputClosePin.value
  ) {
    const i = accounts.findIndex(
      val => val.userName === inputCloseUsername.value
    );
    accounts.splice(i, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
//9-check for loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(+inputLoanAmount.value);
  //check in my movements the largest deposit is 3000 so amount can be up to 30000
  if (amount > 0 && currentAccount.movements.some(val => val >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    //add date and set timeout to wait 3 sec to apply for loan
    setTimeout(function () {
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUi(currentAccount);
    }, 3 * 1000);
    //reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
  inputLoanAmount.value = '';
});
//10-sort button
let sortState = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sortState);
  sortState = !sortState;
});
