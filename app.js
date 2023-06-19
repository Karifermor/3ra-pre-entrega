


let cartArray = JSON.parse(localStorage.getItem("cartArray")) || [];


// Load the cartArray from localStorage on page load
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

//Borra la info de userData (nombre y correo) y deberia borrar el perfil (donde esta el nombre que se muestra en la barra)

// logInOut.addEventListener("click", ()=>{
//     console.log("hola que tal")
//     const perfilVacio = ""
//     localStorage.setItem("perfil", perfilVacio);
//     localStorage.setItem("userData", perfilVacio);

//     logInOut.innerHTML = "Log in";
  
//     barra.appendChild(perfilVacio);
//   })

logInOut.addEventListener("click", () => {
  localStorage.removeItem("userData");
  localStorage.removeItem("perfil");
  cartArray = [];
  localStorage.removeItem("cartArray");
  inputName.value = "";
  barra.innerHTML = "";

  logInOut.innerHTML = "Log in";

  // Update the href property based on the user's login status
  if (!isLoggedIn) {
    logInOut.href = "#formulario";
  } else {
    logInOut.removeAttribute("href");
  }
});

// logInOut.addEventListener("click", () => {
//   localStorage.removeItem("userData");
//   localStorage.removeItem("perfil");
//   cartArray = [];
//   inputName.value = "";
//   barra.innerHTML = "";

//   logInOut.innerHTML = "Log in";

//   // Remove the cartArray from localStorage only when the user logs out
//   if (!isLoggedIn) {
//     localStorage.removeItem("cartArray");
//   }
// });


////////////////////////////////////////


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
    const item = cartArray[itemIndex];
    if (item.quantity > 1) {
      item.quantity--; // Si hay mas de 1 del mismo item, quita 1
    } else {
      cartArray.splice(itemIndex, 1); // Si la cantidad del producto en el carrito es 1, lo quita
    }
    updateCart();

    localStorage.setItem("cartArray", JSON.stringify(cartArray));

    // Swal.fire({
    //   icon: "success",
    //   title: "Item Removed",
    //   text: `One item of "${item.name}" has been removed from your cart.`,
    // });
  }
}






function updateCart() {
  listaVacia.innerHTML = "";

  let totalPrice = 0;

  cartArray.forEach((item) => {
    const itemName = item.name;
    const itemQuantity = item.quantity;
    const carritoListaNuevo = document.createElement("li");
    carritoListaNuevo.classList.add("list-group-item");
    carritoListaNuevo.textContent = `${itemName} x ${itemQuantity}`;

    const itemPrice = document.createElement("span");
    itemPrice.classList.add("float-right");
    itemPrice.textContent = (getItemPrice(itemName) * itemQuantity).toFixed(2);

    const btnBorrar = document.createElement("button");
    btnBorrar.classList.add("btn", "btn-danger", "btn-sm", "float-right");
    btnBorrar.textContent = "Delete";
    btnBorrar.addEventListener("click", () => {
      borrarCarrito(itemName);
    });

    carritoListaNuevo.appendChild(itemPrice);
    carritoListaNuevo.appendChild(btnBorrar);
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
// confirmPurchaseBtn.style.display = "none";


function confirmPurchase() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  confirmPurchaseBtn.style.display = "none";

  Swal.fire({
    icon: 'success',
    title: 'Thak you for your purchase',
    text: `The pattern will be sent to your email! ${userData.email}!`,
    showConfirmButton: false,
    timer: 2000
  });

  cartArray = [];
  updateCart(); 
  // confirmPurchaseBtn.style.display = "none";

    // Borro el cartArray del localStorage luego de que se confirme la compra
    localStorage.removeItem("cartArray");

}


let products = []; 

async function obtenerProductos() {
  const respuesta = await fetch("./data.json");
  products = await respuesta.json();

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

  
    // Mostrar o no el mensaje "Your cart is empty"
    // const emptyCartMessage = document.querySelector("h6");
    // if (cartArray.length > 0) {
    //   emptyCartMessage.style.display = "none";
    // } else {
    //   emptyCartMessage.style.display = "block";
    // }

 localStorage.setItem("cartArray", JSON.stringify(cartArray));
}
  
updateCart();
  
     //alerta de confirmacion de toastify
  function agregado(productName) { 
    Toastify({
        text: productName + " added to your cart ✨🧶",
        duration: 1000,
        style: {
            background: "linear-gradient(to right, #0006, #0006)",
          },        
        }).showToast();
  }
  
  obtenerProductos();
  
