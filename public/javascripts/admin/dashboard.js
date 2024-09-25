
    // Open modal
    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    // Close modal
    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

   async function fetchSalesData(filter) {
    const response = await fetch(`/admin/sales?filter=${filter}`);
    const data = await response.json();

    const salesData = {
        labels: [],
        amounts: []
    };

    if (filter === "weekly") {
        const weekStart = moment().startOf('isoWeek');
        for (let i = 0; i < 7; i++) {
            const day = moment(weekStart).add(i, 'days');
            salesData.labels.push(day.format('dddd')); // Day name (Mon, Tue, etc.)
            salesData.amounts.push(data.filter(order => moment(order.createdAt).isSame(day, 'day')).length);
        }
    } else if (filter === "monthly") {
        // For monthly view, show from January to December
        for (let i = 0; i < 12; i++) {
            const month = moment().month(i).startOf('month');
            salesData.labels.push(month.format('MMMM')); // Month name
            salesData.amounts.push(data.filter(order => moment(order.createdAt).isSame(month, 'month')).length);
        }
    } else if (filter === "yearly") {
        // For yearly view, show this year and the previous 5 years in reverse order
        for (let i = 0; i < 6; i++) {
            const year = moment().subtract(5 - i, 'years'); // Start from the current year and go back
            salesData.labels.push(year.format('YYYY')); // Year
            salesData.amounts.push(data.filter(order => moment(order.createdAt).isSame(year, 'year')).length);
        }
    } else { // Default to daily
        const today = moment().startOf('day');
        salesData.labels.push(today.format('dddd')); // Today
        salesData.amounts.push(data.filter(order => moment(order.createdAt).isSame(today, 'day')).length);
    }

    return salesData;
}

async function showGraph(filter) {
    const { labels, amounts } = await fetchSalesData(filter);
    const ctx = document.getElementById('salesGraph').getContext('2d');

    // Clear the previous chart if it exists
    if (window.salesGraph instanceof Chart) {
        window.salesGraph.destroy();
    }

    window.salesGraph = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Order Count',
                data: amounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    showGraph('weekly');
});