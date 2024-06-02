import QueryBuilder from "../Builder/QueryBuilder.js";
import { HasAttributes } from "../Traits/HasAttributes.js";

// const QueryBuilderExtension = HasAttributes(QueryBuilder);

class QueryBuilderExtension extends HasAttributes(QueryBuilder) {}

export default QueryBuilderExtension;