<template>
  <section class="not-prose font-mono">
    <div class="column text-gray-400 text-sm">
      <div>date</div>
      <div>title</div>
    </div>
    <ul>
      <li v-for="(post, idx) in posts" :key="idx">
        <NuxtLink
          :to="post._path"
          class="column hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <div class="text-gray-500">2023</div>
          <div>{{ post.title }}</div>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup>
const { data: posts } = await useAsyncData("blog-list", () =>
  queryContent("/blog")
    .where({ _path: { $ne: "/blog" } }) // 목록을 보여줄 /blog path가 목록에 포함되어 뜨기 때문에 제외시켜줌
    .only(["_path", "title"])
    .find()
);
</script>

<style scoped>
.column {
  @apply flex items-center space-x-8 py-2 border-b border-gray-200 dark:border-gray-700;
}
</style>
