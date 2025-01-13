<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>Add Transition</template>

      <UForm :state="state">
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
        >
          <USelect
            placeholder="Category"
            :options="categories"
            v-model="state.category"
          />
        </UFormGroup>
      </UForm>

      <UButton type="submit" color="black" variant="solid" label="Save" />
    </UCard>
  </UModal>
</template>

<script setup>
import { categories, types } from "~/constants";

const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]); // 부모에게 modelValue의 상태를 바꾸라고 요청(값 업데이트 하기 위해)

const state = reactive({
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
});

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
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
