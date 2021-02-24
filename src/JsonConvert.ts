import 'reflect-metadata';

interface PropertyDecorator {
  (obj: Object, key: string): void;
}

interface Constructor<T> {
  new (): T;
}

interface KeyValueCollection<T> {
  [key: string]: T;
}

function isObject(value: any) {
  return typeof value === 'object' && !Array.isArray(value);
}

function isNullOrUndefined(value: any) {
  return typeof value === 'undefined' || value === null;
}

export function jsonProperty(propertyName: string): PropertyDecorator;
export function jsonProperty(propertyName: string, type: Object): PropertyDecorator;
export function jsonProperty(propertyName: string, type: [Object]): PropertyDecorator;
export function jsonProperty(propertyName: string, type?: any) {
  return (obj: Object, key: string) => {
    Reflect.defineMetadata(key, { propertyName, type }, obj.constructor);
  };
}

class JsonConvert {
  public static serialize(obj: any): string {
    return JSON.stringify(JsonConvert.serializeObject(obj));
  }

  public static deserialize(): (text: string) => any;
  public static deserialize<T>(ReturnType: Constructor<T>): (text: string) => T;
  public static deserialize<T>(ReturnType: [Constructor<T>]): (text: string) => T[];
  public static deserialize(ReturnType?: any) {
    return (text: string) => {
      return JsonConvert.deserializeObject(ReturnType)(JSON.parse(text));
    };
  }

  private static serializeObject(obj: any): any {
    if (isNullOrUndefined(obj)) {
      return null;
    }

    switch (typeof obj) {
      case 'string':
      case 'number':
      case 'boolean':
        return obj;

      default:
        break;
    }

    if (obj instanceof Date) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(JsonConvert.serializeObject);
    }

    const metadataKeys = Reflect.getMetadataKeys(obj.constructor);

    const jObject = metadataKeys.reduce<KeyValueCollection<any>>((collection, key) => {
      const { propertyName, type } = Reflect.getMetadata(key, obj.constructor);

      let value = Reflect.get(obj, key);

      if (Array.isArray(value)) {
        value = value.map(JsonConvert.serializeObject);
      } else if (isObject(value)) {
        switch (type) {
          case Date:
            break;

          default:
            value = JsonConvert.serializeObject(value);
            break;
        }
      }

      collection[propertyName] = value;

      return collection;
    }, {});

    return jObject;
  }

  private static deserializeObject(): (jObject: Object) => Object;
  private static deserializeObject<T>(ReturnType: Constructor<T>): (jObject: Object) => T;
  private static deserializeObject<T>(ReturnType: [Constructor<T>]): (jObject: Object) => T[];
  private static deserializeObject(ReturnType?: any) {
    return (jObject: Object) => {
      if (isNullOrUndefined(ReturnType) || isNullOrUndefined(jObject)) {
        return jObject;
      }

      if (Array.isArray(ReturnType)) {
        const ArrayType = ReturnType[0];

        if (Array.isArray(jObject)) {
          return jObject.map(JsonConvert.deserializeObject(ArrayType));
        }

        return [];
      }

      switch (ReturnType) {
        case Date:
          return new ReturnType(jObject);

        default:
          break;
      }

      const obj = new ReturnType();

      const metadataKeys = Reflect.getMetadataKeys(obj.constructor);
      for (const key of metadataKeys) {
        const { propertyName, type } = Reflect.getMetadata(key, obj.constructor);

        let value = Reflect.get(jObject, propertyName);
        if (type) {
          value = JsonConvert.deserializeObject(type)(value);
        }

        Reflect.set(<Object>obj, key, value);
      }

      return obj;
    };
  }
}

export default JsonConvert;
