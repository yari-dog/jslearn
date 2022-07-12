document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login');
    const signupForm = document.querySelector('#signup');
    const passwordResetForm = document.querySelector('#password-reset');


    for (const input of document.querySelectorAll('input')) {
        input.addEventListener('input', e => {
            validateField(e);
        })
    }
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.flow) {
        if (params.flow === 'signup') {
            loginForm.classList.add('hidden');
            passwordResetForm.classList.add('hidden');
            signupForm.classList.remove('hidden')
        } else if (params.flow === 'passwordreset') {
            loginForm.classList.add('hidden');
            passwordResetForm.classList.remove('hidden');
            signupForm.classList.add('hidden')
        }
    }

    document.addEventListener("submit", (e) => {
        e.preventDefault()
        handleForm(e)
    })

    // #region form selection listeners
    for (const i of document.querySelectorAll('#linkCreateAccount')){
        i.addEventListener("click", () => {
            loginForm.classList.add('hidden');
            passwordResetForm.classList.add('hidden');
            signupForm.classList.remove('hidden')
        })
    }

    for (const i of document.querySelectorAll('#linkLogin')){
        i.addEventListener("click", () => {
            loginForm.classList.remove('hidden');
            passwordResetForm.classList.add('hidden');
            signupForm.classList.add('hidden')
        })
    }

    for (const i of document.querySelectorAll('#linkPasswordReset')){
        i.addEventListener("click", () => {
            loginForm.classList.add('hidden');
            passwordResetForm.classList.remove('hidden');
            signupForm.classList.add('hidden')
        })
    }
    // #endregion
})

async function handleForm(e) {
    const form = e.target
    const formData = new FormData(form);
    if (form.id === 'signup') {
        const data = {
            'email': formData.get('email'),
            'username': formData.get('username'),
            'password': formData.get('password')
        }
        const result = await sendData(data, '/api/users')
        if (result.status == 200){
            window.close()
            window.location.href = '/home'
        } else console.log(result)


    } else if (form.id === 'login') {
        const user = formData.get('user');
        const field = validateEmail(user) ? "email" : "username";
        const data = {
            [field.toString()]: formData.get('user'),
            "password": formData.get('password')
        }
        const result = await sendData(data, '/api/auth/login')
        if (result.status == 200){
            window.close()
            window.location.href = '/home'
        } else console.log(result)

    } else if (form.id === 'password-reset') {

    } else return false;
}

async function sendData(data, endpoint)  {
    return await sendRequest(data,endpoint);
}

async function sendRequest(data, endpoint) {
    return new Promise (function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", endpoint, true);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.onload = function () { 
            resolve({status: xhr.status, response: xhr.response});
        };
        xhr.send(JSON.stringify(data));
    });
}

function validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
      return (true)
    }
      return (false)
}

function validateUsername(username) {
    if (/^\S+([a-zA-Z0-9_-]{3,})/gis.test(username)) return true;
    return false;
}

function showError(error, message){
    error.innerHTML = message;
    error.classList.remove('hidden')
    return true;
}

function hideError(error){
    error.classList.add('hidden')
    return true;
}

function hideAllErrors(){
    for (const error of document.querySelectorAll('.error:not(.hidden)')) {
        hideError(error)
    }
    return true;
}

function findForm(field) {
    let form = field.parentNode;
    for (let i = 0; i < 10; i++) {
        if (form.tagName === "FORM") {
            return form;
        }
        if (form.tagName === "BODY") {
            console.error('failed to find form')
        }
        form = form.parentNode
    }
}

function isFormValid(form) {
    console.log(form.elements)
    for (const element of form.elements) {
        if (element.tagName === "INPUT" && (element.classList.contains('error') || !element.value)){
            return false;
        }
    }
    return true;
}

function validatePassword(password) {
    return false;
}

function validateField(e) {
    const field = e.target
    const form = findForm(field)
    const errorField = field.nextElementSibling
    console.log(isFormValid(form))
    if (field.name === "email") {
        if (!validateEmail(field.value)) {
            showError(errorField, 'Invalid Email Address')
            field.classList.add('error')
        } else hideError(errorField), field.classList.remove('error')
    }
    if (field.name === "username") {
        if (!validateUsername(field.value)) {
            showError(errorField, 'Invalid Username')
            field.classList.add('error')
        } else hideError(errorField), field.classList.remove('error')
    }
    if (field.name === "password") {
        if (!validatePassword(field.value)) {
            showError(errorField, 'Invalid Password, must contain<br><p>Atleast one uppercase letter<br>Atleast one lowercase number<br>Atleast one number<br>Atleast one special character</p>')
            field.classList.add('error')
        } else hideError(errorField), field.classList.remove('error')
    }
}