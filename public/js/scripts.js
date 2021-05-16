"use strict";

const btnRegister = document.getElementById('btnRegister');

//Registrar usuario
btnRegister.addEventListener('click', () => {
    event.preventDefault();
    const name = document.getElementById('registerName');
    const email = document.getElementById('registerEmail');
    const password = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('registerConfirmPassword');

    if(password.value != confirmPassword.value)
        return alert('No coinciden las contraseñas');

    let req = new XMLHttpRequest();
    req.open('POST', "https://daws-eshop.herokuapp.com/api/users");
    req.setRequestHeader('Content-Type', 'application/json');

    req.send(JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value
    }))

    req.onload = () => {
        if(req.status === 201) alert("El usuario ha sido creado exitosamente");
        if(req.status === 401) alert("El usuario ya existe");
    }

})