<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>Add Transition</template>
      <div>Hello!</div>
    </UCard>
  </UModal>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]); // 부모에게 modelValue의 상태를 바꾸라고 요청(값 업데이트 하기 위해)

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
