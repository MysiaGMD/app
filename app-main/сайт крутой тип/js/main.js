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
    productCard.className = "product-card"

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
    price.innerText = "Цена: " + productData.price + " ₽"
    productCard.append(price)



  return productCard
}