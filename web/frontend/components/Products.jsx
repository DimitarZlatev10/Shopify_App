import React, { useEffect, useState } from 'react';
import { Loading } from '@shopify/app-bridge-react';
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
  const [currentPage, setCurrentPage] = useState(null);
  const productsPerPage = 10;
  const [isPreviousClicked, setPreviousClicked] = useState(false);
  const [isNextClicked, setNextClicked] = useState(false);

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: `/api/products?shop=dimitar-shop-app-test.myshopify.com?=cursor=?=${currentPage}&limit=${productsPerPage}`,
    reactQueryOptions: {
      onSuccess: (data) => {
        setIsLoading(false);
      },
    },
  });

  useEffect(() => {
    if (isNextClicked || isPreviousClicked) {
      setIsLoading(true);
      // setCurrentPage(currentPage + 1);
      async function fetchData() {
        // if (data?.pageInfo?.hasNextPage) {
          console.log('HERE', currentPage);
          const response = await fetch(`/api/products?cursor=?=${currentPage}&limit=${productsPerPage}`, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
            }
          });
          // await refetchProducts();
        // }
        setIsLoading(false);
      }
      fetchData();
    }
  }, [isNextClicked, isPreviousClicked])

  const handleGenerateTOC = async (event, element) => {
    console.log('element', element);
    // console.log('gid', gid);
    setIsLoading(true);
    const response = await fetch("/api/generateTocPerProduct", { 
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gid: element.id,
        descriptionHtml: element.descriptionHtml,
        metafieldToc: element.metafields
      }),
    });

    if (response.ok) {
      await refetchProductCount();
      // const response2 = await fetch('/api/products/count', { method: "GET" });

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

  const splitElement = (element) => {
    const parts = element.id.split('/');
    const id = parts[parts.length - 1];

    return id;
  };

  const rows = data && data?.products.length > 0 && data?.products.map((element) => {    
    const productId = splitElement(element);

    return [<Link
        removeUnderline
        url={`https://admin.shopify.com/store/dimitar-shop-app-test/products/${productId}`}
        key="emerald-silk-gown"
      >
        {element.title}
      </Link>,
      element.isTocGenerated ? 'Yes' : 'No',
      !element.isTocGenerated ? <Button icon={PlusIcon} onClick={(event) => handleGenerateTOC(event, element)}>Generate TOC</Button> : null]
  });

  const handlePreviousPage = async () => {
    console.log('here2', currentPage);
    setPreviousClicked(!isPreviousClicked);
    setCurrentPage(currentPage - 1);

    // if (currentPage === 0) {
    //   return;
    // }
    // setIsLoading(true);
    // setCurrentPage(currentPage - 1);
    // const response = await fetch(`/api/products?page=${currentPage}&limit=${productsPerPage}`, { 
    //   method: "GET",
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // });
    //  await refetchProducts();
    // setIsLoading(false);
  };

  const handleNextPage = () => {
    console.log('here1', currentPage);

    setNextClicked(!isNextClicked);
    setCurrentPage(currentPage + 1);
    
    // setIsLoading(true);
    // setCurrentPage(currentPage + 1);

    // if (data?.pageInfo?.hasNextPage) {
    //   console.log('here1', currentPage);
    //   const response = await fetch(`/api/products?page=${currentPage}&limit=${productsPerPage}`, { 
    //     method: "GET",
    //     headers: {
    //       'Content-Type': 'application/json',
    //     }
    //   });
    //   // await refetchProducts();
    // }
    // setIsLoading(false);
  };
  
  return (
    // console.log('data.products.length', data?.products.length),

    data && data?.products.length > 0 ? 
    <div className="products-wrapper">
      <Page 
        title="Products" 
        fullWidth
        pagination={{
          hasPrevious: currentPage > 1,
          onPrevious: () => handlePreviousPage(),
          hasNext: data?.products.length > 10 || data?.pageInfo?.hasNextPage,
          onNext: () => {
            setCurrentPage(currentPage + 1);
            handleNextPage();
          }
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
      </div> : <Loading />
    );
}

export default Products;