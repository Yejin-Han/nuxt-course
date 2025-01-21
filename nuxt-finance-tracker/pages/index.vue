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
      <TransactionModal v-model="isOpen" @saved="refresh()" />
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

  <section v-if="!pending">
    <div v-for="(transactionsOnDay, date) in byDate" :key="date" class="mb-10">
      <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
      <Transaction
        v-for="transaction in transactionsOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refresh()"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup>
import { transactionViewOptions } from "~/constants";

const user = useSupabaseUser();

const selectedView = ref(
  user.value.user_metadata?.transaction_view ?? transactionViewOptions[1]
);
const isOpen = ref(false);
const { curr, prev } = useSelectedTimePeriod(selectedView);

const {
  // *계층적 구조 분해
  pending,
  refresh,
  transactions: {
    incomeCount,
    expenseCount,
    incomeTotal,
    expenseTotal,
    investmentTotal,
    savingTotal,
    grouped: { byDate },
  },
} = useFetchTransactions(curr);

const {
  refresh: refreshPrev,
  transactions: {
    incomeTotal: prevIncomeTotal,
    expenseTotal: prevExpenseTotal,
    investmentTotal: prevInvestmentTotal,
    savingTotal: prevSavingTotal,
  },
} = useFetchTransactions(prev);

await Promise.all([refresh(), refreshPrev()]);

const trendOptions = computed(() => [
  //반응성 부여를 위해 computed로 수정함
  {
    color: "green",
    title: "Income",
    amount: incomeTotal.value,
    lastAmount: prevIncomeTotal.value,
    loading: pending.value,
  },
  {
    color: "red",
    title: "Expense",
    amount: expenseTotal.value,
    lastAmount: prevExpenseTotal.value,
    loading: pending.value,
  },
  {
    color: "green",
    title: "Investments",
    amount: investmentTotal.value,
    lastAmount: prevInvestmentTotal.value,
    loading: pending.value,
  },
  {
    color: "red",
    title: "Saving",
    amount: savingTotal.value,
    lastAmount: prevSavingTotal.value,
    loading: pending.value,
  },
]);
</script>
