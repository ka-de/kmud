// rooms.js

export var rooms = {
    'start': {
        'description': 'You are in a small room. There is a door to the north.',
        'exits': { 'north': 'hall' },
        'items': [],
        'coordinates': { 'x': 25, 'y': 50 }
    },
    'hall': {
        'description': 'You are in a long hallway. There is a door to the south, and the hallway continues to the east and west.',
        'exits': { 'west': 'library', 'east': 'locked_room', 'south': 'start' },
        'items': [120],
        'coordinates': { 'x': 25, 'y': 25 }
    },
    'library': {
        'description': 'You are in a library. There are many books here.',
        'exits': { 'east': 'hall' },
        'items': [400, 401, 402],
        'coordinates': { 'x': 0, 'y': 25 }
    },
    'locked_room': {
        'description': 'You find a locked room. The door seems sturdy and impossible to break down.',
        'exits': { 'west': 'hall' },
        'items': [],
        'coordinates': { 'x': 50, 'y': 25 }
    },
    'end': {
        'description': 'You have found the end of the game. Congratulations!',
        'exits': { 'west': 'locked_room' },
        'items': [],
        'coordinates': { 'x': 75, 'y': 25 }
    }
};
