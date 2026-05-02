'use strict'

const catalog = document.getElementById("catalog")

fetch("./data/products.json")
  .then(response => response.json())
  .then(getProducts)
  .catch(err => console.error("Ошибка загрузки JSON:", err))

function getProducts(data) {
  catalog.innerHTML = "" // очищаем "карточки товаров"

  for (let productName in data) {
    const productData = data[productName]
    const productCard = getProductCard(productName, productData)
    catalog.append(productCard)
  }
}

function getProductCard(productName, productData) {

  const productCard = document.createElement('div')
  productCard.className = "description"

  const title = document.createElement('h4')
  title.innerText = productName
  productCard.append(title)

  const img = document.createElement("img")
  img.src = productData.image
  img.alt = productName
  img.className = "product-image"
  productCard.append(img)

  const size = document.createElement('p')
  size.innerText = "Размер: " + productData.size
  productCard.append(size)

  const material = document.createElement('p')
  material.innerText = "Материал: " + productData.material
  productCard.append(material)

  const amount = document.createElement('p')
  amount.innerText = "Количество: " + productData.amount
  productCard.append(amount)

  const price = document.createElement('p')
  price.innerText = "Цена: " + productData.price + " ₸"
  productCard.append(price)

  const productOrderDiv = getProductOrderDiv(productName)
  productCard.append(productOrderDiv)
  
  return productCard
}


// обновление кнопок заказа и счетчика товара
function updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton) {
  counterSpan.innerText = counter

  if (counter > 0) {
    firstButton.style.display = 'none'
    removeButton.style.display = 'inline'
    counterSpan.style.display = 'inline'
    addButton.style.display = 'inline'
  } else {
    firstButton.style.display = 'inline'
    removeButton.style.display = 'none'
    counterSpan.style.display = 'none'
    addButton.style.display = 'none'
  }
}


function getProductOrderDiv(phoneName) {
  const orderDiv = document.createElement('div')
  orderDiv.className = 'order'

  // кнопка добавления в корзину первого товара
  const firstButton = document.createElement('button')
  firstButton.innerText = 'В КОРЗИНУ'
  firstButton.onclick = () => {
    const counter = orderAdd(phoneName)
    
    updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)
  }
  orderDiv.append(firstButton)

  // кнопка удаления товара из корзины
  const removeButton = document.createElement('button')
  removeButton.className = 'change-order-button'
  removeButton.innerText = '-'
  removeButton.onclick = () => {
    const counter = orderRemove(phoneName)
    // обновляем кнопки заказа и счетчик
    updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)
  }
  orderDiv.append(removeButton)

  // счетчик заказанных товаров
  const counterSpan = document.createElement('span')
  counterSpan.className = 'order-counter'
  counterSpan.innerText = 0
  orderDiv.append(counterSpan)

  // кнопка добавления товара в корзину
  const addButton = document.createElement('button')
  addButton.className = 'change-order-button'
  addButton.innerText = '+'
  addButton.onclick = () => {
    const counter = orderAdd(phoneName)
    // обновляем кнопки заказа и счетчик
    updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)
  }

  orderDiv.append(addButton)

  // обновляем кнопки заказа и счетчик
  let counter = 0
  if (phoneName in order) {
    counter = order[phoneName]
  }

  updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)

  return orderDiv
}


const cartProductCounter = document.getElementById('cart-product-counter')

let order = {}
let storageData = localStorage.getItem('order')

if (storageData) {
  order = JSON.parse(storageData)

  let count = 0
  for (let productName in order) {
    count += order[productName]
  }

  cartProductCounter.innerText = count
}


function updateLocalStorage() {
  const storageData = JSON.stringify(order)
  localStorage.setItem("order", storageData)
}

function updateCartCounter(value) {
  const count = +cartProductCounter.innerText
  cartProductCounter.innerText = count + value
}

//добавления товара к заказу
function orderAdd(productKey) {
  if (productKey in order) {
    order[productKey]++
  } else {
    order[productKey] = 1
  }

  updateLocalStorage()
  updateCartCounter(1)

  return order[productKey]
}

// удаление товара из заказа
function orderRemove(productKey) {
  if (productKey in order === false) {
    return 0
  }

  order[productKey]--
  updateCartCounter(-1)

  const count = order[productKey]
  if (count === 0) {
    delete order[productKey]
  }

  updateLocalStorage()
  return count
}