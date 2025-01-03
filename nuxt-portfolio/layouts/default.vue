<template>
  <div class="container mx-auto max-w-2xl px-2">
    <header class="flex justify-between items-center mt-5">
      <div>
        <NuxtLink to="/" class="text-xl font-semibold p-2 hover:bg-gray-200"
          >한예진</NuxtLink
        >
      </div>
      <Menu />
    </header>

    <main class="p-2 mt-10">
      <slot />
    </main>
  </div>
</template>

<script setup>
const colorMode = useColorMode();
console.log(colorMode.preference);
colorMode.preference = "light"; // 직접 설정 가능 (기본은 시스템 설정대로)

useHead({
  titleTemplate: "%s - Yejin Han",
  link: [
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
      crossorigin: "",
    },
  ],
});
</script>

<style>
body {
  font-family: "Roboto";
  @apply bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300; /* 시스템 모드에 따라서만 결정 가능 */
}
</style>
