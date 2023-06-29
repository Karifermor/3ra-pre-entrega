let cartArray = JSON.parse(localStorage.getItem("cartArray")) || [];

// Carga los datos del cartArray desde el LocalStorage
if (localStorage.getItem("cartArray")) {
  cartArray = JSON.parse(localStorage.getItem("cartArray"));
}

const carroStr = JSON.stringify(cartArray)
localStorage.setItem("cartArray", carroStr)


const listaVacia = document.querySelector("#cartList");
const formulario = document.querySelector("#formulario");
const inputName = document.querySelector("#inputName");
const inputEmail = document.querySelector("#inputEmail");
const btnForm = document.querySelector("#btnForm");
const barra = document.querySelector("#barra");
const sesion = document.querySelector("#sesion");

// Carga los datos del usuario desde el LocalStorage
const userData = JSON.parse(localStorage.getItem("userData")) || {};

// pone la info guardada en el LocalStorage, si es que hay
inputName.value = userData.name || "";
inputEmail.value = userData.email || "";

// ve si el usuario inicio sesión según el valor de inputName
const isLoggedIn = inputName.value.trim() !== "";

// log in o log out dependiendo si esta logeado o no
const logInOut = document.createElement("a");
logInOut.classList.add("btn", "btn-sm", "float-right", "login-link");


if (isLoggedIn) {
  logInOut.innerHTML = "Log out";
} else {
  logInOut.innerHTML = "Log in";
  logInOut.href = "#formulario";
}

sesion.appendChild(logInOut);

logInOut.addEventListener("click", () => {
  localStorage.removeItem("userData");
  localStorage.removeItem("perfil");
  cartArray = [];
  localStorage.removeItem("cartArray");
  inputName.value = "";
  barra.innerHTML = "";

  logInOut.innerHTML = "Log in";

  // Borra el href segun si esta logeado o no
  if (!isLoggedIn) {
    logInOut.href = "#formulario";
  } else {
    logInOut.removeAttribute("href");

  }
});

formulario.addEventListener("submit", (e) => validarFormulario(e));
btnForm.addEventListener("click", (e) => {
  e.preventDefault();
  botonForm(e);
});

// ve si la info del perfil existe en el local storage
if (localStorage.getItem("perfil")) {
  const perfilText = localStorage.getItem("perfil"); // Traigo el nombre nuevamente
  const perfil = document.createElement("div");
  perfil.style.color = "black";
  perfil.innerHTML = `<p>${perfilText}</p>`;
  barra.appendChild(perfil);
}

function botonForm(e) {
  btnConfirm();
  validarFormulario(e);
}

function btnConfirm() {
  Swal.fire({
    position: "center",
    icon: "success",
    title: `<p>Welcome ${inputName.value}!</p>`,
    showConfirmButton: false,
    timer: 1500,
  });
}

function validarFormulario(e) {
  e.preventDefault();

  // Checkea si esta logeado
  if (!isLoggedIn) {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();

    if (name === "" || email === "") {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please fill in all fields",
      });
      return;
    }

    // guardo la info
    const userData = { name, email };
    localStorage.setItem("userData", JSON.stringify(userData));
  }

  const perfil = document.createElement("div");
  perfil.style.color = "black";
  perfil.innerHTML = `<p>Hi ${inputName.value}</p>`;

  const perfilText = perfil.innerText; // para que en el storage no guarde la <p> sino solo el texto
  localStorage.setItem("perfil", perfilText);

  logInOut.innerHTML = "Log out";

  barra.appendChild(perfil);

  inputName.value = "";
  inputEmail.value = "";
}
  

function borrarCarrito(itemName) {
  const itemIndex = cartArray.findIndex((item) => item.name === itemName);
  if (itemIndex !== -1) {
    cartArray.splice(itemIndex, 1);
    updateCart();

    localStorage.setItem("cartArray", JSON.stringify(cartArray));
  }
}

