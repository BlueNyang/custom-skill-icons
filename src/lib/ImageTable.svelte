<script lang="ts">
    import { onMount } from 'svelte';
    import { derived, writable, type Writable} from 'svelte/store'

    interface ImageGroup {
        name : string;
        dark? : string;
        light? : string;
        only? : string;
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

    const iconModules = import.meta.glob('/icons/*.svg', {
        as: 'url',
        eager: true
    })

    function groupIcons(paths: Record<string, string>) : ImageGroup[] {
        const groupsMap = new Map<string, ImageGroup>();

        for(const fullPath in paths) {
            const pathUrl = paths[fullPath];
            const fileName = fullPath.split('/').pop()?.replace('.svg', '') || '';
            if(!fileName) continue;

            let name = fileName
            let variant: 'Dark' | 'Light' | 'none' = 'none';

            if(fileName.endsWith('-Dark')) {
                name = fileName.replace('-Dark', '');
                variant = 'Dark';
            } else if(fileName.endsWith('-Light')) {
                name = fileName.replace('-Light', '');
                variant = 'Light';
            }
            
            const group: ImageGroup = groupsMap.get(name) || { name };

           if(variant === 'Dark') {
                group.dark = pathUrl;
                delete group.only;
            } else if(variant === 'Light') {
                group.light = pathUrl;
                delete group.only;
            } else {
                group.only = pathUrl;
            }

            groupsMap.set(name, group);
        }
        return Array.from(groupsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }

    onMount(() => {
        iconGroups.set(groupIcons(iconModules));
        isLoading = false;
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

        <div class="divide-y divide-gray-200">
            {#each $filteredGroups as group (group.name)}
                <div class="grid grid-cols-3 items-center py-3 hover:bg-gray-50">
                    <div class="px-4 pl-6 font-medium text-gray-800 truncate">{group.name}</div>

                    {#if group.only}
                        <div class="col-span-2 text-center px-2 border-l border-gray-300">
                            <img 
                                src={group.only} 
                                alt="{group.name} Only" 
                                class="w-10 h-10 mx-auto" 
                            />
                        </div>
          
                    {:else}
                        <div class="px-4 text-center border-l border-gray-300">
                            {#if group.dark}
                                <img src={group.dark} alt="{group.name} Dark" class="w-10 h-10 mx-auto" />
                            {:else}
                                <span class="text-red-500 text-xs">N/A</span>
                            {/if}
                        </div>

                        <div class="px-4 text-center border-l border-gray-300">
                            {#if group.light}
                                <img src={group.light} alt="{group.name} Light" class="w-10 h-10 mx-auto" />
                            {:else}
                                <span class="text-red-500 text-xs">N/A</span>
                            {/if}
                        </div>
            
                    {/if}
                </div>
        
            {/each}
        </div>
    {/if}
  {/if}
</div>