<template>
  <article class="prose dark:prose-invert">
    <!-- tailwind 적용시 모든 스타일이 무효화되는 점으로 인해 markdown 서식도 무효화되는 경우, @tailwindcss/typography를 이용하여 해당 부분만 css reset을 하지 않음 -->
    <ContentDoc />
  </article>
</template>

<script setup>
const route = useRoute();
console.log(route.params.slug);
</script>