function updateCart() {
  listaVacia.innerHTML = "";

  let totalPrice = 0;

  cartArray.forEach((item) => {
    const itemName = item.name;
    let itemQuantity = item.quantity;

    const carritoListaNuevo = document.createElement("li");
    carritoListaNuevo.classList.add("list-group-item");

 
    const itemDetails = document.createElement("div");
    itemDetails.classList.add("item-details");

    const itemNameSpan = document.createElement("span");
    itemNameSpan.classList.add("subTotal")
    itemNameSpan.textContent = itemName;

    // boton + 
    const btnIncrement = document.createElement("button");
    btnIncrement.classList.add("btnIncrement");
    btnIncrement.textContent = "+";
    btnIncrement.addEventListener("click", () => {

      item.quantity++;
      updateCart();
    });

    // boton -
    const btnDecrement = document.createElement("button");
    btnDecrement.classList.add("btnDecrement");
    btnDecrement.textContent = "-";
    btnDecrement.addEventListener("click", () => {

      if (item.quantity > 1) {
        item.quantity--;
        updateCart();
      }
    });


    const itemQuantitySpan = document.createElement("span");
    itemQuantitySpan.classList.add("quantitiSpan")
    itemQuantitySpan.textContent = ` x ${itemQuantity} `;

    // Subtotal
    const itemPrice = document.createElement("span");
    itemPrice.classList.add("float-right", "subTotal");
    itemPrice.textContent = "US$" + (getItemPrice(itemName) * itemQuantity).toFixed(2);

    const btnBorrar = document.createElement("button");
    btnBorrar.classList.add("btn", "btn-sm", "float-right");

    // icon delete
    const deleteIcon = document.createElement("img");
    deleteIcon.classList.add("btnDelete");
    deleteIcon.src = "./icons/Deleteboton.png";

    btnBorrar.appendChild(deleteIcon);

    btnBorrar.addEventListener("click", () => {
      borrarCarrito(itemName);
    });

    itemDetails.appendChild(itemNameSpan);
    itemDetails.appendChild(btnDecrement);
    itemDetails.appendChild(itemQuantitySpan);
    itemDetails.appendChild(btnIncrement);
    itemDetails.appendChild(btnBorrar)

    carritoListaNuevo.appendChild(itemDetails);
    carritoListaNuevo.appendChild(itemPrice);
    listaVacia.appendChild(carritoListaNuevo);

    totalPrice += getItemPrice(itemName) * itemQuantity;
  });

  const totalElement = document.createElement("div");
  totalElement.textContent = "Total: US$" + totalPrice.toFixed(2);
  listaVacia.appendChild(totalElement);

  const contar = document.querySelector("#navbarNav .badge");
  contar.textContent = cartArray.length;

  // Si hay algo en el carrito se muestra el boton "confirmPurchaseBtn"
  if (cartArray.length > 0) {
    confirmPurchaseBtn.style.display = "block";
  } else {
    confirmPurchaseBtn.style.display = "none";
  }

  // Actualizo el cartArray en el localStorage
  localStorage.setItem("cartArray", JSON.stringify(cartArray));
}


function getItemPrice(itemName) {
  const product = products.find((prod) => prod.name === itemName);
  return product ? product.price : 0;
}

function getItemPrice(itemName) {
  const product = products.find((prod) => prod.name === itemName);
  return product ? product.price : 0;
}


const confirmPurchaseBtn = document.createElement("button");
confirmPurchaseBtn.classList.add("btn", "btn-success", "btn-sm", "float-right");
confirmPurchaseBtn.textContent = "Confirm purchase";

if (!document.querySelector("#cartCollapse .card button")) {
  const aceptar = document.querySelector("#cartCollapse .card");
  aceptar.appendChild(confirmPurchaseBtn);
}

confirmPurchaseBtn.addEventListener("click", confirmPurchase);
const aceptar = document.querySelector("#cartCollapse .card");
aceptar.appendChild(confirmPurchaseBtn);



function confirmPurchase() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  confirmPurchaseBtn.style.display = "none";

  Swal.fire({
    icon: 'success',
    title: 'Thak you for your purchase',
    text: `The pattern/s will be sent to your email! ${userData.email}!`,
    showConfirmButton: false,
    timer: 2000
  });

  cartArray = [];
  updateCart(); 

    // Borro el cartArray del localStorage luego de que se confirme la compra
    localStorage.removeItem("cartArray");

}


