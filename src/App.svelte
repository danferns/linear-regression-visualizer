<script lang="ts">
    import GeoApplet, { loadGeoGebra } from "./svelte/geoApplet.svelte";
    import {init} from "./ts/main";

    const plots = {
        line: {
            type: "graphing",
        },
        cost: {
            type: "3d",
        },
        mb: {
            type: "graphing",
        },
    };

    let dimens: {
        [key: string]: {
            width: number;
            height: number;
        };
    } = {
        line: {
            width: 400,
            height: 400,
        },
        cost: {
            width: 400,
            height: 400,
        },
        mb: {
            width: 400,
            height: 400,
        },
    };

    function onLoad(id: string) {
        plots[id].loaded = true;
        for (const key in plots) {
            if (!plots[key]?.loaded) return;
        }
        init();
    }
</script>

<main>
    <div id="plots">
        {#await loadGeoGebra()}
            <div>Loading GeoGebra...</div>
        {:then _}
            {#each Object.entries(plots) as [id, props]}
                <div
                    class="plot"
                    id={id + "-container"}
                    bind:clientHeight={dimens[id].height}
                    bind:clientWidth={dimens[id].width}
                >
                    <GeoApplet
                        {id}
                        bind:width={dimens[id].width}
                        bind:height={dimens[id].height}
                        on:load={(e) => onLoad(e.detail)}
                        {...props}
                    />
                </div>
            {/each}
        {/await}
    </div>
</main>

<style>
    :global(html, body) {
        margin: 0;
        padding: 0;
        height: 100%;
    }
    #plots {
        display: grid;
        grid-template-columns: 50vh calc(100vw - 50vh);
        grid-template-rows: 50vh 50vh;
        grid-template-areas:
            "mb line"
            "cost line";
    }

    #line-container {
        grid-area: line;
    }

    #cost-container {
        grid-area: cost;
    }

    #mb-container {
        grid-area: mb;
    }

    .plot {
        overflow: hidden;
        border: solid 1px black;
    }
</style>
