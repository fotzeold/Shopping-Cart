// Open Treasure

let openTreasure = document.querySelector("header button");
let treasureWindow = document.querySelector(".treasure__window");
let treasureWrapper = document.querySelector(".treasure__wrapper");
let treasureClose = document.querySelector(".treasure__close");

openTreasure.addEventListener("click", openedTreasure)

treasureClose.addEventListener("click", () => {
	treasureWindow.classList.remove("treasure__window-active");
	treasureWrapper.classList.remove("treasure__wrapper-active");
	document.body.style.overflow = "";
})

function openedTreasure() {
	treasureWindow.classList.add("treasure__window-active");
	treasureWrapper.classList.add("treasure__wrapper-active");
	document.body.style.overflow = "hidden";
}

// Products List

let productsListElement = document.querySelector(".products .grid");

function getResource() {
	fetch("./data/data.json")
		.then(data => data.json())
		.then(data => {
			productsList = data;
			renderProductList();
		})
}

let productsList = [];

function renderProductList() {
	productsListElement.innerHTML = "";
	productsList.forEach(prod => {
		productsListElement.innerHTML += `<div class="product__card" data-key="${prod.id}">
		<img src=${prod.img}>
		<h4>${prod.title}</h4>
		<div class="product__card-price"><span>${prod.price}</span> ₴</div>
		${!productsTreasure.find(obj => obj.id === prod.id) ?
				"<button>Купити</button>" :
				"<button class='active'>В кошику</button>"}
	</div>`
	})
}

function addToTreasure(button, key) {
	if (productsTreasure.length == 0 || !productsTreasure.find(obj => obj.id === key)) {

		let object = productsList.find(obj => obj.id === key);

		button.innerText = "В кошику";
		button.classList.add("active");

		productsTreasure.push({ ...object, quantity: 1 });

		renderTreasure();
		updateTotalPrice();

	} else {
		openedTreasure();
	}
}

productsListElement.addEventListener("click", (event) => {
	if (event.target.matches("button")) {
		let prodCard = event.target.closest(".product__card");
		addToTreasure(event.target, +prodCard.dataset.key);
	}
})


// Treasure

let productsTreasure = [];

let treasure = document.querySelector(".treasure__products");
let totalPrice = document.querySelector(".treasure__total-price span");
let emptyTreasure = document.createElement("div");
let total = 0;

emptyTreasure.innerText = "Your treasure is empty";
treasure.append(emptyTreasure);

function renderTreasure() {
	treasure.innerHTML = '';

	productsTreasure.forEach(elem => {
		treasure.innerHTML += `<div class="treasure__products-item" data-key="${elem.id}" data-price="${elem.price}">
		<div class="row">
			<div class="item__image">
				<img src=${elem.img} alt="">
			</div>
			<div class="item__name">
				<h4>${elem.title}</h4>
			</div>
			<div class="item__total">
				<button class="decrease" data-action="decr">-</button>
				<span class="item__count">${elem.quantity}</span>
				<button class="increase" data-action="incr">+</button>
			</div>
			<div class="item__price">
				<span>${elem.price * elem.quantity}</span>
			</div>
			<button class="deleted">Видалити</button>
		</div>
	</div>`;
	})
}

treasure.addEventListener("click", (event) => {
	if (event.target.matches("button:not(.deleted)")) {
		let prodItem = event.target.closest(".treasure__products-item");
		onСhangeQuantity(prodItem, event.target.dataset.action, +prodItem.dataset.price, +prodItem.dataset.key)
	} else if (event.target.matches(".deleted")) {
		let prodItem = event.target.closest(".treasure__products-item");
		deletProduct(prodItem, +prodItem.dataset.key);
	}
})

function updateTotalPrice() {
	total = 0;

	const allProducts = document.querySelectorAll(".treasure__products-item");

	allProducts.forEach((product) => {
		const price = +product.querySelector(".item__price span").innerText;
		total += price;
	});

	totalPrice.innerText = total;

	saveData();
}

function onСhangeQuantity(product, action, price, key) {

	const quantityElement = product.querySelector(".item__count");
	const priceElement = product.querySelector(".item__price span");

	let quantity = +quantityElement.innerText;

	if (action === 'incr') {
		quantity++;
	} else {
		quantity = Math.max(1, quantity - 1);
	}

	productsTreasure.forEach(elem => elem.id === key ? elem.quantity = quantity : null);

	priceElement.innerText = price * quantity;
	quantityElement.innerText = quantity;

	updateTotalPrice();
}

function deletProduct(product, key) {
	let index = productsTreasure.findIndex(el => el.id === key);
	productsTreasure.splice(index, 1);

	product.remove();
	updateTotalPrice();
	saveData();

	if (productsTreasure.length === 0) treasure.append(emptyTreasure);

	renderProductList()
}

function saveData() {
	localStorage.setItem("basket", JSON.stringify(productsTreasure));
}

function getData() {
	let data = JSON.parse(localStorage.getItem("basket"));
	if (data.length > 0) {
		productsTreasure = data;
		renderTreasure();
	}
}

getData();
getResource();
updateTotalPrice();













