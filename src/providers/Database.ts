import mongoose from "mongoose";
require("dotenv").config();

export class Database {
    private static database: Database | null = null;

    private constructor(private mongo: mongoose.Mongoose) {
    }

    static async getInstance() {
        if (Database.database === null) {
            const moongose = await mongoose.connect(process.env.MONGO_SRV as string);
            Database.database = new Database(moongose);
        }
        return Database.database;
    }

    static async model(name: string, schema?: mongoose.Schema<any, any, any, {}>) {
        return (await Database.getInstance()).instance.model(name, schema);
    }

    get instance() {
        return this.mongo;
    }
}