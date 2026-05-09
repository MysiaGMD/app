'use strict'

const catalog = document.getElementById("catalog")
const cartProductCounter = document.getElementById('cart-product-counter')
const isCart = window.location.pathname.endsWith('cart.html')

const cartLink = document.getElementById('cart')


if (!isCart) {
    const searchInput = document.getElementById("search")

    searchInput.addEventListener("input", (e) => {
        checkSearchInput(e.target.value)
    })
}
function checkSearchInput(searchValue) {
    const products = catalog.querySelectorAll(".description")

    const searchText = searchValue.toLowerCase().trim()

    products.forEach(product => {
        const productText = product.textContent.toLowerCase()

        const isMatch = productText.includes(searchText)

        product.style.display = isMatch ? 'block' : 'none'
    })
}

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
  price.className = 'price'

  price.innerHTML = `
      Цена: <span>${productData.price}</span> ₸
  `

  productCard.append(price)

  const productOrderDiv = getProductOrderDiv(productName, productCard)
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

  if (isCart === true) {
    recalculateOrderSum()
  }
}


function getProductOrderDiv(productName, productCard) {
  const orderDiv = document.createElement('div')
  orderDiv.className = 'order'

  // кнопка добавления в корзину первого товара
  const firstButton = document.createElement('button')
  firstButton.className = 'to-cart-button'
  firstButton.innerText = 'В КОРЗИНУ'
  firstButton.onclick = () => {
    const counter = orderAdd(productName)
    
    updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)
  }
  orderDiv.append(firstButton)

  // кнопка удаления товара из корзины
  const removeButton = document.createElement('button')
  removeButton.className = 'change-order-button'
  removeButton.innerText = '-'
  removeButton.onclick = () => {
    const counter = orderRemove(productName)
    // обновляем кнопки заказа и счетчик
    updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)
    if (isCart && counter === 0) {
      productCard.remove()
      recalculateOrderSum()
    }
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
    const counter = orderAdd(productName)
    // обновляем кнопки заказа и счетчик
    updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)
  }

  orderDiv.append(addButton)

  // обновляем кнопки заказа и счетчик
  let counter = 0
  if (productName in order) {
    counter = order[productName]
  }

  updateProductOrderDiv(firstButton, removeButton, counterSpan, counter, addButton)

  return orderDiv
}


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

function recalculateOrderSum() {
    let sum = 0

    const products = catalog.querySelectorAll(".description")

    products.forEach(product => {

        const countSpan = product.querySelector(".order-counter")
        const count = +countSpan.innerText


        const priceDiv = product.querySelector(".price")
        const priceSpan = priceDiv.querySelector("span")
        const price = +priceSpan.innerText

        if (price > 0 && count > 0) {
            sum += price * count
        }
    })

    const orderTotalSum = document.getElementById("order-total-sum")
    orderTotalSum.innerText = sum + " ₸"
}


function updateCartCounter(value) {

    if (isCart) {
        return
    }

    const count = +cartProductCounter.innerText
    cartProductCounter.innerText = count + value
}

function getProducts(data) {

    for (let productName in data) {

        if (isCart === true) {

            if (productName in order) {
                const productData = data[productName]
                const productCard = getProductCard(productName, productData)

                catalog.append(productCard)
            }

        } else {

            const productData = data[productName]
            const productCard = getProductCard(productName, productData)

            catalog.append(productCard)
        }
    }

    if (isCart === true) {
        recalculateOrderSum()
    }
}
