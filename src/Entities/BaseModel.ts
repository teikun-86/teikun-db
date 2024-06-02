import { Attributes } from "../types/Attribute.js";
import QueryBuilderExtension from "./QueryBuilderExtension.js";

export default abstract class BaseModel extends QueryBuilderExtension {
    protected tableName!: string;
    constructor(attributes?: Attributes) {
        super();
        if (attributes) {
            this.setAttributes(attributes);
        }
    }
}