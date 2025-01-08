<template>
  <ul>
    <li v-for="link in links" :key="link.id">
      <NuxtLink
        :to="{ path: link.path, hash: `#${link.id}` }"
        :class="{
          'ml-4': level,
          'text-green-600 dark:text-green-400': activeId === link.id,
        }"
      >
        {{ link.text }}
      </NuxtLink>
      <TocLinks
        :links="link.children"
        :level="level + 1"
        :active-id="activeId"
      />
    </li>
  </ul>
</template>

<script setup>
const route = useRoute(); // NuxtLink와 같이 라우트 변경을 트리거하는 요소가 있을 때, useRoute를 직접 참조하는 경우 라우트 변경 전에 실행되는 데이터를 참조하게 될 수 있으므로 에러발생. 따라서, 위에서 path: route.path 대신 link.path를 사용함
defineProps({
  links: Array,
  level: {
    type: Number,
    default: 0,
  },
  activeId: {
    type: String,
    default: null,
  },
});
</script>
