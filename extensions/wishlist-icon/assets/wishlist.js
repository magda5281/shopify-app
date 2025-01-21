document.addEventListener("DOMContentLoaded", function () {
  // Get all wishlist buttons
  const wishlistButtons = document.querySelectorAll('.wishlist-inspire__icon button');

  wishlistButtons.forEach((button) => {
    button.addEventListener('click', function () {
      // Get the SVG inside the button
      const svgIcon = button.querySelector('svg');

      if (svgIcon) {
        // Check the current color and toggle between two colors
        const currentColor = svgIcon.getAttribute('fill');
        const newColor = currentColor === 'none' ? "#ff0000" : 'none'; // Toggle between red and black
        svgIcon.setAttribute('fill', newColor); // Update the color
        //TODO: send data to database 
      }
    });
  });
});
