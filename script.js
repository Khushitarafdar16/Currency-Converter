const currencySelects = ["from", "to"];

// Function to generate flag URL based on currency code
function getFlag(currency) {
    // Example: USD -> US, INR -> IN
    const country = currency.slice(0, 2);
    return `https://flagsapi.com/${country}/flat/64.png`;
}

// Load currencies into dropdowns
async function loadCurrencies() {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const data = await res.json();
    const currencies = Object.keys(data.rates);

    currencySelects.forEach(id => {
        let select = document.getElementById(id);
        currencies.forEach(cur => {
            select.innerHTML += `<option value="${cur}">${cur}</option>`;
        });
    });

    // Default flags
    updateFlag("from");
    updateFlag("to");
}

// Update flag when currency changes
function updateFlag(type) {
    const currency = document.getElementById(type).value;
    const flagImg = document.getElementById(`flag-${type}`);
    flagImg.src = getFlag(currency);
}

// Swap currencies & flags
function swapCurrencies() {
    let from = document.getElementById("from");
    let to = document.getElementById("to");

    let temp = from.value;
    from.value = to.value;
    to.value = temp;

    updateFlag("from");
    updateFlag("to");
}

// Convert currency
async function convertCurrency() {
    let amount = document.getElementById("amount").value;
    let from = document.getElementById("from").value;
    let to = document.getElementById("to").value;

    if (!amount) return alert("Enter amount!");

    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    const data = await res.json();

    let rate = data.rates[to];
    let result = amount * rate;

    document.getElementById("result").innerText =
        `${amount} ${from} = ${result.toFixed(2)} ${to}`;
}

// Detect change in dropdowns and update flags
document.getElementById("from").addEventListener("change", () => updateFlag("from"));
document.getElementById("to").addEventListener("change", () => updateFlag("to"));

// Initial load
loadCurrencies();
