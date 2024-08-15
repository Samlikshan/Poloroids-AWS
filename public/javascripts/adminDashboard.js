// async function fetchDashboard() {
//     try {
//         const response = await fetch('/admin/dashboard', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });
//         if (response.ok) {

//             const data = await response.json();
//             console.log('Dashboard Data:', data);
//         } else {
//             window.location.href = '/admin/login'
//             console.log('Failed to fetch data');

            
//         }
//     } catch (error) {
//         console.error('Fetch error:', error);
//     }
// }


// fetchDashboard()