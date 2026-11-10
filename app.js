const description = document.getElementById('expense-description');
const amount = document.getElementById('expense-amount');
const date = document.getElementById('expense-date');
const category = document.getElementById('category');
const descriptionerror = document.getElementById('description-error');
const amounterror = document.getElementById('amount-error');
const dateerror = document.getElementById('date-error');
const categoryerror = document.getElementById('category-error');
const expensetable = document.getElementById('expense-table');
const tablebody = document.getElementById('expense-table-body');
const tableerror = document.getElementById('table-error');
const totalexpenses = document.getElementById('total-expenses');
const expensecount = document.getElementById('expense-count');
const biggestexpense = document.getElementById('biggest-expense');
const filtercategory = document.getElementById('filter-category');

const selectCategoryhtml = `
  <option value="Food">Food</option>
  <option value="Transportation">Transportation</option>
  <option value="Entertainment">Entertainment</option>
  <option value="Utilities">Utilities</option>
  <option value="Other">Other</option>
`;

category.innerHTML = `<option value="" disabled selected hidden class="form-control">--Select a category--</option>${selectCategoryhtml}`;
filtercategory.innerHTML = `<option value="All" class="form-control">All Categories</option>${selectCategoryhtml}`;


let expenses = JSON.parse(localStorage.getItem('expenses')) || [];


const saveToLocalStorage = () => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
};


const renderExpenseRow = (expense) => {
    const newRow = tablebody.insertRow();
    const descriptionCell = newRow.insertCell(0);
    const amountCell = newRow.insertCell(1);
    const dateCell = newRow.insertCell(2);
    const categoryCell = newRow.insertCell(3);
    const deleteCell = newRow.insertCell(4);

    descriptionCell.textContent = expense.description;
    amountCell.textContent = expense.amount.toFixed(2);
    dateCell.textContent = expense.date;
    categoryCell.textContent = expense.category;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
    deleteCell.appendChild(deleteButton);

    deleteButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this expense?')) {
      
            expenses = expenses.filter(item => item.id !== expense.id);
            saveToLocalStorage();
            
   
            newRow.remove();
            updateSummary();
        }
    });
};


const updateSummary = () => {
    let total = 0;
    let count = 0;
    let maxExpense = 0;

    for (let i = 0; i < tablebody.rows.length; i++) {
        const row = tablebody.rows[i];
        const amountVal = parseFloat(row.cells[1].textContent);
        total += amountVal;
        count++;
        if (amountVal > maxExpense) {
            maxExpense = amountVal;
        }
    }

    totalexpenses.textContent = total.toFixed(2);
    expensecount.textContent = count;
    biggestexpense.textContent = maxExpense.toFixed(2);

    if (count === 0) {
        tableerror.textContent = 'No expenses added yet.';
        tableerror.style.color = 'red';
    } else {
        tableerror.textContent = '';
    }
};


const loadSavedExpenses = () => {
    tablebody.innerHTML = '';
    expenses.forEach(expense => renderExpenseRow(expense));
    updateSummary();
};


document.getElementById('expense-form').addEventListener('submit', function(e) {
    e.preventDefault();

    let descriptionValue = description.value.trim();
    let amountValue = parseFloat(amount.value.trim());
    let dateValue = date.value.trim();
    let categoryValue = category.value;
    let isValid = true;

    descriptionerror.textContent = '';
    amounterror.textContent = '';
    dateerror.textContent = '';
    categoryerror.textContent = '';
    tableerror.textContent = '';

    if (descriptionValue === '' || descriptionValue.length < 3) {
        descriptionerror.textContent = 'Description is required and must be at least 3 characters.';
        descriptionerror.style.color = 'red';
        isValid = false;
    }
    if (isNaN(amountValue) || amountValue <= 0) {
        amounterror.textContent = 'Amount is required and must be a positive number.';
        amounterror.style.color = 'red';
        isValid = false;
    }
    if (dateValue === '') {
        dateerror.textContent = 'Date is required.';
        dateerror.style.color = 'red';
        isValid = false;
    }
    if (categoryValue === '') {
        categoryerror.textContent = 'Category is required.';
        categoryerror.style.color = 'red';
        isValid = false;
    }

    if (!isValid) {
        return;
    }


    const newExpense = {
        id: Date.now(),
        description: descriptionValue,
        amount: amountValue,
        date: dateValue,
        category: categoryValue
    };


    expenses.push(newExpense);
    saveToLocalStorage();


    renderExpenseRow(newExpense);
    updateSummary();


    description.value = '';
    amount.value = '';
    date.value = '';
    category.value = '';
});


filtercategory.addEventListener('change', (e) => {
    const selectedCategory = e.target.value;
    for (let i = 0; i < tablebody.rows.length; i++) {
        if (selectedCategory === 'All' || tablebody.rows[i].cells[3].textContent === selectedCategory) {
            tablebody.rows[i].style.display = '';
        } else {
            tablebody.rows[i].style.display = 'none';
        }
    }
});


loadSavedExpenses();
