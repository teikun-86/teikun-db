import { currentTimestamp as cts } from "../util.js"

const Values = {
    currentTimestamp() {
        return cts();
    }
}

export default Values;