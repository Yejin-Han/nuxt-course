<template>
  <section>
    <ul>
      <li v-for="(post, idx) in posts" :key="idx">
        <NuxtLink :to="post._path">{{ post.title }}</NuxtLink>
      </li>
    </ul>
  </section>
</template>

<script setup>
const { data: posts } = await useAsyncData("blog-list", () =>
  queryContent("/blog").only(["_path", "title"]).find()
);
console.log(posts);
</script>
