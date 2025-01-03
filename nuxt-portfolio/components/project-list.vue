<template>
  <p class="mb-10">Take a look at my Github projects!</p>
  <section v-if="status == 'pending'">Loading...</section>
  <section v-else-if="error">Something went wrong... Try again!</section>
  <section v-else>
    <ul class="grid grid-cols-1 gap-4">
      <li
        v-for="repository in repos"
        :key="repository.id"
        class="border border-gray-200 rounded-sm hover:bg-gray-100 font-mono overflow-hidden"
      >
        <a
          :href="repository.html_url"
          target="_blank"
          class="block w-full h-full p-4"
        >
          <div class="flex justify-between items-center text-sm">
            <div class="font-semibold">{{ repository.name }}</div>
            <div>{{ repository.pushed_at.split("T")[0] }}</div>
          </div>
          <p class="text-xs mt-1 pr-20">{{ repository.description }}</p>
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup>
const { error, status, data } = await useFetch(
  "https://api.github.com/users/Yejin-Han/repos"
);
const repos = computed(() =>
  // description 적힌 repo만 추출 후 pushed_at 순으로 내림차순 정렬
  data.value
    // .filter((repo) => repo.description) // 나는 description 없는 repo도 보고 싶으므로 주석 처리함
    .sort((a, b) => {
      const dateA = new Date(a.pushed_at.split("T")[0]);
      const dateB = new Date(b.pushed_at.split("T")[0]);
      return dateB - dateA;
    })
);
</script>
