function filterOrders(filter) {
    console.log('req')
  window.location.href = `/admin/?filter=${filter}`;
}
document.getElementById('custom-filter-btn').addEventListener('click', function() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (startDate && endDate) {
        window.location.href = `/admin/?startDate=${startDate}&endDate=${endDate}`;
    } else {
        alert("Please select both start and end dates.");
    }
});

document.getElementById('download-pdf-btn').addEventListener('click', function() {
    console.log('req')
    const filter = new URLSearchParams(window.location.search).get('filter');
    const startDate = new URLSearchParams(window.location.search).get('startDate');
    const endDate = new URLSearchParams(window.location.search).get('endDate');
    
    let url = `/admin/report?filter=${filter || ''}`;
    if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    
    window.location.href = url;
});