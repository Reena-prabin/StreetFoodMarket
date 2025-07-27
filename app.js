// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHz6W0Bw2ztMXLm2L7uug3vRu8us4OAQ8",
  authDomain: "streetfoodmarket-ce8cf.firebaseapp.com",
  projectId: "streetfoodmarket-ce8cf",
  storageBucket: "streetfoodmarket-ce8cf.firebasestorage.app",
  messagingSenderId: "302629421071",
  appId: "1:302629421071:web:da83dac490093ea3c8a37a",
  measurementId: "G-CH20YD6727"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// ======= Sample Food Items (can be replaced with DB later) =======
const FOOD_ITEMS = [
  { id: 1, name: "Masala Dosa", price: 60 },
  { id: 2, name: "Pani Puri", price: 35 },
  { id: 3, name: "Vada Pav", price: 25 },
  { id: 4, name: "Chole Bhature", price: 75 },
  { id: 5, name: "Egg Roll", price: 50 },
  { id: 6, name: "Samosa", price: 15 }
];

// ======= Cart Array =======
let cart = [];

// ======= DOM Elements =======
const authBlock = document.getElementById('authBlock');
const mainApp = document.getElementById('mainApp');
const itemList = document.getElementById('itemList');
const cartList = document.getElementById('cartList');
const cartTotalElem = document.getElementById('cartTotal');
const billSection = document.getElementById('billSection');
const billDetails = document.getElementById('billDetails');

// ======= Render Available Food Items =======
function renderItems() {
  itemList.innerHTML = '';
  FOOD_ITEMS.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name} <b>₹${item.price}</b></span>
      <button onclick="addToCart(${item.id})">Add to Cart</button>
    `;
    itemList.appendChild(li);
  });
}

// ======= Add Item to Cart =======
function addToCart(id) {
  const item = FOOD_ITEMS.find(x => x.id === id);
  const found = cart.find(x => x.id === id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  renderCart();
}

// ======= Render Cart Items =======
function renderCart() {
  cartList.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name} ×${item.qty} <b>₹${item.price * item.qty}</b></span>
      <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
      <button class="qty-btn" onclick="changeQty(${idx}, -1)">-</button>
    `;
    cartList.appendChild(li);
  });
  cartTotalElem.innerText = total;
}

// ======= Change Quantity for Cart Item =======
function changeQty(idx, diff) {
  cart[idx].qty += diff;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
}

// ======= Show Bill/Checkout Section =======
function showBill() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  let html = "<ul>";
  let total = 0;
  cart.forEach(item => {
    html += `<li>${item.name} ×${item.qty} = ₹${item.price * item.qty}</li>`;
    total += item.price * item.qty;
  });
  html += `</ul><hr><b>Grand Total: ₹${total}</b>`;
  billDetails.innerHTML = html;
  billSection.style.display = '';
}

// ======= Reset/Clear Cart and Bill =======
function resetCart() {
  cart = [];
  renderCart();
  billSection.style.display = 'none';
}

// ================== Firebase Auth Functions ====================

// ======== Signup User ========
function signUp() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!email || !password) {
    alert("Please enter email and password!");
    return;
  }
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert('Signed up! Please login now.'))
    .catch(err => alert(err.message));
}

// ======== Sign in User ========
function signIn() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!email || !password) {
    alert("Please enter email and password!");
    return;
  }
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      authBlock.style.display = 'none';
      mainApp.style.display = '';
      renderItems();
      renderCart();
    })
    .catch(err => alert(err.message));
}

// ======== Sign out User ========
function signOut() {
  auth.signOut()
    .then(() => {
      authBlock.style.display = '';
      mainApp.style.display = 'none';
      resetCart();
    });
}

// ======= Auto-login check on page load =======
window.onload = () => {
  auth.onAuthStateChanged(user => {
    if (user) {
      authBlock.style.display = 'none';
      mainApp.style.display = '';
      renderItems();
      renderCart();
    } else {
      authBlock.style.display = '';
      mainApp.style.display = 'none';
      resetCart();
    }
  });
};

// ======= Expose functions to global (window) for inline onClick to work =======
window.signUp = signUp;
window.signIn = signIn;
window.signOut = signOut;
window.addToCart = addToCart;
window.changeQty = changeQty;
window.showBill = showBill;
window.resetCart = resetCart;
