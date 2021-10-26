interface Car {
  id: string;
  model: string;
  maxSpeed: number;
}

interface BaseRecord {
  id: string;
}

interface Database<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;
}

class InMemoryDatabase<T extends BaseRecord> implements Database<T> {
  private data: Record<string, T> = {};

  set(newValue: T): void {
    this.data[newValue.id] = newValue;
  }

  get(id: string): T | undefined {
    return this.data[id];
  }
}

const carDB = new InMemoryDatabase<Car>();
carDB.set({
  id: '1',
  model: 'Ford',
  maxSpeed: 200,
});

console.log(carDB.get('1'));
