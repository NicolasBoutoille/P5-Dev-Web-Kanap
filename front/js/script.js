// Récupération et affichage des produits via l'API //
fetch("http://localhost:3000/api/products")
    .then(data => data.json())
    .then(jsonListProducts => {
        for(let jsonProduct of jsonListProducts){
            let product = new Product(jsonProduct);
            document.querySelector(".items").innerHTML += `<a href="./product.html?id=42">
                                                                <article>
                                                                <img src="${product.imageUrl}" alt="${product.altTxt}">
                                                                <h3 class="productName">${product.name}</h3>
                                                                <p class="productDescription">${product.description}</p>
                                                                </article>
                                                            </a>`
        }
    });