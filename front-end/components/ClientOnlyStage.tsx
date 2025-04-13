"use client";
import dynamic from "next/dynamic";

const StageComponent = dynamic(() => import("./StageComponent"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const ClientOnlyStage = (props: any) => {
  return <StageComponent {...props} />;
};

export default ClientOnlyStage;
