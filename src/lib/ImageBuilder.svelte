<script lang="ts">
  import CopySVG from '../assets/CopySVG.svelte';
  import CopyFillSVG from '../assets/CopyFillSVG.svelte';

  let iconList: string[] = [];
  let copyMouseOver: boolean = false;
  let iconTheme: string = 'default';
  let perLine: number = 15;

  let apiBaseUrl: string = 'https://custom-skill-icons.netlify.app';

  let currentUrl: string = "/icons?i=";

  function handleIconListChange(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.value.trim() === '') {
      iconList = [];
      currentUrl = "/icons?i=";
      return;
    }

    iconList = target.value.split(',').map(icon => icon.trim()).filter(icon => icon.length > 0);
  }

  function handleThemeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    iconTheme = target.value;
    getResultIconsImage();
  }

  function handlePerLineChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value: number = parseInt(target.value);

    if (!isNaN(value) && value >= 1 && value <= 50) {
      perLine = value;
    }
  }

  function handleServerChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    apiBaseUrl = target.value;
  }

  function getResultIconsImage() {
    currentUrl = `/icons?i=${iconList.join(',')}${iconTheme === 'default' ? '' : `&t=${iconTheme}`}${perLine !== 15 ? `&perline=${perLine}` : ''}`;
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
      {#if iconList.length === 0 || currentUrl === "/icons?i="}
        No icons selected.
      {:else}
        Response Image:
        <img src={apiBaseUrl + currentUrl} alt="Generated Icons" class="mx-auto" />
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
            navigator.clipboard.writeText(apiBaseUrl + currentUrl);
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
      <div class="flex flex-row">
        <input
          id="iconInput"
          type="text"
          placeholder="e.g., icon1, icon2, icon3"
          on:input={handleIconListChange}
          class="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <!-- Check Button -->
        <button
          on:click={getResultIconsImage}
          class="ml-2 bg-black font-bold text-white rounded-lg py-2 px-4"
        >
          Check
        </button>
      </div>
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
      <div class="flex flex-row gap-2 items-center justify-between">
        <input
          id="perLineInput"
          type="number"
          min="1"
          max="50"
          value={perLine}
          on:input={handlePerLineChange}
          class="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <!-- Apply Button -->
        <button
          on:click={getResultIconsImage}
          class="bg-black text-white rounded-lg py-2 px-4 font-bold"
        >
          Apply
        </button>
      </div>
    </div>
    
    <!-- Server Selector -->
    <div class="mt-4 border border-neutral-300 p-4 rounded-lg bg-neutral-50">
      <label for="serverInput" class="block mb-2 font-bold">Select Server:</label>
      <select
        id="serverInput"
        class="w-full p-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        on:change={handleServerChange}
      >
        <option value="https://custom-skill-icons.netlify.app">custom-skill-icons.netlify.app</option>
        <option value="https://skillicons.dev">skillicons.dev</option>
      </select>
    </div>
  </div>
</div>