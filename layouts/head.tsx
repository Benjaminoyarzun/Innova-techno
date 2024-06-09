import React from "react";
import NextHead from "next/head";
import { siteConfig } from "@/config/site";

interface HeadProps {
  title?: string;
  description?: string;
}

export const Head: React.FC<HeadProps> = ({ title, description }) => {
  return (
    <NextHead>
      <title>{title || siteConfig.name}</title>
      <meta key="title" content={title || siteConfig.name} property="og:title" />
      <meta content={description || siteConfig.description} property="og:description" />
      <meta content={description || siteConfig.description} name="description" />
      <meta
        key="viewport"
        content="viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        name="viewport"
      />
      <link href="/favicon.ico" rel="icon" />
    </NextHead>
  );
};
