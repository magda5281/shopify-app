import db from "../db.server";
import { cors } from "remix-utils/cors";

export async function loader({ request }) {
  const url = new URL(request.url);
  const customerId = url.searchParams.get("customerId");
  const productId = url.searchParams.get("productId");
  const wishlistItem = await prisma.wishlist.findUnique({
    where: { customerId_productId: { customerId, productId } },
  });
  return Response.json({
    isInWishlist: Boolean(wishlistItem),
  });
}

export async function action({ request }) {
  const method = request.method;
  const data = Object.fromEntries(await request.formData());
  const customerId = data.customerId;
  const productId = data?.productId;
  const shop = data?.shop;

  if (!customerId || !productId || !shop) {
    return Response.json({
      message: "Missing data. Required data: customerId, productId, shop",
      method: method,
    });
  }
  switch (method) {
    case "POST":
      const wishlist = await db.wishlist.create({
        data: {
          customerId,
          productId,
          shop,
        },
      });
      const response = Response.json({
        message: "Product added to wishlist",
        method: "POST",
        wishlist: wishlist,
      });
      return cors(request, response);
    case "PATCH":
      return Response.json({ message: "Success", method: "Patch" });
    case "DELETE":
      const id = data?.id;
      // Attempt to delete the item by its ID
      const deletedItem = await db.wishlist.delete({
        where: {
          id: parseInt(id), // Ensure the ID is treated as an integer
        },
      });

      return Response.json(
        {
          message: "Item deleted successfully.",
          method: "DELETE",
          deletedItem: deletedItem,
        },
        { status: 200 },
      );
  }
}
