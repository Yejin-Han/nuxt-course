<template>
  <header
    class="flex justify-between items-center mt-10 mx-auto max-w-4xl w-[94%]"
  >
    <NuxtLink to="/" class="text-xl font-bold">Finance Tracker</NuxtLink>
    <div class="flex items-center space-x-4">
      <UAvatar
        src="https://avatars.githubusercontent.com/u/739984?v=4"
        alt="Avatar"
      />
      <!-- 임의로 색상모드 토글버튼 추가 -->
      <button
        class="rounded-full w-8 h-8 bg-gray-800 dark:bg-gray-200 text-2xl"
        @click="toggleMode"
      >
        {{ currentModeIcon }}
      </button>
    </div>
  </header>
</template>

<script setup>
const isDarkMode = ref(true);
const currentModeIcon = computed(() => (isDarkMode.value ? "🌑" : "🌕"));
const toggleMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

onMounted(() => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  isDarkMode.value = prefersDark;
});

useHead({
  htmlAttrs: {
    class: computed(() => (isDarkMode.value ? "dark" : "")),
  },
});

////////////////////////////////////////////////////////////////
const user = useSupabaseUser();

watch(
  user,
  (user) => {
    if (user) {
      console.log(user);
    }
  },
  { immediate: true }
);
</script>
