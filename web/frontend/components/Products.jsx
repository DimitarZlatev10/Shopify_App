import React from 'react';
import {Page, LegacyCard, DataTable, Link, Button} from '@shopify/polaris';
import {PlusIcon} from '@shopify/polaris-icons';

const Products = () => {
  const rows = [
    [
      <Link
        removeUnderline
        url="https://www.example.com"
        key="emerald-silk-gown"
      >
        Emerald Silk Gown
      </Link>,
      'false',
      <Button icon={PlusIcon}>Generate TOC</Button>
    ],
    [
      <Link
        removeUnderline
        url="https://www.example.com"
        key="mauve-cashmere-scarf"
      >
        Mauve Cashmere Scarf
      </Link>,
      'true',
      <Button icon={PlusIcon}>Generate TOC</Button>
    ],
    [
      <Link
        removeUnderline
        url="https://www.example.com"
        key="navy-merino-wool"
      >
        Navy Merino Wool Blazer with khaki chinos and yellow belt
      </Link>,
      'false',
      <Button icon={PlusIcon}>Generate TOC</Button>
    ],
  ];

  return (
    <Page title="Products">
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