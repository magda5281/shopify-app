function updateButtonUI(isInWishlist, svgIcon, currentTextElement) {
  if (svgIcon && currentTextElement) {
    if (isInWishlist) {
      svgIcon.setAttribute("fill", "#ff0000");
      currentTextElement.textContent = "Remove from wishlist";
    } else {
      svgIcon.setAttribute("fill", "none");
      currentTextElement.textContent = "Add to wishlist";
    }
  }
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

document.addEventListener("DOMContentLoaded", function () {
  // Get all wishlist buttons
  const wishlistButtons = document.querySelectorAll(
    ".wishlist-inspire__icon button",
  );

  const appUrl = "https://packard-accident-sin-protest.trycloudflare.com/";

  const customerId = ShopifyAnalytics?.meta?.page?.customerId || null;

  const productId = ShopifyAnalytics?.meta?.product?.id || null;

  const shopDomain = window.Shopify?.shop || null;

  wishlistButtons.forEach(async (button) => {
    const svgIcon = button?.querySelector("svg");

    const currentTextElement = button?.querySelector("span");

    let isInWishlist = false;

    try {
      const response = await fetch(
        `${appUrl}api/wishlist?customerId=${customerId}&productId=${productId}`,
      );

      const data = await response.json();

      isInWishlist = data?.isInWishlist;

      updateButtonUI(isInWishlist, svgIcon, currentTextElement);
    } catch (error) {
      console.error("Error fetching wishlist status:", error);
    }
    const handleButtonClick = debounce(async function () {
      if (!customerId) {
        // Show an alert or a custom modal
        alert("Please log in to add items to your wishlist.");
        return; // Prevent further execution
      }

      const method = isInWishlist ? "DELETE" : "POST";

      const formData = new FormData();
      formData.append("customerId", customerId);
      formData.append("productId", productId);
      formData.append("shop", shopDomain);

      const response = await fetch(`${appUrl}api/wishlist`, {
        method: method,
        body: formData,
        redirect: "follow",
      });

      const result = await response.json();
      isInWishlist = result.isInWishlist;

      updateButtonUI(isInWishlist, svgIcon, currentTextElement);
    }, 300);
    button.addEventListener("click", handleButtonClick);
  });
});
