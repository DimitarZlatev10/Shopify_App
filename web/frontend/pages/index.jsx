import { Page, Layout, Image, Link, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import Products from "../components/Products";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <Page fullWidth style={{ padding: 0 }}>
      <TitleBar title={t("HomePage.title")} primaryAction={null} />
      <Layout>
        <Layout.Section>
          <ProductsCard />
        </Layout.Section>
        <Layout.Section>
          <Products />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
