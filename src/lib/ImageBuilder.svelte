<script lang="ts">
  import CopySVG from '../assets/CopySVG.svelte';
  import CopyFillSVG from '../assets/CopyFillSVG.svelte';

  let iconList: string[] = [];
  let copyMouseOver = false;
  let iconTheme: string = 'default';
  let perLine: number = 15;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  $: currentUrl = `/icons?i=${iconList.join(',')}${iconTheme === 'default' ? '' : `&t=${iconTheme}`}${perLine !== 15 ? `&perline=${perLine}` : ''}`;

  function handleIconListChange(event: Event) {
    const target = event.target as HTMLInputElement;
    iconList = target.value.split(',').map(icon => icon.trim()).filter(icon => icon.length > 0);
  }

  function handleThemeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    iconTheme = target.value;
  }

  function handlePerLineChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value);
    if (!isNaN(value) && value >= 1 && value <= 50) {
      perLine = value;
    }
  }
</script>

<div class="p-4 w-full">
  <!-- Request -->
  <div class="mb-4 border border-neutral-300 p-4 rounded-lg bg-neutral-50">
    <p class="font-bold text-center flex w-full justify-center items-center gap-2">
      <span class="text-white bg-blue-500 rounded-lg py-2 px-4">GET</span>
      <span class="bg-neutral-200 rounded-lg py-2 px-4 text-base">
        /icons?i=<span class="text-orange-500">&#123;</span><span class="text-blue-500">iconNames</span><span class="text-orange-500">&#125;</span>&t=<span class="text-orange-500">&#123;</span><span class="text-blue-500">theme</span><span class="text-orange-500">&#125;</span>&perline=<span class="text-orange-500">&#123;</span><span class="text-blue-500">number</span><span class="text-orange-500">&#125;</span>
      </span>
    </p>
  </div>
  <!-- Response -->
  <div class="border mb-4 border-neutral-300 p-4 rounded-lg bg-neutral-50">
    <p class="font-bold text-center">
      {#if iconList.length === 0}
        No icons selected.
      {:else}
        Response Image:
        <img src={API_BASE_URL + currentUrl} alt="Generated Icons" class="mx-auto" />
      {/if}
    </p>
  </div>
  <!-- builder -->
  <div>
    <div class="text-center flex flex-row items-center gap-2 border border-neutral-300 p-4 rounded-lg bg-neutral-50">
      <span class="font-bold">URL: </span>
      <div class="flex flex-row items-center gap-2 flex-1 min-w-0 w-full bg-neutral-300 rounded-lg px-1 justify-between">
        <code class="px-2 py-1 text-lg text-left overflow-x-auto text-nowrap [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-neutral-400 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb:hover]:bg-neutral-500 [&::-webkit-scrollbar-thumb]:rounded-full">
          {currentUrl}
        </code>
        <!-- Copy Button -->
        <button
          on:click={() => {
            navigator.clipboard.writeText(API_BASE_URL + currentUrl);
          }}
          on:mouseenter={() => {
            copyMouseOver = true;
          }}
          on:mouseleave={() => {
            copyMouseOver = false;
          }}
          class="text-white font-bold py-1 px-3 rounded shrink-0"
        >
        {#if copyMouseOver}
          <CopyFillSVG width={20} height={20} color="#555" />
        {:else}
          <CopySVG width={20} height={20} color="#555" />
        {/if}
        </button>
      </div>
    </div>
    <!-- icon list -->
    <div class="mt-4 border border-neutral-300 p-4 rounded-lg bg-neutral-50">
      <label for="iconInput" class="block mb-2 font-bold">Enter icon names (comma-separated):</label>
      <input
        id="iconInput"
        type="text"
        placeholder="e.g., icon1, icon2, icon3"
        on:input={handleIconListChange}
        class="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <!-- Theme Selection -->
    <div class="mt-4 border border-neutral-300 p-4 rounded-lg bg-neutral-50">
      <label for="themeInput" class="block mb-2 font-bold">Enter theme names (comma-separated):</label>
      <select
        id="themeInput"
        class="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        on:change={handleThemeChange}
      >
        <option value="default">default</option>
        <option value="light">light</option>
      </select>
    </div>
    <!-- Per Line (1~50) -->
    <div class="mt-4 border border-neutral-300 p-4 rounded-lg bg-neutral-50">
      <label for="perLineInput" class="block mb-2 font-bold">Icons per line (1~50):</label>
      <input
        id="perLineInput"
        type="number"
        min="1"
        max="50"
        value={perLine}
        on:input={handlePerLineChange}
        class="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
</div>