"use strict";

const serverLink = "https://daws-eshop.herokuapp.com";

const btnRegister = document.getElementById('btnRegister');
const btnLogin = document.getElementById('btnLogin');


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
        if(req.status === 201) {
            alert("El usuario ha sido creado exitosamente");
            window.location.href = "https://daws-eshop.herokuapp.com/Articulos.html";
        }
        if(req.status === 403) alert("El usuario ya existe");
    }
})

//Login
btnLogin.addEventListener('click', () => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const req = new XMLHttpRequest();
    req.open('POST', serverLink + "/api/login");
    req.setRequestHeader('Content-Type', 'application/json');

    req.send(JSON.stringify({
        email: email,
        password: password
    }));

    req.onload = () => {
        if(req.status === 404) return alert("El usuario no existe");
        if(req.status === 401) return alert("Contraseña erronea");
        if(req.status === 200)  {
            alert("Login exitoso");
            console.log(req.getResponseHeader("x-auth"));
        }
    }


})