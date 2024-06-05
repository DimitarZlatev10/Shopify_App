import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {Page, LegacyCard, DataTable, Link, Button} from '@shopify/polaris';
import {PlusIcon} from '@shopify/polaris-icons';
import { useAppQuery, useAuthenticatedFetch } from '../hooks';
import { DEFAULT_PRODUCTS_COUNT } from '../../constants';

import "../styles.css";

const Products = () => {
  const emptyToastProps = { content: null };
  const [isLoading, setIsLoading] = useState(true);
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();
  const productsCount = DEFAULT_PRODUCTS_COUNT;
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const {
    data,
    refetch: refetchProducts,
    isLoading: isLoadingProducts,
    isRefetching: isRefetchingProducts,

  } = useAppQuery({
    url: `/api/products?page=${currentPage}&limit=${productsPerPage}`,
    reactQueryOptions: {
      onSuccess: (data) => {
        setIsLoading(false);
      },
    },
  });

  const handleGenerateTOC = async (event, element) => {
    setIsLoading(true);
    const response = await fetch("api/products", { 
      method: "GET",
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

  const rows = data?.products && data?.products.length > 0 && data?.products.map((element) => {
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

  const handlePreviousPage = () => {
    console.log('here is the previous page');
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = async () => {
    console.log('here in the next page', data?.pageInfo);
    console.log('data?.pageInfo?.endCursor', data?.pageInfo?.endCursor);
    if (data?.pageInfo?.hasNextPage) {
      const response = await fetch("/api/products", { 
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          productsPerPage: 10,
          currentPage: currentPage,
          cursor: data?.pageInfo?.endCursor
        }
      });
    }
  };

  useEffect(() => {
    console.log('HERE');
    // refetchProducts();
  }, [currentPage]);

  return ( 
    data?.products && data?.products.length > 0 && 
    <div className="products-wrapper">
      <Page 
        title="Products" 
        fullWidth
        pagination={{
          hasPrevious: currentPage > 1,
          onPrevious: handlePreviousPage,
          hasNext: data?.pageInfo?.hasNextPage,
          onNext: () => handleNextPage()
        }}
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
            />
          </LegacyCard>
        </Page>
      </div>
    );
}

export default Products;