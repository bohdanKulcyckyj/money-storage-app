let summaryContainer = document.querySelector('.summary-container');
let graphContainer = document.querySelector('.graph-container');
let chooseTransaction = document.querySelector(' #select-type');
let amountName = document.querySelector('#mount-name');
let amount = document.querySelector('#mount');
let incomeEl = document.querySelector('#income');
let expansesEl = document.querySelector('#expanses');
let summaryEl = document.querySelector('#summary');
let someContainer = document.querySelector('.heading-container');
let table = document.querySelector('#result-table');
let btn = document.querySelector('#remove-all');
let currency = " CZK";
let balanceTotal = 0, incomeTotal = 0, outcomeTotal = 0;
let showBalanceTotal, showIncomeTotal, showOutcomeTotal;

let moneyStorage = [];
moneyStorage = JSON.parse(localStorage.getItem("entry_list")) || [];

let extractedType;
let extractedName;
let extractedAmount;

let extractedIncome;
let extractedIncomeNames;
let extractedIncomeAmount;

let extractedOutcome;
let extractedOutcomeNames;
let extractedOutcomeAmount;

let updatedTotalIncome;
let updatedTotalOutcome;
let updatedTotalBalance;
let transactions = [];

summaryContainer.classList.add("hide");
graphContainer.classList.add("hide");

updateUI();
updateTable();
updateArrays();
showSections();

