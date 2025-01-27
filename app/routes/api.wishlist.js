import db from "../db.server";
import { cors } from "remix-utils/cors";

export async function loader({ request }) {
  const url = new URL(request.url);

  const customerId = url.searchParams.get("customerId");

  const productId = url.searchParams.get("productId");

  const wishlistItem = await db.wishlist.findUnique({
    where: { customerId_productId: { customerId, productId } },
  });

  const response = Response.json({ isInWishlist: Boolean(wishlistItem) });
  return response;
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
        isInWishlist: true,
      });
      return cors(request, response);
    case "PATCH":
      return Response.json({ message: "Success", method: "Patch" });
    case "DELETE":
      try {
        const wishlistItem = await prisma.wishlist.findUnique({
          where: { customerId_productId: { customerId, productId } },
        });

        if (!wishlistItem) {
          return new Response(
            JSON.stringify({ message: "Item not found", isInWishlist: false }),
            { status: 404, headers: { "Content-Type": "application/json" } },
          );
        }

        await prisma.wishlist.delete({
          where: { id: wishlistItem.id },
        });

        const response = Response.json({
          message: "Deleted successfully",
          isInWishlist: false,
        });
        return cors(request, response);
      } catch (error) {
        console.error("Error deleting wishlist item:", error);
        return new Response(
          JSON.stringify({ message: "Failed to delete item" }),
          { status: 500, headers: { "Content-Type": "application/json" } },
        );
      }
  }
}
