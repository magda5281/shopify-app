import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  Button,
  Divider,
  CalloutCard,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function PricingPage() {
  return (
    <Page>
      <TitleBar title="Pricing" />
      <Layout>
        <Layout.Section>
          <CalloutCard
            title=" Upgrade to pro"
            illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
            primaryAction={{
              content: " Upgrade to pro",
              url: "#",
            }}
          >
            <p>
              {" "}
              You are are currently on free plan. Upgrade to pro to unlock more
              features.
            </p>
          </CalloutCard>
        </Layout.Section>
        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingSm">
                Free
              </Text>
              <Text>Free plan with basic features</Text>
              <Divider></Divider>
              <List>
                <List type="bullet">
                  <List.Item>100 wishlist per day</List.Item>
                  <List.Item>500 products</List.Item>
                  <List.Item>Basic customization</List.Item>
                  <List.Item>Basic support</List.Item>
                </List>
              </List>
              <Divider></Divider>
              <Button>Upgrade to pro</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Pro
              </Text>
              <Text>Pro plan with advanced features</Text>
              <Text variant="heading2xl" as="p" fontWeight="bold">
                $ 10
              </Text>
              <Divider></Divider>
              <List>
                <List.Item>Unlimited wishlist per day</List.Item>
                <List.Item>100000 products</List.Item>
                <List.Item>Advanced customization</List.Item>
                <List.Item>Priority support</List.Item>
              </List>
              <Divider></Divider>
              <Button>Upgrade to pro</Button>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
