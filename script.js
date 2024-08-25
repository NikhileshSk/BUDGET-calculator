// Retrieve and display the username from local storage
const username = localStorage.getItem('USERNAME');
const welcomeElement = document.getElementById('username');
if (username) {
    welcomeElement.innerHTML = `Welcome <span>${username}</span>`;
} else {
    welcomeElement.innerHTML = `Welcome <span>Guest</span>`;
}

function renderPieChart(income, expense) {
    const ctx = document.getElementById('pie-chart').getContext('2d');
    const data = {
        labels: ['Income', 'Expense', 'Remaining Balance'],
        datasets: [{
            data: [income, expense, income - expense],
            backgroundColor: ['#66bb6a', '#ff7043', '#b0bec5'],
            borderColor: ['#fff', '#fff', '#fff'],
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `${tooltipItem.label}: ₹${tooltipItem.raw.toFixed(2)}`;
                    }
                }
            }
        }
    };

    // Check if a chart already exists and destroy it before creating a new one
    if (window.pieChart) {
        window.pieChart.destroy();
    }

    // Create a new chart
    window.pieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}

// Function to update the pie chart with real-time data
function updatePieChart() {
    let totalIncome = 0;
    let totalExpense = 0;

    // Calculate total income
    const incomeTable = document.getElementById('income-table');
    for (let i = 0; i < incomeTable.rows.length; i++) {
        const amount = parseFloat(incomeTable.rows[i].cells[1].textContent.replace('$', ''));
        if (!isNaN(amount)) {
            totalIncome += amount;
        }
    }

    // Calculate total expense
    const expenseTable = document.getElementById('expense-table');
    for (let i = 0; i < expenseTable.rows.length; i++) {
        const amount = parseFloat(expenseTable.rows[i].cells[1].textContent.replace('$', ''));
        if (!isNaN(amount)) {
            totalExpense += amount;
        }
    }

    // Render the pie chart
    renderPieChart(totalIncome, totalExpense);
}

// Call updatePieChart when the page loads and after adding new data
document.addEventListener('DOMContentLoaded', updatePieChart);

// Function to handle logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('USERNAME');
    window.location.href = './index.html';
}// Function to add income
function addIncome() {
    const incomeType = document.getElementById('income-type').value.trim();
    const incomeAmount = document.getElementById('income-amount').value.trim();
    
    if (incomeType && incomeAmount) {
        const amount = parseFloat(incomeAmount);
        
        if (!isNaN(amount) && amount > 0) {
            const incomeTable = document.getElementById('income-table');
            const row = incomeTable.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.textContent = incomeType;
            cell2.textContent = `${amount.toFixed(2)}`;
            
            // Update balance
            updateBalance(amount);
            
            // Update the pie chart
            updatePieChart();
            
            // Clear input fields
            document.getElementById('income-type').value = '';
            document.getElementById('income-amount').value = '';
        } else {
            alert('Please enter a valid amount greater than 0.');
        }
    } else {
        alert('Please fill out both the Type of Income and Amount fields.');
    }
}

// Function to add expense
function addExpense() {
    const expenseType = document.getElementById('expense-type').value.trim();
    const expenseAmount = document.getElementById('expense-amount').value.trim();
    
    if (expenseType && expenseAmount) {
        const amount = parseFloat(expenseAmount);
        
        if (!isNaN(amount) && amount > 0) {
            const expenseTable = document.getElementById('expense-table');
            const row = expenseTable.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.textContent = expenseType;
            cell2.textContent = `${amount.toFixed(2)}`;
            
            // Update balance
            updateBalance(-amount);
            
            // Update the pie chart
            updatePieChart();
            
            // Clear input fields
            document.getElementById('expense-type').value = '';
            document.getElementById('expense-amount').value = '';
        } else {
            alert('Please enter a valid amount greater than 0.');
        }
    } else {
        alert('Please fill out both the Type of Expense and Amount fields.');
    }
}

// Function to update the balance
function updateBalance(amount) {
    const balanceElement = document.getElementById('balance');
    let currentBalance = parseFloat(balanceElement.textContent.replace('₹', '')) || 0;
    const newBalance = currentBalance + amount;
    balanceElement.textContent = `₹${newBalance.toFixed(2)}`;
}
