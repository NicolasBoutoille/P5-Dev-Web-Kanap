// Récupération du panier depuis le local storage
let Cart = JSON.parse(localStorage.getItem("Panier"));

// Fonction pour supprimer le produit avec l'id et la couleur correspondante
function removeFromCart(id, color){
    Cart = Cart.filter(product => {
        if(product.id == id && product.color == color){
            return false;
        } 
        return true;
    });
    localStorage.setItem("Panier", JSON.stringify(Cart));
};

// Fonction pour modifier la quantité
function changeQuantity(product, newQuantity){
    product.quantity = newQuantity;
    localStorage.setItem("Panier", JSON.stringify(Cart));
};

// Création d'une fonction qui parcoure le panier
if (Cart === null || Cart == 0) {
    document.getElementById("cart__items").innerHTML += 
    `<p> Votre panier est vide </p>`
}else{
    Cart.forEach(function(product) {
        // Récupération des infos manquantes via l'API
        fetch("http://localhost:3000/api/products/" + `${product.id}`)
        .then(data => data.json())
        .then(function(productDetail){
            // Ajout des produits dans la page panier
            document.getElementById("cart__items").innerHTML += `
                <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                    <div class="cart__item__img">
                        <img src="${productDetail.imageUrl}" alt="${productDetail.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                        <h2>${productDetail.name}</h2>
                        <p>${product.color}</p>
                        <p id="priceProduct">${productDetail.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                        </div>
                    </div>
                </article>`
            // Sélection des boutons supprimer
            document.querySelectorAll(".deleteItem").forEach(button => {
                // Pour chaque clique
                button.addEventListener("click", (e) => {
                    // Récupération de l'id et de la couleur du produit
                    let removeId = e.currentTarget.closest(".cart__item").dataset.id;
                    let removeColor = e.currentTarget.closest(".cart__item").dataset.color;
                    // Suppression du produit
                    removeFromCart(removeId, removeColor);
                    // Actualisation de la page
                    window.location.reload();
                });
            })
            // Modification de la quantité
            document.querySelectorAll(".itemQuantity").forEach(inputQuantity => {
                inputQuantity.addEventListener("change", (e) => {
                    let newQuantity = e.currentTarget.closest(".itemQuantity").value;
                    let id = e.currentTarget.closest(".cart__item").dataset.id;
                    let color = e.currentTarget.closest(".cart__item").dataset.color;
                    let myProduct = Cart.find(e => (e.id === id)&&(e.color === color));
                    changeQuantity(myProduct, newQuantity);
                    window.location.reload();
                    })
            })
        })
    })
}
// Calcul du total
if (Cart !== null){
    let sumProduct = 0;
    let sumPrice = 0;
    for(let product of Cart){
        // Calcul de la quantité
        let quantityLoop = parseInt(product.quantity)
        sumProduct += quantityLoop;
        document.getElementById("totalQuantity").innerHTML = sumProduct;
        // Calcul du prix
        fetch("http://localhost:3000/api/products/" + `${product.id}`)
        .then( data => data.json())
        .then(function(productDetail){
            let moneyLoop = productDetail.price
            sumPrice += moneyLoop * quantityLoop
            document.getElementById("totalPrice").innerHTML = sumPrice;
        });
    }
}

// Création d'une fonction pour vérifier les éléments du formulaire
function checkInput(inputElt, regExp){
    let regle = new RegExp(
        regExp
    );
    let errorMsg = inputElt.nextElementSibling;
    if (regle.test(inputElt.value)) {
        errorMsg.innerHTML = "";
        return true;
    } else{
        errorMsg.innerHTML = `${inputElt.dataset.error}`;
        return false;
    } 
}

// On vérifie les inputs au changement
let form = document.querySelector(".cart__order__form");
let letterRegExp = new RegExp('^[A-Za-z][A-Za-z\é\è\ê\-]+$','g');
let addressRegExp = new RegExp('[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)*','g');
let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$','g');
form.firstName.addEventListener("change", function(){
    checkInput(form.firstName, letterRegExp);
})
form.lastName.addEventListener("change", function(){
    checkInput(form.lastName, letterRegExp);
})
form.address.addEventListener("change", function(){
    checkInput(form.address, addressRegExp);
})
form.city.addEventListener("change", function(){
    checkInput(form.city, letterRegExp);
})
form.email.addEventListener("change", function(){
    checkInput(form.email, emailRegExp);
});

// Fonction pour créer un tableau de produits
let products = [];
if (Cart !== null){
    for(let product of Cart){
        let productId = product.id;
        products.push(productId);
    }
};

// Écoute de la soumission du formulaire
form.addEventListener("submit", function(e){
    e.preventDefault();
    if (checkInput(form.firstName, letterRegExp) &&
    checkInput(form.lastName, letterRegExp) &&
    checkInput(form.address, addressRegExp) &&
    checkInput(form.city, letterRegExp) &&
    checkInput(form.email, emailRegExp)){
        form.submit;
        const contact = {
            firstName : document.getElementById("firstName").value,
            lastName : document.getElementById("lastName").value,
            address : document.getElementById("address").value,
            city : document.getElementById("city").value,
            email : document.getElementById("email").value
        }
        if(Cart.length > 0){
            send(contact, products);
        }
    }
});

// Fonction pour soumettre un formulaire
function send(contact, products){
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contact, products }),
    })
    .then(res => res.json())
    .then(function(data){
        let url = new URL(window.location.href = "./confirmation.html?id=" + data.orderId);
        }
    )};


