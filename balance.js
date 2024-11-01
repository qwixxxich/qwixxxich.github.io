var balance = 1000;

function updateBalanceDisplay() {
    document.getElementById("balance").textContent = balance;
}

function decreaseBalance() {
    balance -= 50;
    updateBalanceDisplay();
}

function increaseBalance() {
    balance += 200;
    updateBalanceDisplay();
}

updateBalanceDisplay();