//hlavní funkce
const budgetApp = () => {
    if(chooseTransaction.options[chooseTransaction.selectedIndex].value === "Příjmy" &&
    amountName.value !== "" && amount.value !== ""){
        if((parseInt(amount.value)) > 0) {
            let income = {
                type : "income",
                name : amountName.value,
                amount : parseInt(amount.value),
            }
            moneyStorage.push(income);
    
            clearInputs([amountName, amount]);
            updateUI();
            updateTable();
            updateArrays();
            createGraph(chart1);
            showSections();
        }else{
            alert("Nelze zadat mínusovou hodnotu");
        }

    }else if(chooseTransaction.options[chooseTransaction.selectedIndex].value === "Vydaje"
    && amountName.value !== "" && amount.value !== ""){
        if((parseInt(amount.value)) > 0) {
            let outcome = {
                type : "outcome",
                name : amountName.value,
                amount : parseInt(amount.value),
            }
            moneyStorage.push(outcome);
    
            clearInputs([amountName, amount]);
            updateUI();
            updateTable();
            updateArrays();
            createGraph(chart1);
            showSections();
        }else{
            alert("Nelze zadat mínusovou hodnotu");
        }

    }else if(amountName.value === "" && amount.value === ""){
        alert("Vyplňte pole s názvem a částkou!");
    }else if(amountName.value !== "" && amount.value === ""){
        alert("Vyplňte pole s částkou!");
    }else{
        alert("Vyplňte pole s názvem!");
    }
};
//ukaže tabulku a graf, když bude z čeho sestavit
function showSections() {
    if((incomeTotal > 0) && (outcomeTotal > 0) || outcomeTotal > 0){
        summaryContainer.classList.remove("hide");
        summaryContainer.classList.remove("differ");
        graphContainer.classList.remove("hide");
    }else if(incomeTotal > 0){
        summaryContainer.classList.remove("hide");
        summaryContainer.classList.add("differ");
    }else{
        summaryContainer.classList.add("hide");
        graphContainer.classList.add("hide");
    }
}
//aktualizuje pole
function updateArrays(){
    extractedType = moneyStorage.map(item => item.type);
    extractedNames = moneyStorage.map(item => item.name);
    extractedAmount = moneyStorage.map(item => item.amount);

    extractedIncome = (moneyStorage.filter(item => item.type === "income"));
    extractedIncomeNames = extractedIncome.map(item => item.name);
    extractedIncomeAmount = extractedIncome.map(item => item.amount);

    extractedOutcome = (moneyStorage.filter(item => item.type === "outcome"));
    extractedOutcomeNames = extractedOutcome.map(item => item.name);
    extractedOutcomeAmount = extractedOutcome.map(item => item.amount);

    updatedTotalIncome = extractedIncomeAmount.reduce((total, amount) => total + amount, 0);
    updatedTotalOutcome = extractedOutcomeAmount.reduce((total, amount) => total + amount, 0);
    updatedTotalBalance = updatedTotalIncome - updatedTotalOutcome;

    transactions.push(updatedTotalIncome);
    transactions.push(updatedTotalOutcome);
    transactions.push(updatedTotalBalance);
}
//aktualizuje tabulku
function updateTable(){
    while (table.hasChildNodes()) {  
        table.removeChild(table.firstChild);
    }

    for(let i = 0; i < moneyStorage.length; i++){
        let currentIndex = i;
        let chosenOne = moneyStorage[i];
        let nameOfType;

        if(chosenOne.type == "income") {
            nameOfType = "příjmy";
        }else{ nameOfType = "vydaje";}

        let currentTabRow = `<tr>
                                <td>${nameOfType}</td>
                                <td>${chosenOne.name}</td>
                                <td>${formatMoney(chosenOne.amount)}${currency}</td>
                                <td style="padding: 0;"><button onclick="deleteCurrentRow(${currentIndex});"><i class="fas fa-trash-alt"></i></button></td>
                            </tr>`;
        table.innerHTML += currentTabRow;
    }
}
//zpracovává data a přesouvá do budget-container
function updateUI() {
    incomeTotal = calculateTotal("income", moneyStorage);
    showIncomeTotal = formatMoney(incomeTotal); //lepší než Intl.NumberFormat().format(incomeFixedTotal);
    incomeEl.innerHTML = `${showIncomeTotal}${currency}`;

    outcomeTotal = calculateTotal("outcome", moneyStorage);
    showOutcomeTotal = formatMoney(outcomeTotal);
    expansesEl.innerHTML = `${showOutcomeTotal}${currency}`;

    balanceTotal = incomeTotal - outcomeTotal;
    showBalanceTotal = formatMoney(balanceTotal);
    summaryEl.innerHTML = `${showBalanceTotal}${currency}`;

    if(balanceTotal < 0){
        summaryEl.classList.add("minus");
        summaryEl.classList.remove("plus");
    }else if(balanceTotal > 0){
        summaryEl.classList.add("plus");
        summaryEl.classList.remove("minus");
    }else{
        summaryEl.classList.remove("minus");
        summaryEl.classList.remove("plus");
    }

    localStorage.setItem("entry_list", JSON.stringify(moneyStorage));
}
//vypočítá příjmy a výdaje
function calculateTotal(type, array) {
    let sum = 0;

    array.forEach(data => {
        if (data.type == type) {
            sum += data.amount;
        }
    });
    return sum;
}

function clearElements(elements) {
    elements.forEach(element => {
        element.innerHTML = "0 CZK";
    });
}

function clearInputs(inputs) {
    inputs.forEach(input => {
        input.value = "";
    });
}
//vymaže všechny data, jak z pole, tak i z tabulky
function clearMoneyStorage() {
    moneyStorage = [];
    while (table.hasChildNodes()) {  
        table.removeChild(table.firstChild);
    }
    updateUI();
    updateArrays();
    createGraph(chart1);
    clearElements([incomeEl, expansesEl, summaryEl]);
    summaryContainer.classList.add("hide");
    graphContainer.classList.add("hide");
}
//pro odstranění řádku tabulky
function deleteCurrentRow(i) {
    moneyStorage.splice(i, 1);
    localStorage.setItem("entry_list", JSON.stringify(moneyStorage));
    table.removeChild(table.childNodes[i]);
    updateUI();
    updateTable();
    updateArrays();
    createGraph(chart1);
    showSections();
}
//format měny
function formatMoney(amount, decimalCount = 2, decimal = ",", thousands = " ") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      console.log(e)
    }
};
//tlačítko enter
amount.addEventListener('keydown', (e) => {
    if(e.which == 13){
        budgetApp();
    }
});