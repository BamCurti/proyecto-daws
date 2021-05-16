"use strict";

const serverLink = "https://daws-eshop.herokuapp.com";

const btnRegister = document.getElementById('btnRegister');
const btnLogin = document.getElementById('btnLogin');
let articles;

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
            sessionStorage["x-auth"] = JSON.parse(req.responseText)['XToken'];

            console.log(sessionStorage["x-auth"]);
        }
    }


})

function getAllArticles() {
    const req = new XMLHttpRequest();
    req.open('GET', serverLink + '/api/articles')
    req.setRequestHeader('Content-Type', 'application/json')

    req.send();
    req.onload = () => {
        articles = JSON.parse(req.response);
        articleListToHTML(articles);
    }
}

function articleToHTML(article) {
    return `<div class="col-lg-4 col-md-6 mb-4">
    <div class="card h-100">
        <a href="${serverLink + "/article.html?uid=" + article.uid}"><img class="card-img-top" src="${article.image}" alt="..." /></a>
        <div class="card-body">
            <h4 class="card-title"><a href="#!" data-toggle="modal" data-target="#modalArticle">${article.description}</a></h4>
            <h5>$${article.price}</h5>
        </div>
        
    </div>
</div>`;
}

function articleListToHTML(list) {
    document.getElementById("allArticles").innerHTML = list.map(article => articleToHTML(article)).toString();
}

getAllArticles()