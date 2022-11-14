<script lang="ts" context="module">
    declare global {
        interface Window {
            GGBApplet: any;
        }
    }

    const geoScript = document.createElement("script");
    geoScript.src = "./lib/GeoGebra/deployggb.js";
    document.head.appendChild(geoScript);

    // if it hasn't already, wait until GeoGebra has loaded
    export async function loadGeoGebra() {
        if (window.GGBApplet) return;
        return new Promise<void>((resolve) => {
            geoScript.onload = () => {
                resolve();
            };
        });
    }
</script>

<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";

    export let id = "graph";
    export let width = 400;
    export let height = 400;
    export let type = "graphing";

    const params = {
        id: id,
        appName: type,
        showToolBar: false,
        showAlgebraInput: false,
        showMenuBar: false,
        showResetIcon: false,
        enableUndoRedo: false,
        preventFocus: true,
        appletOnLoad: async (applet: any) => {
            applet.setHeight(height);
            applet.setWidth(width);
            // hide the side panel
            if (type === "graphing") applet.setPerspective("G");
            if (type === "3d") applet.setPerspective("T");
            dispatch("load", id);
        },
    };

    onMount(() => {
        const applet = new window.GGBApplet(params, true);
        applet.setHTML5Codebase("./lib/GeoGebra/HTML5/5.0/web3d/");
        applet.inject(appletElement);
    });

    let appletElement;

    $: {
        if (typeof window[id] === "object") {
            updateDimensions();
        }
        height, width;
    }

    async function updateDimensions() {
        window[id].setHeight(height);
        window[id].setWidth(width);
    }

    const dispatch = createEventDispatcher();
</script>

<div bind:this={appletElement} />

<style>
    div {
        border-radius: 16px;
        overflow: hidden;
        height: auto !important;
        width: auto !important;
    }

    :global(.GeoGebraFrame) {
        border-width: 0px !important;
    }

    :global(.applet_scaler.ggbTransform) {
        transform: scale(1.0) !important;
    }
</style>
