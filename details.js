// register METHOD:POST
("http://localhost:2030/api/v1/users/register");
// login METHOD:POST
("http://localhost:2030/api/v1/users/login");
// get users profile METHOD :GET
("http://localhost:2030/api/v1/users/profile");
// UPDATE SHIPPING ADDRESS METHOD: PUT
// header/auth:token
// body:{

// firstName:string
//     lastName:string,
//     address:string,
//     city:string,
//     postalCode:string,
//     province:string,
//     phone:string,
//     country:string,
// }
("http://localhost:2030/api/v1/users/update/shipping");

// ===============ADMIN SIDE===========
// CREATE CATEGORY METHOD :POST  =============CATEGORY
// header/auth:token
// body
// {
// name:""
// image:""
// }
("http://localhost:2030/api/v1/categories");
// GET ALL CATEGORIES METHOD:GET
//  header/auth:token
("http://localhost:2030/api/v1/categories");
// GET  SINGLE CATEGORIE METHOD:GET
// header/auth:token
// ("http://localhost:2030/api/v1/categories/id");

("http://localhost:2030/api/v1/categories/65e21ae1eb0c7ccc342945f8");
// UPADATE CATEGORY METHOD:PUT
//  header/auth:token
// body
// {
// name:""
// image:""
// }

("http://localhost:2030/api/v1/categories/id");
// DELETE CATEGORY METHOD : DELETE
//  header/auth:token
// ("http://localhost:2030/api/v1/categories/id");

("http://localhost:2030/api/v1/categories/65e21ae1eb0c7ccc342945f8");
// ADD BRAND METHOD: POST =============BRAND
//  header/auth:token
// body
// {
// name:""
// }

("http://localhost:2030/api/v1/brands");
// GET ALL BRANDS METHOD:GET
//  header/auth:token

("http://localhost:2030/api/v1/brands");
// GET SINGLE BRAND METHOD:GET
//  header/auth:token

("http://localhost:2030/api/v1/brands/65e22224bf2814a6e9cd7bd9");

// DELETE BRAND METHOD:DELETE
//  header/auth:token
// ("http://localhost:2030/api/v1/brands/id");

("http://localhost:2030/api/v1/brands/65e22224bf2814a6e9cd7bd9");

// ADD PRODUCT METHOD:POST  =============PRODUCT
//  header/auth:token

// name:string, description:string, category:string, sizes:string, colors:string, price:number, totalQty:number, brand:string
("http://localhost:2030/api/v1/products");
// Add TO CART METHOD :POST
("http://localhost:2030/api/v1/products/add-to-cart/65ea0d50fa28de92097a9079");
// GET ALL CARTS METHOD:GET
("http://localhost:2030/api/v1/products/add-to-cart/get-allCarts");
// REMOVE CART ITEMS METHOD:POST
("http://localhost:2030/api/v1/products/add-to-cart/65ea0d50fa28de92097a9079/remove");

// GET ALL WISHLIST ITEMS FOR A SPECIFIC USER ,METHOD:GET
("http://localhost:2030/api/v1/products/wishlist/get-all-wishlists");
// ADD TO WISHLIST METHOD:POST
"http://localhost:2030/api/v1/products/wishlist/65ea0d5afa28de92097a907f"(
  // ===============ADMIN SIDE & USERSIDE===========
  // GET ALL PRODUCTS METHOD:GET
  "http://localhost:2030/api/v1/products"
);
// GET SINGLE PRODUCT METHOD:GET
("http://localhost:2030/api/v1/products/65ea0d50fa28de92097a9079");
