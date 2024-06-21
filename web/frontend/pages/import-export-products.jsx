import { Page, Layout, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import ExportTabs from "../components/Export-Tabs";
import ImportTabs from "../components/Import-Tabs";

export default function ImportExportProducts() {
  //   const { t } = useTranslation();
  return (
    <Page>
      <TitleBar title="Import and Export Products" />
      <Layout>
        <Layout.Section>
          <ExportTabs />
        </Layout.Section>
        <Layout.Section>
          <ImportTabs />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
