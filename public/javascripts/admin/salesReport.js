function filterOrders(filter) {
  window.location.href = `/admin/sales-report?filter=${filter}`;
}
document.getElementById('custom-filter-btn').addEventListener('click', function() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (startDate && endDate) {
        window.location.href = `/admin/sales-report?startDate=${startDate}&endDate=${endDate}`;
    } else {
        toastr.warning('Please select both start and end dates.');
    }
});

document.getElementById('download-pdf-btn').addEventListener('click', function() {
    const filter = new URLSearchParams(window.location.search).get('filter');
    const startDate = new URLSearchParams(window.location.search).get('startDate');
    const endDate = new URLSearchParams(window.location.search).get('endDate');    
    let url = `/admin/report?filter=${filter || ''}`;
    if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    
    window.location.href = url;
});
document.getElementById('download-excel-btn').addEventListener('click', function() {
    const filter = new URLSearchParams(window.location.search).get('filter');
    const startDate = new URLSearchParams(window.location.search).get('startDate');
    const endDate = new URLSearchParams(window.location.search).get('endDate');
    
    let url = `/admin/excelReport?filter=${filter || ''}`;
    if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    
    window.location.href = url;
});
