import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export const queryClient = new QueryClient();

export default function QueryProvider(props: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {props?.children}
    </QueryClientProvider>
  );
}

export const queryKeys = {
  get_products: "get_products",
  get_product_types: "get_product_types",
  get_feedback: "get_feedback",
  get_account: "get_account",
  get_news_content: "get_news_content",
  get_news_project: "get_news_project",
  get_news_service: "get_news_service",
  get_images: "get_images",
  get_tags: "get_tags",
  get_eventIds: "get_eventIds",
  get_competition: "get_competition",
};
