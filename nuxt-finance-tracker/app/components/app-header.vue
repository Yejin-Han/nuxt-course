<template>
  <header
    class="flex justify-between items-center mt-10 mx-auto max-w-4xl w-[94%]"
  >
    <NuxtLink to="/" class="text-xl font-bold">Finance Tracker</NuxtLink>
    <div class="flex items-center space-x-4">
      <UDropdown
        :items="items"
        :ui="{
          item: { disabled: 'cursor-text select-text' },
          width: 'w-64',
          /* transition: { // slidedown/up 되는 것처럼 config 수정해봄(근데 이상함)
            enterActiveClass:
              'transition-all duration-300 ease-out overflow-hidden',
            enterFromClass: 'max-h-0 opacity-0 transform scale-100',
            enterToClass: 'max-h-[150px] opacity-100',
            leaveActiveClass:
              'transition-all duration-200 ease-in overflow-hidden',
            leaveFromClass: 'max-h-[150px] opacity-100',
            leaveToClass: 'max-h-0 opacity-0 transform scale-100',
          }, */
        }"
        v-if="user"
      >
        <UAvatar :src="url" alt="Avatar" />
        <template #account="{ item }">
          <div class="text-left">
            <p>Signed in as</p>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ item.label }}
            </p>
          </div>
        </template>

        <template #item="{ item }">
          <span class="truncate">{{ item.label }}</span>
          <!-- label 속성 없이 user.email을 바로 사용하라는데.. (이메일 불러오는게 좀 늦다고) 나는 문제가 읎다! -->
          <UIcon
            :name="item.icon"
            class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
          />
        </template>
      </UDropdown>
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
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { url } = useAvatarUrl();

const items = [
  [
    {
      label: user.value?.email,
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Settings",
      icon: "i-heroicons-cog-8-tooth",
      click: () => navigateTo("/settings/profile"),
    },
  ],
  [
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: async () => {
        await supabase.auth.signOut();
        return navigateTo("/login");
      },
    },
  ],
];

//////////////////////////////////////////////////////////////////////////////////
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
</script>
