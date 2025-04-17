
import type { ShipInfos } from '$lib';
import { onDatabaseChange } from '$lib/server/database';
import { produce } from 'sveltekit-sse';

export function POST() {
  return produce(async function start({ emit }) {
    const sendUpdate = (data: ShipInfos) => {
      emit('message', JSON.stringify(data));
    };

    return onDatabaseChange(sendUpdate);
  })
}

