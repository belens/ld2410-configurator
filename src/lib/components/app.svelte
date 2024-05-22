<script lang="ts">
  import {
    createSerialReadStore,
    type SerialStore,
  } from "$lib/stores/serialRead";
  import { createBluetoothReadStore } from "$lib/stores/bluetoothRead";
  import Configurator from "./configurator.svelte";
  import ConnectionScreen from "./connectionScreen.svelte";

  let serialReadStore: SerialStore | null = null;
  let bluetoothReadStore: SerialStore | null = null;

  const openPort = async (baudRate: number) => {
    const port = await navigator.serial.requestPort();
    serialReadStore = createSerialReadStore(port, baudRate);
    await serialReadStore.connect();
    serialReadStore.subscribe(handleNotification);
  };

  const openBluetooth = async () => {
    console.log("openBluetooth");

    try {
      const device = await (
        navigator as Navigator & { bluetooth: any }
      ).bluetooth.requestDevice({
        filters: [
          {
            name: "HLK-LD2410_6F1F", // TODO: make this configurable
          },
        ],
        optionalServices: [0xfff0, 0xae00],
      });
      console.log("Connected to ", device.name);
      const server = await device.gatt.connect();

      bluetoothReadStore = createBluetoothReadStore(server);
      await bluetoothReadStore.connect();
      bluetoothReadStore.subscribe(handleNotification);
    } catch (error) {
      console.error("Argh! " + error);
    }
  };

  const handleNotification = (event) => {
    if (event.eventType === "DISCONNECT") {
      // serialReadStore = null; // to avoid the page dissapearing
    }

    console.log(event.eventType, [event.payload]);
  };
</script>

{#if serialReadStore != null}
  <Configurator serialStore={serialReadStore} />
{:else if bluetoothReadStore != null}
  <Configurator serialStore={bluetoothReadStore} />
{:else}
  <ConnectionScreen {openPort} {openBluetooth} />
{/if}
