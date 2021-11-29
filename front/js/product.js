// Récupération de l'id du produit dans l'url//
var str = window.location.href;
var url = new URL(str);
var productId = url.searchParams.get("id");

// Création d'un object ProductDetail pour l'afficher dans la page product//
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
}
// Récupération et affichage du produit detaillé //
fetch("http://localhost:3000/api/products/" + productId)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(ProductDetail) {
    console.log(ProductDetail);
    document.querySelector(".item__img").innerHTML += `<img src="${ProductDetail.imageUrl}" alt="${ProductDetail.altTxt}">`;
    document.getElementById("title").textContent = `${ProductDetail.name}`;
    document.getElementById("price").textContent = `${ProductDetail.price}`;
    document.getElementById("description").textContent = `${ProductDetail.description}`;
    document.getElementById("colors").innerHTML += `<option value="${ProductDetail.colors[0]}">${ProductDetail.colors[0]}</option>
                                                    <option value="${ProductDetail.colors[1]}">${ProductDetail.colors[1]}</option>
                                                    <option value="${ProductDetail.colors[2]}">${ProductDetail.colors[2]}</option>
                                                    <option value="${ProductDetail.colors[3]}">${ProductDetail.colors[3]}</option>`

  })
  .catch(function(err) {
  });
  
