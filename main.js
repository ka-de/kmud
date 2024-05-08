// main.js

import { races } from './races.js';
import { rooms } from './rooms.js';
import { items } from './items.js';

var currentRoom = 'start';
var discoveredRooms = [currentRoom];

function generateRace() {
    var randomIndex = Math.floor(Math.random() * races.length);
    return races[randomIndex];
}

var playerRace = generateRace();
var playerStats = playerRace[2];

var player = {
    'race': playerRace,
    'stats': playerStats,
    'inventory': []
};

function readBook(itemId) {
    var output = document.getElementById('output');
    if (player.inventory.includes(itemId)) {
        output.value += 'You read ' + items[itemId].name + ':\n';
        output.value += items[itemId].description + '\n';
    } else {
        output.value += 'You do not have that book.\n';
    }
}

function useKey(itemId) {
    var output = document.getElementById('output');
    if (player.inventory.includes(itemId)) {
        if (currentRoom === 'locked_room') {
            output.value += 'You use the key to unlock the door.\n';
            rooms['locked_room'].description = 'The door you unlocked earlier is open now.';
            updateMinimap();
        } else {
            output.value += 'There is nothing to use the key on here.\n';
        }
    } else {
        output.value += 'You do not have a key.\n';
    }
}

function pickUpItem(itemName) {
    // Find the item ID that corresponds to the item name
    var itemId = Object.keys(items).find(id => items[id].name.toLowerCase() === itemName.toLowerCase());

    // Convert itemId to a number
    var itemIdNumber = Number(itemId);

    if (itemId && rooms[currentRoom].items.includes(itemIdNumber)) {
        player.inventory.push(itemIdNumber);
        rooms[currentRoom].items.splice(rooms[currentRoom].items.indexOf(itemIdNumber), 1);
        output.value += 'Picked up ' + items[itemId].name + '.\n';
    } else {
        output.value += 'No such item here.\n';
    }
}


function dropItem(itemName) {
    // Find the item ID that corresponds to the item name
    var itemId = Object.keys(items).find(id => items[id].name.toLowerCase() === itemName.toLowerCase());

    // Convert itemId to a number
    var itemIdNumber = Number(itemId);

    if (itemId && player.inventory.includes(itemIdNumber)) {
        rooms[currentRoom].items.push(itemIdNumber);
        player.inventory.splice(player.inventory.indexOf(itemIdNumber), 1);
        output.value += 'Dropped ' + items[itemId].name + '.\n';
    } else {
        output.value += 'You do not have that item.\n';
    }
}


window.sendCommand = function(event) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    var input = document.getElementById('input');
    var output = document.getElementById('output');
    var command = input.value.toLowerCase(); // Convert command to lowercase
    input.value = '';

    // Check if the command starts with 'pick up'
    if (command.startsWith('pick up ')) {
        var item = command.slice(8); // Get the item name
        pickUpItem(item);
    } 
    // Check if the command starts with 'drop'
    else if (command.startsWith('drop ')) {
        var item = command.slice(5); // Get the item name
        dropItem(item);
    } 
    // Handle movement commands
    else if (command in rooms[currentRoom].exits) {
        currentRoom = rooms[currentRoom].exits[command];
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
    }
    else {
        output.value += 'Invalid command.\n';
    }


    // Display possible commands
    output.value += 'Possible commands: ' + Object.keys(rooms[currentRoom].exits).join(', ') + ', pick up [item], drop [item]\n';
    updateMinimap();

    // Scroll to the bottom of the output element
    output.scrollTop = output.scrollHeight;
}

// New function to list items in the current room
function listItemsInRoom() {
    var output = document.getElementById('output');
    var roomItems = rooms[currentRoom].items;
    if (roomItems.length > 0) {
        output.value += 'Items in this room:\n';
        roomItems.forEach(function(itemId) {
            output.value += '- ' + items[itemId].name + ': ' + items[itemId].description + '\n';
        });
    } else {
        output.value += 'No items to pick up in this room.\n';
    }
}

function displayWelcomeMessage() {
    var output = document.getElementById('output');
    output.value += 'Welcome to KMUD!\n\n';
    output.value += 'You are a ' + playerRace[1] + '.\n';
    output.value += 'Your stats are: Stamina ' + playerStats['Stamina'] + ', Intellect ' + playerStats['Intellect'] + ', Agility ' + playerStats['Agility'] + ', Strength ' + playerStats['Strength'] + '.\n';
    output.value += rooms[currentRoom].description + '\n';
    output.value += 'Possible commands: ' + Object.keys(rooms[currentRoom].exits).join(', ') + '\n';
    updateMinimap();
}

window.onload = function() {
    displayWelcomeMessage();
    updateMinimap();
};

function updateMinimap() {
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

