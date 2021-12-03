// Récupération de l'id du produit dans l'url
let str = window.location.href;
let url = new URL(str);
let productId = url.searchParams.get("id");

// Création d'un object ProductDetail pour l'afficher dans la page product
class ProductDetail{
    constructor(jsonProductDetail){
        this.colors = jsonProductDetail.colors;
        this._id = jsonProductDetail._id;
        this.name = jsonProductDetail.name;
        this.price = jsonProductDetail.price;
        this.imageUrl = jsonProductDetail.imageUrl;
        this.description = jsonProductDetail.description;
        this.altTxt = jsonProductDetail.altTxt;
    }
};

// Récupération via l'API et affichage du produit detaillé 
fetch("http://localhost:3000/api/products/" + productId)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(ProductDetail) {
    document.querySelector(".item__img").innerHTML += `<img src="${ProductDetail.imageUrl}" alt="${ProductDetail.altTxt}">`;
    document.getElementById("title").textContent = `${ProductDetail.name}`;
    document.getElementById("price").textContent = `${ProductDetail.price}`;
    document.getElementById("description").textContent = `${ProductDetail.description}`;
    document.getElementById("colors").insertAdjacentHTML("beforeend", ProductDetail.colors.map(color => `<option id= "valueColor" value="${color}">${color}</option>`));                                                                           
  })

  
  // Ecoute du bouton "addToCart" lors du click
  const button = document.getElementById("addToCart");
  button.addEventListener('click', event =>{
    // Récupération de la quantité et de la couleur du produit
    let productQuantity = document.getElementById("quantity").value;
    let color = document.getElementById("colors");
    let productColor = color.options[color.selectedIndex].text;
    // Sauvegarde du panier 
    function saveBasket(basket) {
      localStorage.setItem("Panier", JSON.stringify(basket));
    }
    // Récupération du panier
    function getBasket(){
      let basket = localStorage.getItem("Panier");
      if (basket == null) {
        return [];
      } else {
        return JSON.parse(basket);
      }
    }
    // Ajout du panier
    function addBasket(product) {
      let basket = getBasket();
      // On cherche si l'id du produit est déjà présent dans le panier
      let foundProduct = basket.find(p => p.id == product.id);
      if (foundProduct != undefined){  
        // Si c'est le cas, on cherche si la couleur est déjà présente
        let foundColor = basket.find(p => p.color == product.color);
        if (foundColor != undefined){
          // Si le produit et la couleur sont déjà présent on ajoute la quantité souhaité
          foundColor.quantity = foundColor.quantity + JSON.parse(productQuantity) ;
        }else{
          product.quantity = JSON.parse(productQuantity);
          basket.push(product);
        }  
      // sinon on l'ajoute au panier   
      }else{
            product.quantity = JSON.parse(productQuantity);
            basket.push(product);
      }
      saveBasket(basket);
    }
    // Pour chaque click sur le bouton "Ajouter" on ajoute un produit avec ses informations dans le panier
    addBasket({"id": productId, "quantity": productQuantity, "color": productColor});
  });
    
  

  

