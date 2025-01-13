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

  <section class="flex justify-between mb-10">
    <div>
      <h2 clas="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this
        period
      </div>
    </div>
    <div>
      <TransactionModal v-model="isOpen" />
      <!-- :model-value="isOpen" @update:model-value="(value) => isOpen = value" 과 같음 -->
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        wariant="solid"
        label="Add"
        @click="isOpen = true"
      />
    </div>
  </section>

  <section v-if="!isLoading">
    <div
      v-for="(transactionsOnDay, date) in transactionsGroupedByDate"
      :key="date"
      class="mb-10"
    >
      <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
      <Transaction
        v-for="transaction in transactionsOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refreshTransactions()"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup>
import { transactionViewOptions } from "~/constants";
const selectedView = ref(transactionViewOptions[1]);
const transactions = ref([]);
const isLoading = ref(false);
const isOpen = ref(false);

const income = computed(() =>
  transactions.value.filter((t) => t.type === "Income")
);
const expense = computed(() =>
  transactions.value.filter((t) => t.type === "Expense")
);

const incomeCount = computed(() => income.value.length);
const expenseCount = computed(() => expense.value.length);

const incomeTotal = computed(() =>
  income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
);
const expenseTotal = computed(() =>
  expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
);

const trendOptions = computed(() => [
  //반응성 부여를 위해 computed로 수정함
  {
    color: "green",
    title: "Income",
    amount: incomeTotal.value,
    lastAmount: 4100000,
    loading: isLoading.value,
  },
  {
    color: "red",
    title: "Expense",
    amount: expenseTotal.value,
    lastAmount: 3800000,
    loading: isLoading.value,
  },
  {
    color: "green",
    title: "Investments",
    amount: 4000000,
    lastAmount: 3000000,
    loading: isLoading.value,
  },
  {
    color: "red",
    title: "Saving",
    amount: 4000000,
    lastAmount: 4100000,
    loading: isLoading.value,
  },
]);

const supabase = useSupabaseClient();

const fetchTransactions = async () => {
  isLoading.value = true;

  try {
    /* 
      ** 원래 아래 내용과 같았는데, 'Component is already mounted, please use $fetch instead' 에러가 떠서
         useAsyncData를 삭제하고 일반 $fetch로 변경 **

      const { data } = await useAsyncData("transactions", async () => {
        // 서버, 클라이언트 두 번 fetching 되는 것을 막기 위해 useAsyncData 사용
        const { data, error } = await supabase.from("transactions").select();

        if (error) return [];
        return data;
      });
      return data.value;
    */
    const { data, error } = await supabase.from("transactions").select();

    if (error) return [];
    return data;
  } finally {
    isLoading.value = false;
  }
};

const refreshTransactions = async () =>
  (transactions.value = await fetchTransactions());
await refreshTransactions();

const transactionsGroupedByDate = computed(() => {
  let grouped = {};

  for (const transaction of transactions.value) {
    const transactionDate = new Date(transaction.created_at);
    const offset = transactionDate.getTimezoneOffset() * 60000; // toISOString은 UTC를 기준으로 하므로 한국과 9시간 차이가 나기 때문에 날짜만 사용하더라도 문제가 생길 수 있음. 이를 보정해주기 위한 offset 계산
    const date = new Date(transactionDate.getTime() - offset)
      .toISOString()
      .split("T")[0];

    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  }

  return grouped;
});
</script>
