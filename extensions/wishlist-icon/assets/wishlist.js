document.addEventListener("DOMContentLoaded", function () {
  // Get all wishlist buttons
  const wishlistButtons = document.querySelectorAll(
    ".wishlist-inspire__icon button",
  );

  wishlistButtons.forEach((button) => {
    button.addEventListener("click", function () {
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
      //TODO: send data to database
    });
  });
});
