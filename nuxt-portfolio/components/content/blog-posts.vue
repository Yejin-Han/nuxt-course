<template>
  <slot :posts="posts">
    <!-- 이 slot은 부모 컴포넌트로 데이터를 전달해줄 scoped slot이라고 생각하자 -->
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
            <div
              :class="{
                'opacity-0': !post.displayYear, //text-white dark:text-gray-900 강의에선 이걸로 했는데 그냥 아예 안보이게 하는게 깔끔할 것 같아서 수정함
                'text-gray-400 dark:text-gray-500': post.displayYear,
              }"
            >
              {{ post.year }}
            </div>
            <div>{{ post.title }}</div>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </slot>
</template>

<script setup>
const props = defineProps({
  limit: {
    type: Number,
    default: null,
  },
});

const { data } = await useAsyncData("blog-list", () => {
  const query = queryContent("/blog")
    .where({ _path: { $ne: "/blog" } }) // 목록을 보여줄 /blog path가 목록에 포함되어 뜨기 때문에 제외시켜줌
    .only(["_path", "title", "publishedAt"])
    .sort({ publishedAt: -1 });

  if (props.limit) {
    query.limit(props.limit); // query 개수 제한
  }

  return query.find();
});

const posts = computed(() => {
  if (!data.value) {
    return [];
  }

  const result = [];
  let lastYear = null;

  for (const post of data.value) {
    const year = new Date(post.publishedAt).getFullYear();
    const displayYear = year !== lastYear;
    post.displayYear = displayYear;
    post.year = year;
    result.push(post);
    lastYear = year;
  }
  return result;
});
</script>

<style scoped>
.column {
  @apply flex items-center space-x-8 py-2 border-b border-gray-200 dark:border-gray-700;
}
</style>
