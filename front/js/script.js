// Création d'un objet product pour l'afficher ensuite sur la page d'accueil
class Product{
    constructor(jsonProduct){
        jsonProduct && Object.assign(this, jsonProduct);
    }
};

// Récupération et affichage des produits via l'API
fetch("http://localhost:3000/api/products")
    .then(data => data.json())
    .then(jsonListProducts => {
        for(let jsonProduct of jsonListProducts){
            let product = new Product(jsonProduct);
            document.querySelector(".items").innerHTML += `<a href="./product.html?id=${product._id}">
                                                                <article>
                                                                <img src="${product.imageUrl}" alt="${product.altTxt}">
                                                                <h3 class="productName">${product.name}</h3>
                                                                <p class="productDescription">${product.description}</p>
                                                                </article>
                                                            </a>`
        }
    });