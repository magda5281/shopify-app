import { authenticate, MONTHLY_PLAN } from "../shopify.server";
import { redirect } from "@remix-run/react";
export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const billingCheck = await billing.require({
    plans: [MONTHLY_PLAN],
    onFailure: async () =>
      billing.request({
        plan: MONTHLY_PLAN,
        isTest: true,
        returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/pricing`,
      }),
  });

  const subscription = billingCheck.appSubscriptions[0];
  const cancelledSubscription = await billing.cancel({
    subscriptionId: subscription.id,
    isTest: true,
    prorate: true,
  });
  return redirect("/app/pricing");
};
