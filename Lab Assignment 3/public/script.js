document.addEventListener("DOMContentLoaded", () => {
  // --- MOBILE NAV LOGIC ---
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    if (navLinks.style.display === "flex") {
      navLinks.style.display = "none";
    } else {
      navLinks.style.display = "flex";
      navLinks.style.flexDirection = "column";
      navLinks.style.position = "absolute";
      navLinks.style.top = "60px";
      navLinks.style.left = "0";
      navLinks.style.width = "100%";
      navLinks.style.backgroundColor = "white";
      navLinks.style.padding = "20px";
      navLinks.style.zIndex = "100";
    }
  });

  // --- DYNAMIC PRODUCT LOADING (AJAX) ---
  const productContainer = $("#product-container");

  function loadFeaturedProducts() {
    $.ajax({
      url: "https://fakestoreapi.com/products?limit=4",
      method: "GET",
      success: function (products) {
        productContainer.empty(); // Clear loading text

        products.forEach((item) => {
          const productHTML = `
            <div class="card">
              <img src="${item.image}" alt="${item.title}">
              <div class="card-info">
                <h3>${item.title.substring(0, 30)}...</h3>
                <p>${item.category.toUpperCase()}</p>
                <strong>$${item.price}</strong>
                <button class="quick-view-btn" data-id="${item.id}">Quick View</button>
              </div>
            </div>
          `;
          productContainer.append(productHTML);
        });
      },
      error: function () {
        productContainer.html(
          "<p>Error loading products. Please try again later.</p>",
        );
      },
    });
  }

  loadFeaturedProducts();

  // --- MODAL LOGIC (INTERACTION) ---
  const modal = $("#productModal");
  const modalBody = $("#modal-body");

  // Use event delegation for dynamic buttons
  $(document).on("click", ".quick-view-btn", function () {
    const id = $(this).data("id");

    // Optional: Add loading state inside modal
    modalBody.html("<p>Fetching details...</p>");
    modal.fadeIn(200);

    $.get(`https://fakestoreapi.com/products/${id}`, function (data) {
      modalBody.html(`
        <img src="${data.image}" alt="${data.title}">
        <h2>${data.title}</h2>
        <p>${data.description}</p>
        <div class="rating-tag">Rating: ${data.rating.rate} ⭐ (${data.rating.count} reviews)</div>
      `);
    });
  });

  // Close modal logic
  $(".close-modal, .modal").on("click", function (e) {
    if (e.target === this) {
      modal.fadeOut(200);
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll(".nav-links li a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = "none";
      }
    });
  });
});
