import { Attributes } from "../types/Attribute.js";
import BaseModel from "./BaseModel.js";

export default class Model extends BaseModel {
    constructor(attributes?: Attributes) {
        super(attributes)
    }
}