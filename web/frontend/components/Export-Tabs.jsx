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
    await fetch("/api/products/writeMetafields", {
      method: "POST",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "Metafield_Definitions-Products.txt";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setSelected(1);
        setSuccessMessage("Products Metafields exported successfully!");
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage("Error exporting Products Metafields: " + error);
        setIsLoading(false);
      });
  };

  const exportCollectionsMetafields = async () => {
    setIsLoading(true);
    await fetch("/api/collections/writeMetafields", {
      method: "POST",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "Metafield_Definitions-Collections.txt";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setSelected(2);
        setSuccessMessage("Collections Metafields exported successfully!");
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage("Error exporting Collections Metafields: " + error);
        setIsLoading(false);
      });
  };

  const exportProducts = async () => {
    setIsLoading(true);
    await fetch("/api/writeProducts", {
      method: "POST",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "Products.txt";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setSelected(3);
        setSuccessMessage("Products exported successfully!");
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage("Error exporting Products: " + error);
        setIsLoading(false);
      });
  };

  const exportCollections = async () => {
    setIsLoading(true);
    await fetch("/api/writeCollections", {
      method: "POST",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "Collections.txt";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setSelected(4);
        setSuccessMessage("Collections exported successfully!");
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage("Error exporting Collections: " + error);
        setIsLoading(false);
      });
  };

  const writeMenus = async () => {
    setIsLoading(true);
    await fetch("/api/writeMenus", {
      method: "POST",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "Menus.txt";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setSelected(5);
        setSuccessMessage("Menus exported successfully!");
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage("Error exporting Menus: " + error);
        setIsLoading(false);
      });
  };

  const writePages = async () => {
    setIsLoading(true);
    await fetch("/api/writePages", {
      method: "POST",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "Pages.txt";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setSelected(6);
        setSuccessMessage("Pages exported successfully!");
        setIsLoading(false);
      })
      .catch((error) => {
        setErrorMessage("Error exporting Pages: " + error);
        setIsLoading(false);
      });
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
      id: "Export Menus",
      content: "Menus",
      panelID: "Menus",
    },
    {
      id: "Export Pages",
      content: "Pages",
      panelID: "Pages",
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
          {selected === 4 && (
            <div>
              <Button
                loading={isLoading}
                style={{ marginTop: "15px" }}
                size="large"
                onClick={writeMenus}
              >
                Export Menus
              </Button>
            </div>
          )}
          {selected === 5 && (
            <div>
              <Button
                loading={isLoading}
                style={{ marginTop: "15px" }}
                size="large"
                onClick={writePages}
              >
                Export Pages
              </Button>
            </div>
          )}
        </LegacyCard.Section>
      </Tabs>
    </div>
  );
}

export default ExportTabs;
