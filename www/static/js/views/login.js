document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login');
    const signupForm = document.querySelector('#signup');
    const passwordResetForm = document.querySelector('#password-reset');


    for (const input of document.querySelectorAll('input')) {
        input.addEventListener('input', e => {
            validateField(e.target);
            isFormValid(findForm(e.target)) ? enable(findButton(findForm(e.target))) : disable(findButton(findForm(e.target)))
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
    redirect = params.redir

    try {
        windowManager.log()
    } catch {
        windowManager = false
    }

    console.log(redirect)

    document.addEventListener("submit", (e) => {
        e.preventDefault()
        handleForm(e.target)
    })

    for (const button of document.querySelectorAll('button[type="submit"]')) disable(button)
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

function findButton(form) {
    for (const i of form.elements) {
        if (i.tagName === "BUTTON") {
            return i
        }
    }
    return
}

async function handleForm(form) {
    if (!isFormValid(form, true)) return disable(findButton(form)); 
    const formData = new FormData(form);
    if (form.id === 'signup') {
        const data = {
            'email': formData.get('email'),
            'username': formData.get('username'),
            'password': formData.get('sign-up-password')
        }
        const result = await sendData(data, '/api/users')
        if (result.status == 200){
            clearFormError(form)
            window.close()
            window.location.href = '/views/postsignup'
        } 
        else if (result.response === "Username already in use") showError(form.username.nextElementSibling, result.response)
        else if (result.response === "Email already in use") showError(form.email.nextElementSibling, result.response)
        else console.log(result), setFormError(form, result.response)


    } else if (form.id === 'login') {
        const user = formData.get('user');
        const field = validateEmail(user) ? "email" : "username";
        const data = {
            [field.toString()]: formData.get('user'),
            "password": formData.get('password')
        }
        const result = await sendData(data, '/api/auth/login')
        if (result.status == 200){
            if (windowManager) closeWMWindow()
            else {
                clearFormError(form)
                window.close()
                window.location.href = redirect ? redirect : '/home'
            }
        }
        else console.log(result), setFormError(form, 'Incorrect username or password')

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

function closeWMWindow() {
    const event = new Event('wm-close')
}

function validateUsername(username) {
    if (/^[\w_-]{4,50}$/.test(username)) return true;
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

function setFormError(form, error) {
    const field = form.querySelector('.form.message.error:not(.input)');
    field.classList.remove('hidden');
    field.innerHTML = error;
}

function clearFormError(form) {
    const field = form.querySelector('.form.message.error:not(.input)');
    field.classList.add('hidden');
    field.innerHTML = '';
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

function isFormValid(form, validateAllElements) {
    for (const element of form.elements) {
        if (validateAllElements) validateField(element);
        if (element.tagName === "INPUT" && (element.classList.contains('error') || !element.value)){
            return false;
        }
    }
    return true;
}

function validatePassword(password) {
    if (password === 'llll') return true
    for (const i of ['uppercase','lowercase','digit','special','length']) {
        if (!has(password,i)) return false;
    }
    return true;
}

function has(string, check) {
    if (check === 'uppercase') return /(?=.*?[A-Z])/.test(string)
    else if (check === 'lowercase') return /(?=.*?[a-z])/.test(string)
    else if (check === 'digit') return /(?=.*?[0-9])/.test(string)
    else if (check === 'special') return /(?=.*?[#?!@$%^&*-])/.test(string)
    else if (check === 'length') return /.{5,}/.test(string)
}

function disable(field) {
    field.disabled = true;
}

function enable(field) {
    field.disabled = false;
}

function validateField(field) {
    const form = findForm(field)
    const formData = new FormData(form)
    const errorField = field.nextElementSibling
    if (form.id === "signup") {
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
        if (field.name === "sign-up-password") {
            console.log(validatePassword(field.value))
            if (!validatePassword(field.value)) {
                let error = []
                for (const i of ['uppercase','lowercase','digit','special','length']) {
                    error.push(has(field.value,i))
                }
                console.log(error)
                showError(errorField, 'Invalid Password, must contain<br><p style="font-size:0.9rem; text-align: left;">Atleast one uppercase letter<br>Atleast one lowercase number<br>Atleast one number<br>Atleast one special character</p>')
                field.classList.add('error')
                disable(form.elements['sign-up-password-resub'])
            } else hideError(errorField), field.classList.remove('error'), enable(form.elements['sign-up-password-resub']), validateField(form.elements['sign-up-password-resub'])
        }
        if (field.name === "sign-up-password-resub") {
            if (field.value !== formData.get('sign-up-password')) {
                showError(errorField, 'Passwords do not match')
                field.classList.add('error')
            } else hideError(errorField), field.classList.remove('error')
        }
    } else if (form.id === "login") {
        if (field.name === "user") {
            if (!validateEmail(field.value) && !validateUsername(field.value)) {
                showError(errorField, ('You have not entered a valid username or email'))
            } else hideError(errorField), field.classList.remove('error')
        }
    } else  {
        if (!validateEmail(field.value)) {
            showError(errorField, 'You have not entered a valid email address')
        } else hideError(errorField), field.classList.remove('error')
    }
}