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

  const appUrl = "https://an-cartridge-complete-info.trycloudflare.com/";

  const customerId = ShopifyAnalytics?.meta?.page?.customerId || null;

  const productId = ShopifyAnalytics?.meta?.product?.id || null;

  const shopDomain = window.Shopify?.shop || null;

  const cacheKey = `wishlist_${customerId}_${productId}`;
  const cacheTTL = 24 * 60 * 60 * 1000; // 24-hour cache

  function getCachedWishlistItem(key) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const { timestamp, data } = JSON.parse(cached);

    // Invalidate cache if expired
    if (Date.now() - timestamp > cacheTTL) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  }

  function updateCacheWishlistItem(key, data) {
    const cacheData = {
      timestamp: Date.now(),
      data,
    };
    const isInWishlist = data.isInWishlist;
    isInWishlist
      ? localStorage.setItem(key, JSON.stringify(cacheData))
      : localStorage.removeItem(key);
  }

  wishlistButtons.forEach(async (button) => {
    const svgIcon = button?.querySelector("svg");

    const currentTextElement = button?.querySelector("span");

    let isInWishlist = false;

    // Load from cache or fetch from server
    const cachedWishlistItem = getCachedWishlistItem(cacheKey);

    if (cachedWishlistItem) {
      const data = cachedWishlistItem;
      isInWishlist = data.isInWishlist;
      updateButtonUI(isInWishlist, svgIcon, currentTextElement);
    } else {
      // If no cached data, fetch from server
      try {
        const response = await fetch(
          `${appUrl}api/wishlist?customerId=${customerId}&productId=${productId}`,
        );

        const data = await response.json();

        isInWishlist = data?.isInWishlist;
        updateCacheWishlistItem(cacheKey, data);
        updateButtonUI(isInWishlist, svgIcon, currentTextElement);
      } catch (error) {
        console.error("Error fetching wishlist status:", error);
      }
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
      // Update the cache with the new state
      updateCacheWishlistItem(cacheKey, result);

      updateButtonUI(isInWishlist, svgIcon, currentTextElement);
    }, 300);
    button.addEventListener("click", handleButtonClick);
  });
});
