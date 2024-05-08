// ecs.js

export class EntityManager {
  constructor() {
    this.entities = {};
    this.nextEntityId = 0;
  }

  createEntity() {
    const entityId = this.nextEntityId;
    this.entities[entityId] = {};
    this.nextEntityId++;
    return entityId;
  }

  addComponent(entityId, component) {
    const componentName = component.constructor.name;
    this.entities[entityId][componentName] = component;
  }

  removeComponent(entityId, component) {
    const componentName = component.constructor.name;
    delete this.entities[entityId][componentName];
  }

  getComponent(entityId, componentName) {
    return this.entities[entityId][componentName];
  }
}

export class PositionComponent {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class InventoryComponent {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}

export class StatsComponent {
  constructor(stamina, intellect, agility, strength) {
    this.stamina = stamina;
    this.intellect = intellect;
    this.agility = agility;
    this.strength = strength;
  }
}