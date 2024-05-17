import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {Page, LegacyCard, DataTable, Link, Button} from '@shopify/polaris';
import {PlusIcon} from '@shopify/polaris-icons';
import { useAppQuery, useAuthenticatedFetch } from '../hooks';
import { DEFAULT_PRODUCTS_COUNT } from '../../constants';

const Products = () => {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();
  const productsCount = DEFAULT_PRODUCTS_COUNT;

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const handleGenerateTOC = async (element) => {
    console.log('here'); 
    setIsLoading(true);
    const response = await fetch("/api/generateTocPerProduct", { 
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: element.id,
        descriptionHtml: element.body_html
      }),
    });

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("ProductsCard.productsCreatedToast", {
          count: productsCount,
        }),
      });
    } else {
      setIsLoading(false);
      setToastProps({
        content: t("ProductsCard.errorCreatingProductsToast"),
        error: true,
      });
    }
  }

  console.log('data', data)

  const rows = data?.data && data?.data.length > 0 && data?.data.map((element) => {
    return [<Link
        removeUnderline
        url={`https://admin.shopify.com/store/dimitar-shop-app-test/products/${element.id}`}
        key="emerald-silk-gown"
      >
        {element.title}
      </Link>,
      'false',
      <Button icon={PlusIcon} onClick={(element) => handleGenerateTOC(element)}>Generate TOC</Button>]
  });

  return ( 
    data?.data && data?.data.length > 0 && <Page title="Products">
        <LegacyCard>
          <DataTable
            columnContentTypes={[
              'text',
              'text',
              'numeric',
            ]}
            headings={[
              'Name',
              'TOC',
              'Actions'
            ]}
            rows={rows}
            pagination={{
              hasNext: true,
              onNext: () => {},
            }}
          />
        </LegacyCard>
      </Page>
    );
}

export default Products;