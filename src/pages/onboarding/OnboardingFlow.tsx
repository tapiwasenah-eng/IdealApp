import React, { useState } from "react";
import { AuthScreen } from "./AuthScreen";
import { CompanyBootstrapper } from "./CompanyBootstrapper";
import { GenerationLoading } from "./GenerationLoading";
import { FirstDocumentView } from "./FirstDocumentView";

type Step = "auth" | "bootstrapper" | "loading" | "document";

export default function OnboardingFlow() {
  const [step, setStep] = useState<Step>("auth");

  // We could save this data to context or state in a real app
  const [companyData, setCompanyData] = useState<any>(null);

  const handleAuthComplete = () => {
    // TODO: Replace with real authentication dispatch
    setStep("bootstrapper");
  };

  const handleGenerate = (data: any) => {
    // TODO: Send data to an AI generation endpoint
    setCompanyData(data);
    setStep("loading");
  };

  const handleLoadingComplete = () => {
    setStep("document");
  };

  return (
    <>
      {step === "auth" && <AuthScreen onAuthComplete={handleAuthComplete} />}
      {step === "bootstrapper" && (
        <CompanyBootstrapper onGenerate={handleGenerate} />
      )}
      {step === "loading" && (
        <GenerationLoading onComplete={handleLoadingComplete} />
      )}
      {step === "document" && <FirstDocumentView />}
    </>
  );
}
