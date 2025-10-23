<script lang="ts">
  import ImageBuilder from './lib/ImageBuilder.svelte'
  import ImageTable from './lib/ImageTable.svelte';
</script>

<main>
  <div class="w-full min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full grid grid-cols-2 gap-8 p-2 bg-white rounded-lg">
      <div class="w-full flex flex-col items-center">
        <ImageTable />
      </div>
      <div class="flex flex-col items-center w-full">
        <ImageBuilder />
      </div>
    </div>
  </div>
</main>
