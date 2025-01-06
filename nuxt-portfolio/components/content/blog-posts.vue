<template>
  <section class="not-prose">
    <ul>
      <li v-for="(post, idx) in posts" :key="idx">
        <NuxtLink :to="post._path">{{ post.title }}</NuxtLink>
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
