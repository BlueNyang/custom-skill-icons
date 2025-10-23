<script lang="ts">
  import { onMount } from 'svelte';
  import { derived, writable, type Writable} from 'svelte/store'
  import testResp from '../test/svgsResp.json';

  interface ImageGroup {
    name : string;
    dark? : HTMLElement;
    light? : HTMLElement;
    only? : HTMLElement;
  }

  export let isLoading: boolean = true;

  const iconGroups: Writable<ImageGroup[]> = writable([]);
  const searchTerm: Writable<string> = writable('');

  const filteredGroups = derived(
    [iconGroups, searchTerm],
    ([$iconGroups, $searchTerm]) => {
      if(!$searchTerm) {
        return $iconGroups;
      }
      const lowerSearch = $searchTerm.toLowerCase();
      return $iconGroups.filter(group => 
        group.name.toLowerCase().includes(lowerSearch)
      );
    }
  );

  function groupIcons(icons: Record<string, string>) : ImageGroup[] {
    const groupsMap = new Map<string, ImageGroup>();

    const parser = new DOMParser();

    for (const icon in icons) {
      const iconSvgTag: string = icons[icon];
      
      let name = icon;
      let variant: 'dark' | 'light' | 'none' = 'none';

      if(icon.endsWith('-dark')) {
        name = icon.replace('-dark', '');
        variant = 'dark';
      } else if(icon.endsWith('-light')) {
        name = icon.replace('-light', '');
        variant = 'light';
      }

      const group: ImageGroup = groupsMap.get(name) || { name };
      const svg = parser.parseFromString(iconSvgTag, "image/svg+xml").documentElement;
      svg.setAttribute('width', '48');
      svg.setAttribute('height', '48');

      if(variant === 'dark') {
        group.dark = svg;
        delete group.only;
      } else if(variant === 'light') {
        group.light = svg;
        delete group.only;
      } else {
        group.only = svg;
      }
      groupsMap.set(name, group);
    }
    return Array.from(groupsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async function fetchIconModules() {
    isLoading = true;
    // console.log('아이콘 목록을 불러오는 중입니다...');
    // const resp = await fetch('');

    // if (!resp.ok) {
    //   console.error('아이콘 목록을 불러오는 중 오류가 발생했습니다.');
    //   isLoading = false;
    //   return;
    // }

    // console.log(resp);

    const iconModules = testResp;

    iconGroups.set(groupIcons(iconModules));
    isLoading = false;
  }

  onMount(() => {
    console.log("hi");
    fetchIconModules();
  });

</script>

<div class="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden">
  
  {#if isLoading}
  <div class="p-8 text-center text-indigo-500 text-xl">아이콘 목록을 불러오는 중입니다...</div>
  {:else}
    <div class="p-4 bg-white border-b border-gray-200">
      <input 
        type="text" 
        placeholder="아이콘 ID 검색" 
        class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        bind:value={$searchTerm}
      >
    </div>

    {#if $filteredGroups.length === 0}
    <div class="p-8 text-center text-red-500 text-xl">표시할 아이콘이 없습니다.</div>
    {:else}
      <header class="grid grid-cols-3 font-semibold text-white bg-gray-700">
        <div class="p-4 pl-6">Icon ID</div>
        <div class="p-4 text-center">Dark</div>
        <div class="p-4 text-center">Light</div>
      </header>

      <div id="icon-list" class="divide-y divide-gray-200">
        {#each $filteredGroups as group (group.name)}
          <div class="grid grid-cols-3 items-center py-3 hover:bg-gray-50">
            <div class="px-4 pl-6 font-medium text-gray-800 truncate">{group.name}</div>

            {#if group.only}
              <div class="col-span-2 text-center px-2 border-l border-gray-300 flex justify-center">
                {@html group.only.outerHTML}
              </div>
            
            {:else if group.dark || group.light}
              <div class="px-4 text-center border-l border-gray-300 flex justify-center">
                {#if group.dark}
                  {@html group.dark.outerHTML}
                {:else}
                  <span class="text-red-500 text-xs">N/A</span>
                {/if}
              </div>

              <div class="px-4 text-center border-l border-gray-300 flex justify-center">
                {#if group.light}
                  {@html group.light.outerHTML}
                {:else}
                  <span class="text-red-500 text-xs">N/A</span>
                {/if}
              </div>
            {:else}
              <div class="col-span-2 text-center px-2 border-l border-gray-300">
                <span class="text-red-500 text-xs">N/A</span>
              </div>
            {/if}
          </div>
        
        {/each}
      </div>
    {/if}
  {/if}
</div>