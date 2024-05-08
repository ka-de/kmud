// utils.js

import { currentRoom, playerRace, playerStats, updateMinimap } from './main.js';
import { rooms } from './rooms.js';

export function displayWelcomeMessage() {
  var output = document.getElementById('output');
  output.value += 'Welcome to KMUD!\n\n';
  output.value += 'You are a ' + playerRace[1] + '.\n';
  output.value += 'Your stats are: Stamina ' + playerStats['Stamina'] + ', Intellect ' + playerStats['Intellect'] + ', Agility ' + playerStats['Agility'] + ', Strength ' + playerStats['Strength'] + '.\n';
  output.value += rooms[currentRoom].description + '\n';
  output.value += 'Possible commands: ' + Object.keys(rooms[currentRoom].exits).join(', ') + '\n';
  updateMinimap();
}
