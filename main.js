// main.js

import { races } from './races.js';
import { rooms } from './rooms.js';
import { items } from './items.js';
import { readBook, useKey } from './use.js';
import { displayWelcomeMessage } from './utils.js';
import {
  EntityManager,
  PositionComponent,
  InventoryComponent,
  StatsComponent,
} from './ecs.js';

export var currentRoom = 'start';
var discoveredRooms = [currentRoom];

export const entityManager = new EntityManager();

export function generateRace() {
    var randomIndex = Math.floor(Math.random() * races.length);
    return races[randomIndex];
}

export var playerRace = generateRace();
export var playerStats = playerRace[2];

export const playerId = entityManager.createEntity();
entityManager.addComponent(playerId, new PositionComponent(25, 50)); // Initial position
entityManager.addComponent(playerId, new InventoryComponent());
entityManager.addComponent(playerId, new StatsComponent(...Object.values(playerStats)));

window.sendCommand = function (event) {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  var input = document.getElementById('input');
  var output = document.getElementById('output');
  var command = input.value.toLowerCase(); // Convert command to lowercase
  input.value = '';

  // Check if the command starts with 'pick up'
  if (command.startsWith('pick up ')) {
    var item = command.slice(8); // Get the item name
    var itemId = Object.keys(items).find(id => items[id].name.toLowerCase() === item.toLowerCase());
    var itemIdNumber = Number(itemId);

    if (itemId && rooms[currentRoom].items.includes(itemIdNumber)) {
      const inventoryComponent = entityManager.getComponent(playerId, 'InventoryComponent');
      inventoryComponent.addItem(itemIdNumber);
      rooms[currentRoom].items.splice(rooms[currentRoom].items.indexOf(itemIdNumber), 1);
      output.value += 'Picked up ' + items[itemId].name + '.\n';
    } else {
      output.value += 'No such item here.\n';
    }
  }
  // Check if the command starts with 'drop'
  else if (command.startsWith('drop ')) {
    var item = command.slice(5); // Get the item name
    var itemId = Object.keys(items).find(id => items[id].name.toLowerCase() === item.toLowerCase());
    var itemIdNumber = Number(itemId);

    if (itemId) {
      const inventoryComponent = entityManager.getComponent(playerId, 'InventoryComponent');
      if (inventoryComponent.items.includes(itemIdNumber)) {
        inventoryComponent.removeItem(itemIdNumber);
        rooms[currentRoom].items.push(itemIdNumber);
        output.value += 'Dropped ' + items[itemId].name + '.\n';
      } else {
        output.value += 'You do not have that item.\n';
      }
    }
  }
  // Handle movement commands
  else if (command in rooms[currentRoom].exits) {
    const nextRoom = rooms[currentRoom].exits[command];
    const positionComponent = entityManager.getComponent(playerId, 'PositionComponent');
    positionComponent.x = rooms[nextRoom].coordinates.x;
    positionComponent.y = rooms[nextRoom].coordinates.y;
    currentRoom = nextRoom;
    if (!discoveredRooms.includes(currentRoom)) {
      discoveredRooms.push(currentRoom);
    }
    output.value += rooms[currentRoom].description + '\n';
    listItemsInRoom(); // List items in the new room
  }
  // Check if the command starts with 'read'
  else if (command.startsWith('read ')) {
    var bookName = command.slice(5); // Get the book name
    var bookId = Object.keys(items).find(id => items[id].name.toLowerCase() === bookName.toLowerCase());
    if (bookId) {
      readBook(Number(bookId));
    } else {
      output.value += 'There is no book with that name.\n';
    }
  }
  // Check if the command starts with 'use'
  else if (command.startsWith('use ')) {
    var itemName = command.slice(4); // Get the item name
    var itemId = Object.keys(items).find(id => items[id].name.toLowerCase() === itemName.toLowerCase());
    if (itemId) {
      useKey(Number(itemId));
    } else {
      output.value += 'You do not have that item.\n';
    }
  } else {
    output.value += 'Invalid command.\n';
  }

  // Display possible commands
  output.value += 'Possible commands: ' + Object.keys(rooms[currentRoom].exits).join(', ') + ', pick up [item], drop [item]\n';
  updateMinimap();

  // Scroll to the bottom of the output element
  output.scrollTop = output.scrollHeight;
}

// New function to list items in the current room
export function listItemsInRoom() {
  var output = document.getElementById('output');
  var roomItems = rooms[currentRoom].items;
  if (roomItems.length > 0) {
    output.value += 'Items in this room:\n';
    roomItems.forEach(function (itemId) {
      output.value += '- ' + items[itemId].name + ': ' + items[itemId].description + '\n';
    });
  } else {
    output.value += 'No items to pick up in this room.\n';
  }
}

window.onload = function () {
  displayWelcomeMessage();
  updateMinimap();
};

export function updateMinimap() {
    var minimap = document.getElementById('minimap');
    var ctx = minimap.getContext('2d');
    ctx.clearRect(0, 0, minimap.width, minimap.height);

    // Draw lines between all discovered rooms
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    for (var i = 0; i < discoveredRooms.length; i++) {
        var room = discoveredRooms[i];
        var coordinates = rooms[room].coordinates;
        for (var exit in rooms[room].exits) {
            if (rooms[room].exits.hasOwnProperty(exit)) {
                var neighbor = rooms[room].exits[exit];
                if (discoveredRooms.includes(neighbor)) {
                    var neighborCoordinates = rooms[neighbor].coordinates;
                    ctx.moveTo(coordinates.x + 5, coordinates.y + 5);
                    ctx.lineTo(neighborCoordinates.x + 5, neighborCoordinates.y + 5);
                }
            }
        }
    }
    ctx.stroke();

    // Draw neighboring rooms in grey
    for (var exit in rooms[currentRoom].exits) {
        if (rooms[currentRoom].exits.hasOwnProperty(exit)) {
            var neighbor = rooms[currentRoom].exits[exit];
            var coordinates = rooms[neighbor].coordinates;
            ctx.fillStyle = 'grey';
            ctx.fillRect(coordinates.x, coordinates.y, 10, 10);
        }
    }

    // Overwrite visited rooms in blue
    discoveredRooms.forEach(function(room) {
        if (room !== currentRoom) {
            var coordinates = rooms[room].coordinates;
            ctx.fillStyle = 'blue';
            ctx.fillRect(coordinates.x, coordinates.y, 10, 10);
        }
    });

    // Draw current room in red
    var coordinates = rooms[currentRoom].coordinates;
    ctx.fillStyle = 'red';
    ctx.fillRect(coordinates.x, coordinates.y, 10, 10);
}

// Call updateMinimap on startup to display the starting room
updateMinimap();
