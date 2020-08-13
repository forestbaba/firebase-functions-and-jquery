const requestModal = document.querySelector('.new-request');
const requestLink = document.querySelector('.add-request');
const requestForm = document.querySelector('.new-request form')

requestLink.addEventListener('click', () => {
    requestModal.classList.add('open');
})

requestModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('new-request')) {
        requestModal.classList.remove('open');
    }
})

// add a new request
requestForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const addRequest = firebase.functions().httpsCallable('addRequest');
    addRequest({
        text: requestForm.request.value,
    })
        .then(() => {
            console.log('NNN=> checking')
            requestForm.reset()
            requestForm.classList.remove('open')
            requestForm.querySelector('.error').textContent = ''
        })
        .catch(err => {
            console.log('MMM=> checkout')
            requestForm.querySelector('.error').textContent = err.message
        })
})

// const button = document.querySelector('.call');
// button.addEventListener('click', () => {
//     const sayHello = firebase.function().httpCallable('sayHello');

// })

//notification
const notification = document.querySelector('.notification');

const showNotification = (message) => {
    notification.textContent = message;
    notification.classList.add('active')

    setTimeout(() => {
        notification.classList.remove('active') 
        notification.textContent = ''
        
    }, 4000);
}