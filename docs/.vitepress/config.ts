import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TabMate.js",
  description:
    "TabMate is a lightweight (~<1KB gzipped), framework-agnostic JavaScript library for enabling tab/indentation behavior to HTML elements like `textarea` — just like in modern code editors.",
  base: "/tabmate/",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/docs/why" },
      { text: "API", link: "/api" },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025-present Pascal Bothner",
    },
    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Why TabMate?", link: "/docs/why" },
          { text: "Getting started", link: "/docs/getting-started" },
          { text: "Examples", link: "/docs/examples" },
        ],
      },
    ],
    logo: "/logo.svg",
    socialLinks: [
      { icon: "github", link: "https://github.com/pboth1304/tabmate" },
    ],
  },
});
