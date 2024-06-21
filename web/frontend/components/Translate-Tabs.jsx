import { LegacyCard, Tabs, Button, CalloutCard } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useAuthenticatedFetch } from "../hooks";

function TranslateTabs() {
  const [isLoading, setIsLoading] = useState(true);
  const fetch = useAuthenticatedFetch();

  const translate = async (language) => {
    setIsLoading(true);
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ language }),
    });

    if (response.ok) {
      setIsLoading(false);
      console.log("works translate");
    } else {
      setIsLoading(false);
      console.log("doesnt work transalte");
    }
  };

  return (
    <CalloutCard
      title="Translate Products"
      primaryAction={{
        // onAction: writeCollections,
        loading: isLoading,
      }}
    >
      <div style={{ marginTop: "15px" }}>
        <Button
          style={{ marginRight: "10px" }}
          size="large"
          onClick={() => translate("English")}
        >
          Translate to English
        </Button>
        <Button size="large" onClick={() => translate("Slovenian")}>
          Translate to Slovenian
        </Button>
      </div>
    </CalloutCard>
  );
}

export default TranslateTabs;
