import { Page, Layout, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import TranslateTabs from "../components/Translate-Tabs";

export default function TranslateProducts() {
  const { t } = useTranslation();
  return (
    <Page>
      <TitleBar title="Translate Products" />
      <Layout>
        <Layout.Section>
          <TranslateTabs />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
