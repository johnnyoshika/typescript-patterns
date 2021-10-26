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

// Factory
function createDatabase<T extends BaseRecord>() {
  class InMemoryDatabase implements Database<T> {
    private data: Record<string, T> = {};

    set(newValue: T): void {
      this.data[newValue.id] = newValue;
    }

    get(id: string): T | undefined {
      return this.data[id];
    }
  }

  return InMemoryDatabase;
}

const CarDB = createDatabase<Car>();
const carDB = new CarDB();

carDB.set({
  id: '1',
  model: 'Ford',
  maxSpeed: 200,
});

console.log(carDB.get('1'));
