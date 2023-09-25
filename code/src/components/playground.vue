<script setup lang="ts">
import { createReactiveObject } from '@/utils/reactive/reactive';
import { computed } from '@/utils/reactive/reactive/computed'

const obj = createReactiveObject({ a: 2, b: 1});

const sum = computed(() => obj.a + obj.b);

</script>

<template>
  <div>{{ sum }}</div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
