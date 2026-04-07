document.addEventListener("DOMContentLoaded", () => {
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
    }
  });

  document.querySelectorAll(".nav-links li a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = "none";
      }
    });
  });

  // AJAX call to fetch products
  if (typeof $ !== 'undefined') {
    $.ajax({
      url: 'https://fakestoreapi.com/products?limit=6',
      method: 'GET',
      success: function(data) {
        const productsContainer = $('#featured-deals');
        productsContainer.empty(); // Clear any existing content
        
        data.forEach(product => {
          // Construct HTML for each product card
          const cardHtml = `
            <div class="card">
              <img src="${product.image}" alt="${product.title.replace(/"/g, '&quot;')}" />
              <div class="card-info">
                <h3 style="font-size: 1.1rem; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${product.title}</h3>
                <p style="color: #555; text-transform: capitalize; margin-bottom: 10px;">${product.category}</p>
                <strong style="display: block; margin-top: auto; font-size: 1.2rem;">$${product.price}</strong>
                <button class="quick-view-btn" data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}'>Quick View</button>
              </div>
            </div>
          `;
          productsContainer.append(cardHtml);
        });

        // Add event listeners to Quick View buttons
        $('.quick-view-btn').on('click', function() {
          const product = $(this).data('product');
          openModal(product);
        });
      },
      error: function(err) {
        console.error('Error fetching products:', err);
        $('#featured-deals').html('<p style="grid-column: 1 / -1; text-align: center;">Failed to load products. Please try again later.</p>');
      }
    });
  }

  // Modal Logic
  const modal = $('#quickViewModal');
  const closeBtn = $('.close-btn');

  function openModal(product) {
    const modalBodyHtml = `
      <img src="${product.image}" alt="${product.title.replace(/"/g, '&quot;')}" class="modal-img" />
      <div class="modal-details">
        <h3>${product.title}</h3>
        <div class="modal-rating">★ ${product.rating.rate} / 5 <span style="color: #888; font-size: 0.9rem; font-weight: normal;">(${product.rating.count} reviews)</span></div>
        <p>${product.description}</p>
        <strong>$${product.price}</strong>
      </div>
    `;
    $('#modalBody').html(modalBodyHtml);
    modal.css('display', 'block');
  }

  closeBtn.on('click', function() {
    modal.css('display', 'none');
  });

  $(window).on('click', function(event) {
    if ($(event.target).is(modal)) {
      modal.css('display', 'none');
    }
  });

});
