// Handle search functionality
function handleSearch(event) {
    event.preventDefault(); // Prevent form submission
    const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();

    if (searchInput === "") {
        alert("Please enter a search query!");
    } else {
        const productGrid = document.getElementById("productGrid");
        const products = productGrid.querySelectorAll(".product-card");
        let found = false;

        products.forEach(product => {
            const title = product.querySelector("h3").textContent.toLowerCase();
            if (title.includes(searchInput)) {
                product.style.display = "block";
                found = true;
            } else {
                product.style.display = "none";
            }
        });

        if (!found) {
            alert(`No products found for "${searchInput}".`);
        }
    }
}

// Function to get query parameters
function getQueryParams() {
    const params = {};
    window.location.search.substring(1).split("&").forEach(pair => {
        const [key, value] = pair.split("=");
        if (key && value) {
            params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
    });
    return params;
}

// Load product details if on product-detail.html
document.addEventListener("DOMContentLoaded", () => {
    const params = getQueryParams();
    if (params.id) {
        loadProductDetail(params.id);
    }
});

// Fetch and display product details
function loadProductDetail(productId) {
    fetch('data/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                displayProductDetail(product);
            } else {
                showError("Product not found.");
            }
        })
        .catch(error => {
            console.error("Error fetching product data:", error);
            showError("An error occurred while loading product details.");
        });
}

// Display product details on the page
function displayProductDetail(product) {
    // Update image, title, description, and price
    const singleProductView = document.getElementById("singleProductView");
    if (singleProductView) { // Ensure we're on product-detail.html
        document.getElementById("singleProductImage").src = product.image;
        document.getElementById("singleProductImage").alt = product.name;
        document.getElementById("singleProductTitle").textContent = product.name;
        document.getElementById("singleProductDescription").textContent = product.description;
        document.getElementById("singleProductPrice").textContent = `$${product.price.toFixed(2)}`;

        // Update delivery information
        document.getElementById("deliveryInfo").textContent = product.deliveryInfo;

        // Update FAQs
        const faqsList = document.getElementById("faqs");
        faqsList.innerHTML = ""; // Clear existing FAQs
        product.faqs.forEach((faq, index) => {
            if (index % 2 === 0 && product.faqs[index + 1]) {
                const question = faq;
                const answer = product.faqs[index + 1];

                const liQuestion = document.createElement("li");
                liQuestion.innerHTML = `<strong>${question}</strong>`;
                faqsList.appendChild(liQuestion);

                const liAnswer = document.createElement("li");
                liAnswer.textContent = answer;
                faqsList.appendChild(liAnswer);
            }
        });

        // Update product code
        document.getElementById("productCode").textContent = product.productCode;
    }
}

// Display error messages on the product detail page
function showError(message) {
    const singleProductView = document.getElementById("singleProductView");
    if (singleProductView) {
        singleProductView.innerHTML = `<p class="error-message">${message}</p>`;
    } else {
        alert(message);
    }
}

// Handle adding to cart (Placeholder Function)
let cart = [];

function addToCart(product) {
    cart.push(product);
    alert(`${product.name} has been added to your cart!`);
    console.log("Current Cart:", cart);
    // Optionally, update cart display or storage
}

document.addEventListener("click", function(event) {
    if (event.target.classList.contains("add-to-cart")) {
        const productCard = event.target.closest(".product-card");
        if (productCard) {
            const name = productCard.querySelector("h3").textContent;
            const priceText = productCard.querySelector("p").textContent;
            const price = parseFloat(priceText.replace('$', ''));
            const image = productCard.querySelector("img").src;

            const product = { name, price, image };
            addToCart(product);
        }

        // For product-detail.html
        const singleProductView = document.getElementById("singleProductView");
        if (singleProductView) {
            const name = document.getElementById("singleProductTitle").textContent;
            const priceText = document.getElementById("singleProductPrice").textContent;
            const price = parseFloat(priceText.replace('$', ''));
            const image = document.getElementById("singleProductImage").src;
            const quantity = parseInt(document.getElementById("quantity").value);

            const product = { name, price, image, quantity };
            addToCart(product);
        }
    }
});
