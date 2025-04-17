<script lang="ts">
    let {position, title="Position"} = $props()

    let accuracyColor = $derived(() => {
        if (!position) return 'black';
        if (position.accuracy < 1000) return 'green';
        if (position.accuracy < 5000) return 'orange';
        return 'red';
    });
</script>

{#if !position}
    <div class="error">Loading...</div>
{:else}
<div class="mdc-typography--body1">
    <span class="title">{title}</span>
    <span class="mdc-typography--subtitle2">Lat:</span> <span class="number">{position?.latitude ?? 'Loading...'}</span>
    <span class="mdc-typography--subtitle2">Long:</span> <span class="number">{position?.longitude ?? 'Loading...'}</span>
    {#if position?.accuracy}
    <span class="mdc-typography--subtitle2">Accuracy:</span> 
    <span class="accuracy" style="color: {accuracyColor}">
        {position?.accuracy / 1000}
    </span>
    {/if}
</div>
{/if}

<style>
.mdc-typography--subtitle2{
    display: inline-block;
}
.number{
    font-weight: bold;
    color: #3f51b5;
    font-family: monospace;
    width: 100px;
    display: inline-block;
}
.title {
    font-weight: bold;
    color: #3f51b5;
    width: 100px;
    display: inline-block;
}
</style>