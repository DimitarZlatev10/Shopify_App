import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {Page, LegacyCard, DataTable, Link, Button} from '@shopify/polaris';
import {PlusIcon} from '@shopify/polaris-icons';
import { useAppQuery, useAuthenticatedFetch } from '../hooks';
import { DEFAULT_PRODUCTS_COUNT } from '../../constants';
// import './styles.css';
// import styles from './Products.module.css';
// import "@shopify/polaris/build/esm/styles.css" in index.js
import "../styles.css";


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
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  const handleGenerateTOC = async (event, element) => {
    setIsLoading(true);
    const response = await fetch("/api/generateTocPerProduct", { 
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gid: element.id,
        descriptionHtml: element.descriptionHtml
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

  const rows = data && data.length > 0 && data.map((element) => {
    return [<Link
        removeUnderline
        url={`https://admin.shopify.com/store/dimitar-shop-app-test/products/${element.id}`}
        key="emerald-silk-gown"
      >
        {element.title}
      </Link>,
      element.isTocGenerated ? 'Yes' : 'No',
      !element.isTocGenerated ? <Button icon={PlusIcon} onClick={(event) => handleGenerateTOC(event, element)}>Generate TOC</Button> : null]
  });

  return ( 
    data && data.length > 0 && 
    <div className="products-wrapper">
      <Page 
        title="Products" 
        fullWidth
        pagination={{
          hasPrevious: true,
          hasNext: true,
        }}
        // style={{backgroundColor: 'red'}}
        // className="p-0"
        // className={styles.test}
        // className="test"
        // className="!p-0"
        >
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
      </div>
    );
}

export default Products;