let products = []; 

async function obtenerProductos() {
  const respuesta = await fetch("./data.json");
  products = await respuesta.json();

const garmentTypeSelect = document.querySelector("#garmentType");

    garmentTypeSelect.addEventListener("change", () => {
      const selectedType = garmentTypeSelect.value;
      filterItemsByType(selectedType);
    });
  
    function filterItemsByType(type) {
      let filteredItems;
    
      if (type === "all") {
        filteredItems = products;
      } else {
        // Muestra los productos segun el tipo seleccionado
        filteredItems = products.filter((item) => {
          return item.type === type;
        });
      }
    
      // para filtrar los items
      displayItems(filteredItems);
    }
    
  
    function displayItems(items) {
      galeria.innerHTML = ""; // limpia la galeria

    items.forEach((prod) => {
      let card = document.createElement('div');
      card.classList.add("productCard");
      card.innerHTML = `
        <img class="patterns" src="${prod.imagen}" alt="..." width="400">
        <h4 class="prodTitle">${prod.name}</h4>
        <h6 class="prodPrice">US$ ${prod.price}</h6>
        <a href="#" class="btnComprar btn btn-dark">SHOP</a>
      `;
      galeria.append(card);

      const btnComprar = card.querySelector(".btnComprar");
      btnComprar.addEventListener("click", (e) => {
        e.preventDefault();
        const productName = prod.name; 
        agregarAlcarrito(productName);
        agregado(productName); 
        
      });
      
    });
    
  }
  

  const galeria = document.querySelector(".boxModel");
  products.forEach((prod) => {
      let card = document.createElement('div');
      card.classList.add("productCard");
      card.innerHTML = `
        <img class="patterns" src="${prod.imagen}" alt="..." width="400">
        <h4 class="prodTitle">${prod.name}</h4>
        <h6 class="prodPrice">US$ ${prod.price}</h6>
        <a href="#" class="btnComprar btn btn-dark">SHOP</a>
      `;
      galeria.append(card);
  
      const btnComprar = card.querySelector(".btnComprar");
      btnComprar.addEventListener("click", (e) => {
        e.preventDefault();
        const productName = prod.name; 
        agregarAlcarrito(productName);
        agregado(productName); 
      });
    });
  }
  
  obtenerProductos();


  function agregarAlcarrito(name) {
    const existingItem = cartArray.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity++; // Si ya hay 1 item, agrega otro
    } else {
      const newItem = { name: name, quantity: 1 }; // Si no hay nada en el carrito, crea 1
      cartArray.push(newItem);
    }
  
    const cartCountBadge = document.querySelector(".badge-primary");
    cartCountBadge.textContent = cartArray.length;
  
    // Despues que se realiza una compra, borra la lista del carrito antes de volver a llenarla
    const cartList = document.querySelector("#cartList");
    cartList.innerHTML = "";
  
    // Rellena la lista del carrito
  cartArray.forEach((item) => {
    if (item.name !== undefined && item.quantity !== undefined) {
      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.textContent = `${item.name} x ${item.quantity}`;

      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "btn-sm", "float-right");
      btnBorrar.textContent = "Delete";
      btnBorrar.addEventListener("click", () => {
        borrarCarrito(item.name);
      });

      listItem.appendChild(btnBorrar);
      cartList.appendChild(listItem);
    }
  });
    updateCart();


    const contar = document.querySelector("#navbarNav .badge");
    contar.textContent = cartArray.length;

 localStorage.setItem("cartArray", JSON.stringify(cartArray));
}
  
updateCart();
  

  function agregado(productName) { 
    Toastify({
        text: productName + " added to your cart ✨🧶",
        duration: 1000,
        style: {
            background: "linear-gradient(to right, #0006, #0006)",
          },        
        }).showToast();
  }
  

  
let mybutton = document.getElementById("myBtn");

//Boton para subir si detecta scroll
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// scroll
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}