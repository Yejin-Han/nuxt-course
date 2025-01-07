<template>
  <BlogPosts v-slot="{ posts }" :limit="limit">
    <!-- BlogPosts의 posts 데이터를 받아옴과 동시에 빈 slot 자리에 여기만의 데이터를 새로 채워준다고 보면 됨 -->
    <div v-for="post in posts" :key="post._path">
      <NuxtLink :to="post._path">{{ post.title }}</NuxtLink>
    </div>
  </BlogPosts>
</template>

<script setup>
defineProps({
  limit: {
    type: Number,
    default: null,
  },
});
</script>
