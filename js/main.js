// Function to fetch data from JSON file and display it
async function getAllTable() {
    try {
        // Fetch data from JSON file
        let response = await fetch('./js/data.json');
        let convertJsonFetch = await response.json();

        // Call function to display data in table and draw charts
        displayTable(convertJsonFetch);
    } catch (error) {
        // If there's an error fetching data
        console.error('Error fetching data:', error);
    }
}

// Call function to fetch data
getAllTable();


let filterInput = document.querySelector('#filterInput');

// Add event listener for input event (when user types something)
filterInput.addEventListener('input', (e) => {
    let searchTerm = e.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search
    filterTable(searchTerm);
});

// Function to filter table based on search term
function filterTable(searchTerm) {
    let rows = document.querySelectorAll('#tableBody tr');

    rows.forEach(row => {
        let customerName = row.children[1].textContent.toLowerCase(); // Get customer name from the second column

        // Check if the customer name contains the search term
        if (customerName.includes(searchTerm)) {
            row.style.display = ''; // Show the row
        } else {
            row.style.display = 'none'; // Hide the row if it doesn't match
        }
    });
}

// Function to display data in table and draw charts
function displayTable(convertJsonFetch) {
    let cartona = ''; // Variable to store table structure
    let transactions = convertJsonFetch.transactions; // Transaction data
    let customers = convertJsonFetch.customers; // Customer data
    
    // Create table rows using transaction and customer data
    transactions.forEach(transaction => {
        // Find the customer related to the current transaction
        let customer = customers.find(c => c.id === transaction.customer_id);
        if (customer) {
            // Add transaction data to the table structure
            cartona += `
                <tr>
                    <td>${transaction.customer_id}</td>
                    <td>${customer.name}</td>
                    <td>${transaction.date}</td>
                    <td>${transaction.amount}</td>
                    <td><canvas class="myChart" width="200" height="100"></canvas></td>
                </tr>
            `;
        }
    });

    // Insert the table structure into the page
    document.querySelector('#tableBody').innerHTML = cartona;

    // Draw charts for each row in the table
    const canvasList = document.querySelectorAll('.myChart');
    canvasList.forEach((canvas, index) => {
        let transaction = transactions[index]; // Current transaction for the row being drawn

        // Create a chart using Chart.js
        new Chart(canvas, {
            type: 'bar', // Chart type
            data: {
                labels: ['Amount'], // Horizontal axis label
                datasets: [{
                    label: 'Amount Evolution', // Dataset label
                    data: [transaction.amount], // Amount value
                    backgroundColor: 'rgba(54, 162, 235, 0.2)', // Bar background color
                    borderColor: 'rgba(54, 162, 235, 1)', // Bar border color
                    borderWidth: 1 // Bar border width
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true // Start vertical axis from zero
                    }
                }
            }
        });
    });
}
