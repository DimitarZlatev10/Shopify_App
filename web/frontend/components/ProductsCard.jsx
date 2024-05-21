import { useState, useEffect } from "react";
import { Card, TextContainer, Text } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { DEFAULT_PRODUCTS_COUNT } from "../../constants.js";
import {PlusIcon} from '@shopify/polaris-icons';
// import axios from "axios";

export function ProductsCard() {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [productsWithoutToc, setFilteredProducts] = useState([]);
  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();
  const productsCount = DEFAULT_PRODUCTS_COUNT;
  
  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  console.log(data);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const filtered = data.filter((product) => !product.isTocGenerated);
      setFilteredProducts(filtered);
    }
  }, [data]);

  const toastMarkup = toastProps.content && !isRefetchingCount && (
    <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
  );

  const handlePopulate = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products", { method: "POST" });

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("ProductsCard.productsCreatedToast", {
          count: data.count,
        }),
      });
    } else {
      setIsLoading(false);
      setToastProps({
        content: t("ProductsCard.errorCreatingProductsToast"),
        error: true,
      });
    }
  };

  const generateToc = async () => {
    setIsLoading(true);
    const response = await fetch("/api/generateToc", { method: "POST" });

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("Toc.tocGenerated", {
          count: productsWithoutToc.length,
        }),
      });
    } else {
      setIsLoading(false);
      setToastProps({
        content: t("ProductsCard.errorCreatingProductsToast"),
        error: true,
      });
    }
  };

  return (
    <>
      {toastMarkup}
      <Card
        title={t("ProductsCard.title")}
        sectioned
        primaryFooterAction={{
          content: t("ProductsCard.populateProductsButton", {
            count: productsCount,
          }),
          onAction: handlePopulate,
          loading: isLoading,
        }}
      >
        <TextContainer spacing="loose">
          <p>{t("ProductsCard.description")}</p>

          <Text as="h4" variant="headingMd">
            {t("ProductsCard.totalProductsHeading")}
            <Text variant="bodyMd" as="p" fontWeight="semibold">
              {isLoadingCount ? "-" : data?.length}
            </Text>
          </Text>
        </TextContainer>
      </Card>
      <Card
        title={t("Toc.title")}
        sectioned
        primaryFooterAction={{
          content: t("Toc.generateToc", {
            count: productsWithoutToc.length,
          }),
          onAction: generateToc,
          loading: isLoading,
        }}
      >
        <TextContainer spacing="loose">
          <p>{t("Toc.description")}</p>

          <Text as="h4" variant="headingMd">
            {t("Toc.tocHeading")}
            <Text variant="bodyMd" as="p" fontWeight="semibold">
              {isLoadingCount ? "-" : productsWithoutToc.length}
            </Text>
          </Text>
          <Button icon={PlusIcon}>Generate TOC for all products</Button>
        </TextContainer>
      </Card>
    </>
  );
}
