<template>
  <article
    class="prose dark:prose-invert max-w-none prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-gray-600 dark:prose-pre:text-gray-200"
  >
    <!-- tailwind 적용시 모든 스타일이 무효화되는 점으로 인해 markdown 서식도 무효화되는 경우, @tailwindcss/typography를 이용하여 해당 부분만 css reset을 하지 않음 -->
    <ContentDoc>
      <template #not-found>
        <h1>Document not found (404)</h1>
        <p>This blog post could not be found.</p>
      </template>
      <template v-slot="{ doc }">
        <div class="grid grid-cols-6 gap-16">
          <div :class="{ 'col-span-4': doc.toc, 'col-span-6': !doc.toc }">
            <ContentRenderer :value="doc" />
          </div>
          <div class="col-span-2 not-prose" v-if="doc.toc">
            <aside class="sticky top-8">
              <div class="font-semibold mb-2">Table of Contents</div>
              <nav>
                <TocLinks :links="doc.body.toc.links" :active-id="activeId" />
              </nav>
            </aside>
          </div>
        </div>
      </template>
    </ContentDoc>
  </article>
</template>

<script setup>
const activeId = ref(null);
const observer = ref(null);

// 여기서 onMounted를 쓰는 이유는, headers(h2, h3 등)가 Dom에 먼저 들어가 있어야 하기 때문
// client side에서만 실행되므로, 브라우저 전역 객체(window, document 등)를 사용할 수 있게 된다. -> Browser API인 intersectionObserver도 사용 가능한 것.
onMounted(() => {
  const callback = (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id;
        console.log(entry.target.id, activeId.value);
        break;
      }
    }
  };
  observer.value = new IntersectionObserver(callback, {
    root: null, // =document
    threshold: 0.5,
  });
  const elements = document.querySelectorAll("h2, h3");

  for (const element of elements) {
    observer.value.observe(element);
  }
});

onBeforeUnmount(() => {
  if (observer.value instanceof IntersectionObserver) {
    observer.value.disconnect();
  }
});
</script>
