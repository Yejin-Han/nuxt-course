<template>
  <div>
    <div class="font-bold" :class="[color]">{{ title }}</div>

    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <!-- loading = true면, pulse 중인 빈 rounded-box를 보여준다(자리차지) -->
      <USkeleton class="h-8 w-full" v-if="loading" />
      <div v-else>{{ currency }}</div>
    </div>

    <div>
      <USkeleton class="h-6 w-full" v-if="loading" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon
          :name="icon"
          class="w-6 h-6"
          :class="{ green: trendingUp, red: !trendingUp }"
        />
        <div class="text-gray-500 dark:text-gray-400">
          {{ percentageTrend }}% vs last period
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  amount: Number,
  lastAmount: Number,
  color: String,
  loading: Boolean,
});

const trendingUp = computed(() => props.amount >= props.lastAmount);
const icon = computed(() =>
  trendingUp.value
    ? "i-heroicons-arrow-trending-up"
    : "i-heroicons-arrow-trending-down"
);
const { currency } = useCurrency(toRef(props, "amount")); // toRef로 감싸준 이유는, index.vue에서 amount는 반응성을 잃은 일반 값 상태로 전달되므로, useCurrency.js에서 isRef(amount)를 검사해보면 false가 나오므로 amount.value값이 아닌 amount 값을 사용하게 되니, 초기 값 포맷 이후에는 다시 계산되지 않을 수 밖에 없음.
/* 
const { amount } = toRefs(props);
const { currency } = useCurrency(amount);로 해도 동일함!
*/
const percentageTrend = computed(() => {
  if (props.amount === 0 || props.lastAmount === 0) return "∞";

  const larger = Math.max(props.amount, props.lastAmount);
  const smaller = Math.min(props.amount, props.lastAmount);
  const percentage = ((larger - smaller) / smaller) * 100;

  return Math.ceil(percentage);
});
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}
.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
