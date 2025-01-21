<template>
  <div
    class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
  >
    <div class="col-span-2 flex justify-between items-center space-x-4">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="iconColor" />
        <div>{{ transaction.description }}</div>
      </div>
      <div>
        <UBadge color="white" v-if="transaction.category">{{
          transaction.category
        }}</UBadge>
      </div>
    </div>
    <div class="flex justify-end items-center space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
            :loading="isLoading"
          />
          <TransactionModal
            v-model="isOpen"
            :transaction="transaction"
            @saved="emit('edited')"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: Object,
});
const emit = defineEmits(["deleted", "edited"]); // transaction.vue에서 delete, edit 이벤트가 일어난다는 사실을 index.vue로 전달하고, 해당 이벤트 자리에 index.vue에서 생성된 함수를 반영하기 위해. 즉, 자식 컴포넌트에서 지정한 위치에서 이벤트를 방출하면 부모 컴포넌트에서 그 자리에 함수를 전달해서 실행하도록 한다고 보면 됨.

const isIncome = computed(() => props.transaction.type === "Income");
const icon = computed(() =>
  isIncome.value ? "i-heroicons-arrow-up-right" : "i-heroicons-arrow-down-left"
);
const iconColor = computed(() =>
  isIncome.value ? "text-green-600" : "text-red-600"
);

const { currency } = useCurrency(props.transaction.amount);

const isLoading = ref(false);
const { toastSuccess, toastError } = useAppToast();
const supabase = useSupabaseClient();

const isOpen = ref(false);

const deleteTransaction = async () => {
  isLoading.value = true;

  try {
    await supabase.from("transactions").delete().eq("id", props.transaction.id);

    toastSuccess({
      title: "Transaction deleted",
    });

    emit("deleted", props.transaction.id);
  } catch (err) {
    toastError({
      title: "Transaction delete failed",
    });
  } finally {
    isLoading.value = false;
  }
};

const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => (isOpen.value = true),
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: deleteTransaction,
    },
  ],
];
</script>
