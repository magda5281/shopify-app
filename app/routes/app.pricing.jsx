import {
  Card,
  Layout,
  Page,
  Text,
  BlockStack,
  Button,
  Divider,
  CalloutCard,
  ExceptionList,
} from "@shopify/polaris";
import { CheckIcon } from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);

  try {
    const billingCheck = await billing.require({
      plans: [MONTHLY_PLAN, ANNUAL_PLAN],
      isTest: true,
      onFailure: async () => {
        throw new Error("No active plan");
      },
    });

    const subscription = billingCheck.appSubscriptions[0];
    return Response.json({ billing, plan: subscription });
  } catch (error) {
    if (error.message === "No active plan") {
      return Response.json({ billing, plan: { name: "free" } });
    }
    throw error;
  }
};
let planData = [
  {
    title: "Free",
    description: "Free plan with basic features",
    price: "0",
    action: "Upgrade to pro",
    url: "/app/upgrade",
    features: [
      "100 wishlist per day",
      "500 products",
      "Basic customization",
      "Basic support",
    ],
  },
  {
    title: "Pro plan",
    description: "Pro plan with advanced features",
    price: "10",
    action: "Upgrade to pro",
    url: "/app/upgrade",
    features: [
      "1000 wishlist per day",
      "1000000 products",
      "Advanced customization",
      "Priority support",
    ],
  },
];
export default function PricingPage() {
  const { plan } = useLoaderData();

  return (
    <Page>
      <TitleBar title="Pricing" />
      <Layout>
        <Layout.Section>
          <CalloutCard
            title=" Upgrade to pro"
            illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
            primaryAction={{
              content:
                plan?.status === "ACTIVE" ? "Cancel plan" : "Upgrade to pro",
              url: plan?.status === "ACTIVE" ? "/app/cancel" : "/app/upgrade",
            }}
          >
            <p>
              {plan?.status === "ACTIVE"
                ? "You are currently on the Pro plan. Click below to cancel your subscription."
                : "You are currently on the Free plan. Upgrade to Pro to unlock more features."}
            </p>
          </CalloutCard>
        </Layout.Section>
        {planData.map((plan_item, index) => {
          const isActiveProPlan =
            plan?.status === "ACTIVE" && plan_item.title === "Pro plan";
          const isActiveFreePlan =
            plan.name === "free" && plan_item.title === "Free";

          return (
            <Layout.Section variant="oneHalf" key={index}>
              <Card
                background={
                  isActiveProPlan
                    ? "bg-surface-magic-active"
                    : isActiveFreePlan
                      ? "bg-surface-magic-active"
                      : "bg-surface"
                }
              >
                <BlockStack gap="200">
                  <Text as="h2" variant="headingSm">
                    {plan_item.title}
                  </Text>
                  <Text>{plan_item.description}</Text>
                  <Text as="h4" variant={"headingLg"} fontWeight={"bold"}>
                    {plan_item.price === "0" ? "FREE" : `$ ${plan_item.price}`}
                  </Text>
                  <Divider></Divider>
                  <BlockStack gap={100}>
                    {plan_item.features.map((feature, index) => {
                      return (
                        <ExceptionList
                          key={index}
                          items={[
                            {
                              icon: CheckIcon,
                              description: feature,
                            },
                          ]}
                        />
                      );
                    })}
                  </BlockStack>
                  <Divider></Divider>{" "}
                  <Button
                    primary
                    url={
                      plan?.status === "ACTIVE" ? "/app/cancel" : "/app/upgrade"
                    }
                  >
                    {plan?.status === "ACTIVE"
                      ? "Cancel plan"
                      : plan_item.action}
                  </Button>
                </BlockStack>
              </Card>
            </Layout.Section>
          );
        })}
      </Layout>
    </Page>
  );
}
