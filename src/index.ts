// Observer
type Listener<T> = (ev: T) => void;
function createObserver<T>(): {
  subscribe: (listener: Listener<T>) => () => void;
  publish: (event: T) => void;
} {
  let listeners: Listener<T>[] = [];

  return {
    subscribe: (listener: Listener<T>) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(l => l !== listener);
      };
    },
    publish: (event: T) => {
      listeners.forEach(listener => listener(event));
    },
  };
}

interface BeforeSetEvent<T> {
  value: T;
  newValue: T;
}

interface AfterSetEvent<T> {
  value: T;
}

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

  onBeforeSet(listener: Listener<BeforeSetEvent<T>>): () => void;
  onAfterSet(listener: Listener<AfterSetEvent<T>>): () => void;
}

// Factory
function createDatabase<T extends BaseRecord>() {
  class InMemoryDatabase implements Database<T> {
    // Singleton
    static instance: InMemoryDatabase = new InMemoryDatabase();

    private constructor() {}

    private data: Record<string, T> = {};

    private beforeAddListeners = createObserver<BeforeSetEvent<T>>();
    private afterAddListeners = createObserver<AfterSetEvent<T>>();

    set(newValue: T): void {
      this.beforeAddListeners.publish({
        newValue,
        value: this.data[newValue.id],
      });

      this.data[newValue.id] = newValue;

      this.afterAddListeners.publish({
        value: newValue,
      });
    }

    get(id: string): T | undefined {
      return this.data[id];
    }

    onBeforeSet(listener: Listener<BeforeSetEvent<T>>): () => void {
      return this.beforeAddListeners.subscribe(listener);
    }
    onAfterSet(listener: Listener<AfterSetEvent<T>>): () => void {
      return this.afterAddListeners.subscribe(listener);
    }
  }

  return InMemoryDatabase;
}

const CarDB = createDatabase<Car>();

const unsubscribe = CarDB.instance.onAfterSet(({ value }) => {
  console.log('After Set', value);
});

CarDB.instance.set({
  id: '1',
  model: 'Ford',
  maxSpeed: 200,
});

CarDB.instance.set({
  id: '2',
  model: 'Toyota',
  maxSpeed: 100,
});

CarDB.instance.set({
  id: '2',
  model: 'Toyota',
  maxSpeed: 110,
});

unsubscribe();

CarDB.instance.set({
  id: '2',
  model: 'Toyota',
  maxSpeed: 120,
});
