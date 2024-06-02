#!/usr/bin/env node

import Model from "../Entities/Model.js";
import { boot } from "../bootstrap.js";
import { performance } from "perf_hooks";

const timestart = performance.now();

boot().then(async () => {
    const timeEnd = performance.now();

    const user = new Model();
    user.setTable("users")

    user.insert("users", {
        name: "udin",
        username: "udinsan",
        email: "udinsan@gmail.com",
    })
    await user.execute();
    
    const user1 = await user.first();
    console.log({user1});
        
    console.log(`[Teikun-db] Execution time: ${(timeEnd - timestart).toFixed(2)}ms`);
    process.exit(0);
})