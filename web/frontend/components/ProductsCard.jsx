import { useState, useEffect } from "react";
import { VerticalStack, Text, CalloutCard } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react"; 
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { DEFAULT_PRODUCTS_COUNT } from "../../constants.js";
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

  console.log('data', data);

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
      <CalloutCard
        title={t("ProductsCard.title")}
        primaryAction={{
          content: t("ProductsCard.populateProductsButton", {
            count: productsCount,
          }),
          onAction: handlePopulate,
          loading: isLoading,
        }}
      >
        <VerticalStack spacing="loose">
          <p style={{ marginBottom: '15px' }}>{t("ProductsCard.description")}</p>

          <Text as="h4" variant="headingMd">
            {t("ProductsCard.totalProductsHeading")}
            <Text variant="bodyMd" as="span" fontWeight="semibold">
              {isLoadingCount ? "-" : data?.length}
            </Text>
          </Text>
        </VerticalStack>
      </CalloutCard>
      <CalloutCard
        title={t("Toc.title")}
        primaryAction={{
          content: t("Toc.generateToc", {
            count: productsWithoutToc.length,
          }),
          onAction: generateToc,
          loading: isLoading,
        }}
      >
        <VerticalStack spacing="loose">
          <p style={{ marginBottom: '15px' }}>{t("Toc.description")}</p>

          <Text as="h4" variant="headingMd">
            {t("Toc.tocHeading")}
            <Text variant="bodyMd" as="span" fontWeight="semibold">
              {isLoadingCount ? "-" : productsWithoutToc.length}
            </Text>
          </Text>
        </VerticalStack>
      </CalloutCard>
    </>
  );
}
