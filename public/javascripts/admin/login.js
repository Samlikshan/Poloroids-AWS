document.getElementById("admin-loginForm").addEventListener('submit',async function(event){
    event.preventDefault()
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try{
        const response = await fetch('/admin/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({username,password})
        })
        if(response.ok){
            const data = await response.json()   
            localStorage.setItem('Token',data.token)
            window.location.href= '/admin/'
        }else{
            const errorData = await response.json()
            errorDisplay(errorData.message)
            
        }
    }catch(err){
        console.log('error',err);
        
    }
})


function errorDisplay(message) {
    const errorElement = document.querySelector('.error');
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        const newErrorElement = document.createElement('p');
        newErrorElement.classList.add('error');
        newErrorElement.textContent = message;
        document.querySelector('.login-container').prepend(newErrorElement);
    }
}