export const useFetchTransactions = (period) => {
  const supabase = useSupabaseClient();
  const transactions = ref([]);
  const pending = ref(false);
  const { toUTC } = useTimezoneAdjust();

  const income = computed(() =>
    transactions.value.filter((t) => t.type === "Income")
  );
  const expense = computed(() =>
    transactions.value.filter((t) => t.type === "Expense")
  );
  const investment = computed(() =>
    transactions.value.filter((t) => t.type === "Investment")
  );
  const saving = computed(() =>
    transactions.value.filter((t) => t.type === "Saving")
  );

  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => expense.value.length);
  // const investmentCount = computed(() => investment.value.length);
  // const savingCount = computed(() => saving.value.length);

  const incomeTotal = computed(() =>
    income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );
  const expenseTotal = computed(() =>
    expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );
  const investmentTotal = computed(() =>
    investment.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );
  const savingTotal = computed(() =>
    saving.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  const fetchTransactions = async () => {
    pending.value = true;

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

      const fromUTC = toUTC(period.value.from);
      const toUTCDate = toUTC(period.value.to);

      const { data, error } = await supabase
        .from("transactions")
        .select()
        .gte("created_at", fromUTC)
        .lte("created_at", toUTCDate)
        .order("created_at", { ascending: false }); // 날짜 기준 내림차순 정렬 백엔드 방법

      if (error) return [];
      return data;
    } finally {
      pending.value = false;
    }
  };

  const refresh = async () => (transactions.value = await fetchTransactions());

  watch(period, async () => await refresh());

  const transactionsGroupedByDate = computed(() => {
    let grouped = {};

    for (const transaction of transactions.value) {
      const transactionDate = new Date(transaction.created_at);
      const date = toUTC(transactionDate).split("T")[0];

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    }

    return grouped;

    // 날짜 기준 내림차순 정렬 프론트엔드 방법
    // const sortedKeys = Object.keys(grouped).sort().reverse();
    // const sortedGrouped = {};

    // for (const key of sortedKeys) {
    //   sortedGrouped[key] = grouped[key];
    // }

    // return sortedGrouped;
  });

  return {
    transactions: {
      // 임의로 객체 안에 넣어서 계층적으로 접근할 수 있도록 함
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
      income,
      expense,
      investment,
      saving,
      incomeCount,
      expenseCount,
      incomeTotal,
      expenseTotal,
      investmentTotal,
      savingTotal,
    },
    refresh,
    pending,
  };
};
