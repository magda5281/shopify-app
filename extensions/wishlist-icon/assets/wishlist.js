document.addEventListener("DOMContentLoaded", function () {
  // Get all wishlist buttons
  const wishlistButtons = document.querySelectorAll(
    ".wishlist-inspire__icon button",
  );

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const appUrl =
        "http://proceeds-sweet-grand-generating.trycloudflare.com/";

      const isCustomerLoggedIn =
        typeof ShopifyAnalytics !== "undefined" &&
        ShopifyAnalytics.meta.page.customerId;

      if (!isCustomerLoggedIn) {
        // Show an alert or a custom modal
        alert("Please log in to add items to your wishlist.");
        return; // Prevent further execution
      }

      // Get the SVG inside the button
      const svgIcon = button.querySelector("svg");
      const currentTextElement = button.querySelector("span");

      // Check the current color and toggle between two colors
      const currentColor = svgIcon?.getAttribute("fill");
      const currentText = currentTextElement?.textContent.trim();
      const newColor = currentColor === "none" ? "#ff0000" : "none"; // Toggle between red and black
      svgIcon.setAttribute("fill", newColor); // Update the color
      const newText =
        currentText === "Add to wishlist"
          ? "Remove from wishlist"
          : "Add to wishlist";
      currentTextElement.textContent = newText;

      //if customer is logged in sent data to database
      const parentDiv = button.closest(".wishlist-inspire__icon");
      const shopDomain = parentDiv?.dataset.shopDomain;

      const customerId = ShopifyAnalytics.meta.page.customerId;
      const productId = ShopifyAnalytics.meta.product.id;

      const formData = new FormData();
      formData.append("customerId", customerId);
      formData.append("productId", productId);
      formData.append("shop", shopDomain);

      const response = await fetch(`${appUrl}api/wishlist`, {
        method: "POST",
        body: formData,
        redirect: "follow",
      });

      const data = await response.text();
    });
  });
});
