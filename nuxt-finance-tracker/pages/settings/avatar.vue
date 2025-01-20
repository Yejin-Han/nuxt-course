<template>
  <div>
    <div class="mb-4">
      <UFormGroup
        label="Current avatar"
        class="w-full"
        help="This would be blank by default"
      >
        <UAvatar
          src="https://avatars.githubusercontent.com/u/739984?v=4"
          size="3xl"
        />
      </UFormGroup>
    </div>
    <div class="mb-4">
      <UFormGroup
        label="New Avatar"
        class="w-full"
        namve="avatar"
        help="After choosing an image click Save to actually upload the new avatar"
      >
        <UInput type="file" ref="fileInput" />
      </UFormGroup>
    </div>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="uploading"
      :disabled="uploading"
      @click="saveAvatar"
    />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toastSuccess, toastError } = useAppToast();

const uploading = ref(false);
const fileInput = ref(); // Input ref="fileInput" 속성의 레퍼런스

const saveAvatar = async () => {
  // 1. Get the uploaded file
  //    a) If no file uploaded, show toast error
  // 2. Generate the new filename
  const file = fileInput.value.input.files[0];
  if (!file) {
    toastError({ title: "Select a file to upload first" });
    return;
  }

  const fileExt = file.name.split(".").pop();
  const randomStr = String(Math.random()).split(".").join(""); // 임의로 좀 더 파일명같이 바꾸기 위해 수정함
  const fileName = `${randomStr}.${fileExt}`;

  try {
    uploading.value = true;

    // 1. Grab the current avatar URL
    const currAvatarUrl = user.value.user_metadata?.avatar_url;

    // 2. Upload the image to avatars bucket
    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (error) throw error;

    // 3. Update the user metadata with the avatar URL
    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName,
      },
    });

    // 4. (OPTIONALLY) Remove the old avatar file
    if (currAvatarUrl) {
      const { error } = await supabase.storage
        .from("avatars")
        .remove([currAvatarUrl]);
      if (error) throw error;
    }

    // 5. Reset the file input

    toastSuccess({
      title: "Avatar uploaded",
    });
  } catch (err) {
    toastError({
      title: "Failed uploading avatar",
      description: err.message,
    });
  } finally {
    uploading.value = false;
  }
};
</script>
