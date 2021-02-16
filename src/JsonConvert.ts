import 'reflect-metadata';

export function jsonProperty(propertyName: string): (obj: Object, key: string) => void;
export function jsonProperty(
  propertyName: string,
  type: Object,
): (obj: Object, key: string) => void;
export function jsonProperty(
  propertyName: string,
  type: [Object],
): (obj: Object, key: string) => void;
export function jsonProperty(propertyName: string, type?: any) {
  return (obj: Object, key: string) => {
    Reflect.defineMetadata(key, { propertyName, type }, obj.constructor);
  };
}

class JsonConvert {
  public static serialize(obj: Object): string {
    return JSON.stringify(JsonConvert.serializeObject(obj));
  }

  public static deserialize(): (text: string) => Object;
  public static deserialize<T>(ReturnType: new () => T): (text: string) => T;
  public static deserialize<T>(ReturnType: [new () => T]): (text: string) => T[];
  public static deserialize(ReturnType?: any) {
    return (text: string) => {
      return JsonConvert.deserializeObject(ReturnType)(JSON.parse(text));
    };
  }

  private static serializeObject(obj: Object) {
    const jObject = Reflect.getMetadataKeys(obj.constructor).reduce<{ [key: string]: any }>(
      (acc, key) => {
        const { propertyName } = Reflect.getMetadata(key, obj.constructor);
        let value = Reflect.get(obj, key);
        if (Array.isArray(value)) {
          value = value.map(JsonConvert.serializeObject);
        } else if (typeof value === 'object') {
          value = JsonConvert.serializeObject(value);
        }

        return { ...acc, [propertyName]: value };
      },
      {},
    );

    return jObject;
  }

  private static deserializeObject(): (jObject: Object) => Object;
  private static deserializeObject<T>(ReturnType: new () => T): (jObject: Object) => T;
  private static deserializeObject<T>(ReturnType: [new () => T]): (jObject: Object) => T[];
  private static deserializeObject(ReturnType?: any) {
    return (jObject: Object) => {
      if (!ReturnType) {
        return jObject;
      }

      if (Array.isArray(ReturnType)) {
        const ArrayType = ReturnType[0];

        if (Array.isArray(jObject)) {
          return jObject.map(JsonConvert.deserializeObject(ArrayType));
        }

        return [];
      }

      const obj = new ReturnType();

      const keys = Reflect.getMetadataKeys(obj.constructor);
      for (const key of keys) {
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
