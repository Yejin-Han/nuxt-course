<template>
  <section class="flex justify-between items-center mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu :options="transactionViewOptions" v-model="selectedView" />
    </div>
  </section>

  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 mb-10"
  >
    <Trend
      v-for="(option, idx) in trendOptions"
      :key="idx"
      :color="option.color"
      :title="option.title"
      :amount="option.amount"
      :last-amount="option.lastAmount"
      :loading="option.loading"
    />
  </section>

  <section>
    <Transaction
      v-for="transaction in transactions"
      :key="transaction.id"
      :transaction="transaction"
    />
  </section>
</template>

<script setup>
import { transactionViewOptions } from "~/constants";
const selectedView = ref(transactionViewOptions[1]);

const trendOptions = [
  {
    color: "green",
    title: "Income",
    amount: 4000,
    lastAmount: 3000,
    loading: false,
  },
  {
    color: "red",
    title: "Expense",
    amount: 4000,
    lastAmount: 5000,
    loading: false,
  },
  {
    color: "green",
    title: "Investments",
    amount: 4000,
    lastAmount: 3000,
    loading: false,
  },
  {
    color: "red",
    title: "Saving",
    amount: 4000,
    lastAmount: 4100,
    loading: false,
  },
];

const supabase = useSupabaseClient();
const transactions = ref([]);
const { data, status } = await useAsyncData("transactions", async () => {
  // 서버, 클라이언트 두 번 fetching 되는 것을 막기 위해 useAsyncData 사용
  const { data, error } = await supabase.from("transactions").select();
  if (error) return [];
  return data;
});
transactions.value = data.value;
</script>
