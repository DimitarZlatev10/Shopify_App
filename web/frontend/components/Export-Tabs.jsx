import { LegacyCard, Tabs, Button } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useAuthenticatedFetch } from "../hooks";

function ExportTabs() {
  const [selected, setSelected] = useState(0);
  const fetch = useAuthenticatedFetch();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const exportProductsMetafields = async () => {
    setIsLoading(true);
    const response = await fetch("/api/products/writeMetafields", {
      method: "POST",
    });

    if (response.ok) {
      setSelected(1);
      setSuccessMessage("Products Metafields exported successfully!");
      setIsLoading(false);
    } else {
      setErrorMessage("Failed to export Products Metafields!");
      setIsLoading(false);
    }
  };

  const exportCollectionsMetafields = async () => {
    setIsLoading(true);

    const response = await fetch("/api/collections/writeMetafields", {
      method: "POST",
    });
    if (response.ok) {
      setSelected(2);
      setSuccessMessage("Collections Metafields exported successfully!");
      setIsLoading(false);
    } else {
      setErrorMessage("Failed to export Collections Metafields!");
      setIsLoading(false);
    }
  };

  const exportProducts = async () => {
    setIsLoading(true);

    const response = await fetch("/api/writeProducts", {
      method: "POST",
    });
    if (response.ok) {
      setSelected(3);
      setSuccessMessage("Products exported successfully!");
      setIsLoading(false);
    } else {
      setErrorMessage("Failed to export Products!");
      setIsLoading(false);
    }
  };

  const exportCollections = async () => {
    setIsLoading(true);

    const response = await fetch("/api/writeCollections", {
      method: "POST",
    });
    if (response.ok) {
      setSelected(4);
      setSuccessMessage("Collections exported successfully!");
      setIsLoading(false);
    } else {
      setErrorMessage("Failed to export Collections!");
      setIsLoading(false);
    }
  };

  const tabs = [
    {
      id: "Export Products Metafields",
      content: "Products Metafields",
      panelID: "Products Metafields",
    },
    {
      id: "Export Collections Metafields",
      content: "Collections Metafields",
      panelID: "Collections Metafields",
    },
    {
      id: "Export Products",
      content: "Products",
      panelID: "Products",
    },
    {
      id: "Export Collections",
      content: "Collections",
      panelID: "Collections",
    },
    {
      id: "Done",
      content: "Done Exporting",
      panelID: "Done Exporting",
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Export Shop Contents</h1>
      </div>
      <hr style={{ marginTop: "15px", textDecoration: "underline" }} />
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <LegacyCard.Section title={tabs[selected].content}>
          {errorMessage && (
            <div
              style={{
                color: "red",
                marginTop: "10px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div
              style={{
                color: "green",
                marginTop: "10px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {successMessage}
            </div>
          )}
          {selected === 0 && (
            <div>
              <Button
                loading={isLoading}
                style={{ marginTop: "15px" }}
                size="large"
                onClick={exportProductsMetafields}
              >
                Export Products Metafields
              </Button>
            </div>
          )}
          {selected === 1 && (
            <div>
              <Button
                loading={isLoading}
                style={{ marginTop: "15px" }}
                size="large"
                onClick={exportCollectionsMetafields}
              >
                Export Collections Metafields
              </Button>
            </div>
          )}
          {selected === 2 && (
            <div>
              <Button
                loading={isLoading}
                style={{ marginTop: "15px" }}
                size="large"
                onClick={exportProducts}
              >
                Export Products
              </Button>
            </div>
          )}
          {selected === 3 && (
            <div>
              <Button
                loading={isLoading}
                style={{ marginTop: "15px" }}
                size="large"
                onClick={exportCollections}
              >
                Export Collections
              </Button>
            </div>
          )}
        </LegacyCard.Section>
      </Tabs>
    </div>
  );
}

export default ExportTabs;
