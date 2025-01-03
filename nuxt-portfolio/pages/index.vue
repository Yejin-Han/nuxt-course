<template>
  <div>Hello from the main page!</div>
</template>

<script setup>
useSeoMeta({
  title: "Main",
  description: "This is the main page",
  ogTitle: "Main",
  ogDescription: "This is the main page",
  ogImage: "[og:image]",
  ogUrl: "[og:url]",
  twitterTitle: "Main",
  twitterDescription: "This is the main page",
  twitterImage: "[twitter:image]",
  twitterCard: "summary",
});

useHead({
  htmlAttrs: {
    lang: "en",
  },
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/public/favicon.ico",
    },
  ],
});
</script>
