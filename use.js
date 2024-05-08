// use.js

import { currentRoom, entityManager, playerId, updateMinimap } from './main.js';
import { items } from './items.js';
import { rooms } from './rooms.js';

export function readBook(itemId) {
  var output = document.getElementById('output');
  const inventoryComponent = entityManager.getComponent(playerId, 'InventoryComponent');
  if (inventoryComponent.items.includes(itemId)) {
    output.value += 'You read ' + items[itemId].name + ':\n';
    output.value += items[itemId].description + '\n';
  } else {
    output.value += 'You do not have that book.\n';
  }
}

export function useKey(itemId) {
  var output = document.getElementById('output');
  const inventoryComponent = entityManager.getComponent(playerId, 'InventoryComponent');
  if (inventoryComponent.items.includes(itemId)) {
    if (currentRoom === 'locked_room') {
      output.value += 'You use the key to unlock the door.\n';
      rooms['locked_room'].description = 'The door you unlocked earlier is open now.';
      rooms['locked_room'].exits = { 'west': 'hall', 'east': 'end' }; // Add the 'east' exit after unlocking
      updateMinimap();
    } else {
      output.value += 'There is nothing to use the key on here.\n';
    }
  } else {
    output.value += 'You do not have a key.\n';
  }
}