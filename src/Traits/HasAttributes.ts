import { Attributes } from "../types/Attribute.js";

export function HasAttributes<T extends new (...args: any[]) => {}>(Base: T) {
	return class extends Base {
		public _attributes: Attributes = {};

		constructor(...args: any[]) {
			super(...args);
			return new Proxy(this, {
				get: (target, prop, receiver) => {
					if (prop in target) {
						return Reflect.get(target, prop, receiver);
					}
					return target._attributes[prop as keyof Attributes];
				},
				set: (target, prop, value, receiver) => {
					if (prop in target) {
						return Reflect.set(target, prop, value, receiver);
					}
					target._attributes[prop as keyof Attributes] = value;
					return true;
				},
			});
		}

		getAttribute(key: string): any {
			return this._attributes[key];
		}

		setAttribute(key: string, value: any): void {
			this._attributes[key] = value;
		}

		hasAttribute(key: string): boolean {
			return this._attributes.hasOwnProperty(key);
		}

		removeAttribute(key: string): void {
			delete this._attributes[key];
		}

		getAttributes(): Attributes {
			return { ...this._attributes };
		}

		setAttributes(attributes: Attributes): void {
			this._attributes = { ...attributes };
		}
	};
}
