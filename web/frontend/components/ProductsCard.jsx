import { useState, useEffect, useCallback } from "react";
import { VerticalStack, Text, CalloutCard, LegacyStack, Thumbnail } from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { DEFAULT_PRODUCTS_COUNT } from "../../constants.js";
import Dropzone from "./Dropzone.jsx";

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

  console.log("data", data);

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
          count: 1,
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
          count: productsWithoutToc?.length,
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

  const downalodImagesUrls = async () => {
    setIsLoading(true);
    const response = await fetch("/api/downloadImagesUrls", { method: "POST" });

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("Toc.tocGenerated", {
          count: productsWithoutToc?.length,
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

  const importImages = async () => {
    setIsLoading(true);
    const response = await fetch("/api/importImages", { method: "POST" });

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("Toc.tocGenerated", {
          count: productsWithoutToc?.length,
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

  const writeProducts = async () => {
    setIsLoading(true);
    const response = await fetch("/api/writeProducts", { method: "POST" });

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("Toc.tocGenerated", {
          count: productsWithoutToc?.length,
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

  const readProducts = async () => {
    setIsLoading(true);
    const response = await fetch("/api/readProducts", { method: "POST" });

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("Toc.tocGenerated", {
          count: productsWithoutToc?.length,
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

  const writeProductsMetafields = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/writeMetafields", {
      method: "POST",
    });

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("Toc.tocGenerated", {
          count: productsWithoutToc?.length,
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

  const readProductsMetafields = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/readMetafields", {
      method: "POST",
    });

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("Toc.tocGenerated", {
          count: productsWithoutToc?.length,
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

  const writeCollections = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/writeCollections", {
      method: "POST",
    });

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("Toc.tocGenerated", {
          count: productsWithoutToc?.length,
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

  const readCollections = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/readCollections", {
      method: "POST",
    });

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("Toc.tocGenerated", {
          count: productsWithoutToc?.length,
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

  const writeCollectionsMetafields = async () => {
    setIsLoading(true);
    const response = await fetch("/api/collections/writeMetafields", {
      method: "POST",
    });

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("Toc.tocGenerated", {
          count: productsWithoutToc?.length,
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

  const readCollectionsMetafields = async () => {
    setIsLoading(true);
    const response = await fetch("/api/collections/readMetafields", {
      method: "POST",
    });

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("Toc.tocGenerated", {
          count: productsWithoutToc?.length,
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
          <p style={{ marginBottom: "15px" }}>
            {t("ProductsCard.description")}
          </p>

          <Text as="h4" variant="headingMd">
            {t("ProductsCard.totalProductsHeading")}
            <Text
              variant="bodyMd"
              as="span"
              fontWeight="semibold"
              color="warning"
            >
              {isLoadingCount ? "-" : data?.length}
            </Text>
          </Text>
        </VerticalStack>
      </CalloutCard>
      {/* <CalloutCard
        title={t("Toc.title")}
        primaryAction={{
          content: t("Toc.generateToc", {
            count: productsWithoutToc?.length,
          }),
          onAction: generateToc,
          loading: isLoading,
        }}
      >
        <VerticalStack spacing="loose">
          <p style={{ marginBottom: "15px" }}>{t("Toc.description")}</p>

          <Text as="h4" variant="headingMd">
            {t("Toc.tocHeading")}
            <Text
              variant="bodyMd"
              as="span"
              fontWeight="semibold"
              color="warning"
            >
              {isLoadingCount ? "-" : productsWithoutToc?.length}
            </Text>
          </Text>
        </VerticalStack>
      </CalloutCard> */}
      {/* <CalloutCard
        title={t("Images.title")}
        primaryAction={{
          content: t("Images.downloadImages", {
            count: productsWithoutToc?.length,
          }),
          onAction: downalodImagesUrls,
          loading: isLoading,
        }}
        secondaryAction={{
          content: t("Images.importImages", {
            count: productsWithoutToc?.length,
          }),
          onAction: importImages,
          loading: isLoading,
        }}
      >
        <VerticalStack spacing="loose">
          <p style={{ marginBottom: "15px" }}>{t("Images.description")}</p>
        </VerticalStack>
      </CalloutCard> */}
      <CalloutCard
        title={t("Products.title")}
        primaryAction={{
          content: t("Products.writeProducts", {
            count: productsWithoutToc?.length,
          }),
          onAction: writeProducts,
          loading: isLoading,
        }}
        secondaryAction={{
          content: t("Products.readProducts", {
            count: productsWithoutToc?.length,
          }),
          onAction: readProducts,
          loading: isLoading,
        }}
      >
        <VerticalStack spacing="loose">
          <p style={{ marginBottom: "15px" }}>{t("Products.description")}</p>
        </VerticalStack>
      </CalloutCard>
      <CalloutCard
        title={t("Metafields.title")}
        primaryAction={{
          content: t("Metafields.writeMetafields", {
            count: productsWithoutToc?.length,
          }),
          onAction: writeProductsMetafields,
          loading: isLoading,
        }}
        secondaryAction={{
          content: t("Metafields.readMetafields", {
            count: productsWithoutToc?.length,
          }),
          onAction: readProductsMetafields,
          loading: isLoading,
        }}
      >
        <VerticalStack spacing="loose">
          <p style={{ marginBottom: "15px" }}>{t("Metafields.description")}</p>
        </VerticalStack>
      </CalloutCard>

      <CalloutCard
        title={t("Collections.title")}
        primaryAction={{
          content: t("Collections.writeCollections", {
            count: productsWithoutToc?.length,
          }),
          onAction: writeCollections,
          loading: isLoading,
        }}
        secondaryAction={{
          content: t("Collections.readCollections", {
            count: productsWithoutToc?.length,
          }),
          onAction: readCollections,
          loading: isLoading,
        }}
      >
        <VerticalStack spacing="loose">
          <p style={{ marginBottom: "15px" }}>{t("Collections.description")}</p>
        </VerticalStack>
      </CalloutCard>
      <CalloutCard
        title={t("CollectionsMetafields.title")}
        primaryAction={{
          content: t("CollectionsMetafields.writeCollections", {
            count: productsWithoutToc?.length,
          }),
          onAction: writeCollectionsMetafields,
          loading: isLoading,
        }}
        secondaryAction={{
          content: t("CollectionsMetafields.readCollections", {
            count: productsWithoutToc?.length,
          }),
          onAction: readCollectionsMetafields,
          loading: isLoading,
        }}
      >
        <VerticalStack spacing="loose">
          <p style={{ marginBottom: "15px" }}>
            {t("CollectionsMetafields.description")}
          </p>
        </VerticalStack>
      </CalloutCard>


      <Dropzone />

    </>
  );
}
