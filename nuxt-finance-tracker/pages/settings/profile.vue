<template>
  <UForm :state="state" :schema="schema" @submit="saveProfile">
    <!-- *궁금했던 점: 왜 @submit.prevent가 아니고 @submit인가 => UForm에서는 기본적으로 e.preventDefault()가 포함되어 있어서 자동으로 새로고침을 막아줌! -->
    <UFormGroup class="mb-4" label="Full Name" name="name">
      <UInput v-model="state.name" />
    </UFormGroup>
    <UFormGroup
      class="mb-4"
      label="Email"
      name="email"
      help="You will receive a confirmation email on both the old and the new addresses if you modify the email address"
    >
      <UInput type="email" v-model="state.email" />
    </UFormGroup>
    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="pending"
      :disabled="pending"
    />
  </UForm>
</template>

<script setup>
import { z } from "zod";

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { toastSuccess, toastError } = useAppToast();
const pending = ref(false);

const state = ref({
  name: user.value.user_metadata?.full_name,
  email: user.value.email,
});

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
});

const saveProfile = async () => {
  pending.value = true;

  try {
    const data = {
      data: {
        full_name: state.value.name,
      },
    };

    if (state.value.email !== user.value.email) {
      data.email = state.value.email;
    }
    console.log(data);

    const { error } = await supabase.auth.updateUser(data);

    if (error) throw error;

    toastSuccess({
      title: "Profile updated",
      description: "Your profile has been updated.",
    });
  } catch (err) {
    toastError({
      title: "Failed updating Profile",
      description: err.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>
