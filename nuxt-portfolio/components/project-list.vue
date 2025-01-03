<template>
  <div>Projects</div>
  <section v-if="status == 'pending'">Loading...</section>
  <section v-else-if="error">Something went wrong... Try again!</section>
  <section v-else>Here we display the repos!</section>
</template>

<script setup>
const { error, status, data } = await useFetch(
  "https://api.github.com/users/Yejin-Han/repos"
);
</script>
