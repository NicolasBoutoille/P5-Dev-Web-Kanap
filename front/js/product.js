// Création d'un objet product pour l'afficher ensuite sur la page d'accueil//
class Product{
    constructor(jsonProduct){
        jsonProduct && Object.assign(this, jsonProduct);
    }
}