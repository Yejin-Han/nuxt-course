<template>
  <article
    class="prose dark:prose-invert max-w-none prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-gray-600 dark:prose-pre:text-gray-200"
  >
    <!-- tailwind 적용시 모든 스타일이 무효화되는 점으로 인해 markdown 서식도 무효화되는 경우, @tailwindcss/typography를 이용하여 해당 부분만 css reset을 하지 않음 -->
    <ContentDoc v-slot="{ doc }">
      {{ doc.body.toc.links }}
      <div class="grid grid-cols-6 gap-16">
        <div :class="{ 'col-span-4': doc.toc, 'col-span-6': !doc.toc }">
          <ContentRenderer :value="doc" />
        </div>
        <div class="col-span-2 not-prose" v-if="doc.toc">
          <aside class="sticky top-8">
            <div class="font-semibold mb-2">Table of Contents</div>
            <nav>
              <TocLinks :links="doc.body.toc.links" />
            </nav>
          </aside>
        </div>
      </div>
    </ContentDoc>
  </article>
</template>

<script setup>
const route = useRoute();
console.log(route.params.slug);
</script>
