<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>{{ isEditing ? "Edit" : "Add" }} Transition</template>

      <UForm :state="state" :schema="schema" ref="form" @submit="save">
        <UFormGroup
          label="Transaction Type"
          :required="true"
          name="type"
          class="mb-4"
        >
          <USelect
            placeholder="Select the transaction type"
            :options="types"
            v-model="state.type"
            :disabled="isEditing"
          />
        </UFormGroup>
        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput
            type="number"
            placeholder="Amount"
            v-model.number="state.amount"
          />
        </UFormGroup>
        <UFormGroup
          label="Transaction date"
          :required="true"
          name="created_at"
          class="mb-4"
        >
          <UInput
            type="date"
            icon="i-heroicons-calendar-days-20-solid"
            v-model="state.created_at"
          />
        </UFormGroup>
        <UFormGroup
          label="Description"
          hint="Optional"
          name="description"
          class="mb-4"
        >
          <UInput
            type="text"
            placeholder="Description"
            v-model="state.description"
          />
        </UFormGroup>
        <UFormGroup
          label="Category"
          :required="true"
          name="category"
          class="mb-4"
          v-if="state.type === 'Expense'"
        >
          <USelect
            placeholder="Category"
            :options="categories"
            v-model="state.category"
          />
        </UFormGroup>

        <UButton
          type="submit"
          color="black"
          variant="solid"
          label="Save"
          :loading="isLoading"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { categories, types } from "~/constants";
import { z } from "zod";

const props = defineProps({
  modelValue: Boolean,
  transaction: {
    type: Object,
    required: false,
  },
});
const isEditing = computed(() => !!props.transaction); // !!(double negative operator): false, 0, null, undefined에 대해서만 false 반환 => transaction 값이 있었으면 true, 없었으면 false
const emit = defineEmits(["update:modelValue", "saved"]); // update:modelValue => 부모에게 modelValue의 상태를 바꾸라고 요청(값 업데이트 하기 위해)

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive("Amount needs to be more than 0"),
});

const incomeSchema = z.object({
  type: z.literal("Income"), // z.literal은 말 그대로 괄호 안의 값 이외의 값은 일절 허용하지 않는 것. 즉, 고정값
});
const expenseSchema = z.object({
  type: z.literal("Expense"),
  category: z.enum(categories), // z.enum은 마치 select처럼 사용 가능한 값의 열거
});
const investSchema = z.object({
  type: z.literal("Investment"),
});
const savingSchema = z.object({
  type: z.literal("Saving"),
});

const schema = z.intersection(
  z.discriminatedUnion("type", [
    // z.discriminatedUnion은 key 값을 공유하는 옵션들 중 하나만 선택해서 테스트함
    incomeSchema,
    expenseSchema,
    investSchema,
    savingSchema,
  ]),
  defaultSchema
);

const form = ref();
const isLoading = ref(false);
const supabase = useSupabaseClient();
const { toastSuccess, toastError } = useAppToast();

const save = async () => {
  if (form.value.errors.length) return;

  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("transactions")
      .upsert({ ...state.value, id: props.transaction?.id });

    if (!error) {
      toastSuccess({
        title: "Transaction saved",
      });
      isOpen.value = false;
      emit("saved");
      return;
    }
    throw error;
  } catch (err) {
    toastError({
      title: "Transaction not saved",
      description: err.message,
    });
  } finally {
    isLoading.value = false;
  }
};

const initialState = isEditing.value
  ? {
      type: props.transaction.type,
      amount: props.transaction.amount,
      created_at: props.transaction.created_at.split("T")[0],
      description: props.transaction.description,
      category: props.transaction.category,
    }
  : {
      type: undefined,
      amount: 0,
      created_at: undefined,
      description: undefined,
      category: undefined,
    };

const state = ref({
  // reactive썼었는데, reactive는 Proxy 객체로 감싸기 때문에 Object.assign이 제대로 작동하지 않음. reactive를 사용한다면 속성을 개별적으로 업데이트 해야 함
  ...initialState,
});
const resetForm = () => {
  Object.assign(state.value, initialState);
  form.value.clear();
};

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit("update:modelValue", value);
  },
});

/* 
** defineModel 이용시 **
const isOpen = defineModel({
  prop: "modelValue",
  event: "update:modelValue",
  default: false,
});
*/
</script>
