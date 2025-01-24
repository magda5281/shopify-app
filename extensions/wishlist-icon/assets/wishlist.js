document.addEventListener("DOMContentLoaded", function () {
  // Get all wishlist buttons
  const wishlistButtons = document.querySelectorAll(
    ".wishlist-inspire__icon button",
  );
  const appUrl = "https://concerned-cooked-along-aged.trycloudflare.com/";

  const customerId = ShopifyAnalytics?.meta?.page?.customerId || null;
  console.log("customerId:", customerId); //8962023555337
  const productId = ShopifyAnalytics?.meta?.product?.id || null;
  console.log("productId", productId); //9446709985545

  wishlistButtons.forEach(async (button) => {
    const svgIcon = button.querySelector("svg");
    const currentTextElement = button.querySelector("span");

    try {
      const response = await fetch(
        `${appUrl}api/wishlist?customerId=${customerId}&productId=${productId}`,
      );
      const data = await response.json();

      if (data.isInWishlist) {
        if (svgIcon) {
          svgIcon.setAttribute("fill", "#ff0000"); // Change to a desired colour for 'in wishlist'
        } else svgIcon.setAttribute("fill", "none");
      }
    } catch (error) {
      console.error("Error fetching wishlist status:", error);
    }

    // button.addEventListener("click", async function () {
    //   const isCustomerLoggedIn =
    //     typeof ShopifyAnalytics !== "undefined" &&
    //     ShopifyAnalytics.meta.page.customerId;

    //   if (!isCustomerLoggedIn) {
    //     // Show an alert or a custom modal
    //     alert("Please log in to add items to your wishlist.");
    //     return; // Prevent further execution
    //   }

    //   // Check the current color and toggle between two colors
    //   const currentColor = svgIcon?.getAttribute("fill");
    //   const currentText = currentTextElement?.textContent.trim();
    //   const newColor = currentColor === "none" ? "#ff0000" : "none"; // Toggle between red and black
    //   svgIcon.setAttribute("fill", newColor); // Update the color
    //   const newText =
    //     currentText === "Add to wishlist"
    //       ? "Remove from wishlist"
    //       : "Add to wishlist";
    //   currentTextElement.textContent = newText;

    //   //if customer is logged in sent data to database
    //   const parentDiv = button.closest(".wishlist-inspire__icon");
    //   const shopDomain = parentDiv?.dataset.shopDomain;

    //   const customerId = ShopifyAnalytics.meta.page.customerId;
    //   const productId = ShopifyAnalytics.meta.product.id;

    //   const formData = new FormData();
    //   formData.append("customerId", customerId);
    //   formData.append("productId", productId);
    //   formData.append("shop", shopDomain);

    //   const response = await fetch(`${appUrl}api/wishlist`, {
    //     method: "POST",
    //     body: formData,
    //     redirect: "follow",
    //   });

    //   const data = await response.text();
    // });
  });
});
