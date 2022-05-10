import {Curp, GovernmentScrapperCache, Mexican, Provider} from "get-mexican-data-by-curp";


export class Mongo extends Provider implements GovernmentScrapperCache{
    private readonly MONGO_USER: string = process.env.MONGO_USER as string;

    provide(curp: Curp): Promise<Mexican | { error: string } | null> {
        console.log(this.MONGO_USER);
        return Promise.resolve(null);
    }

    save(mexican: Mexican|{error: string}): Promise<any> {
        return Promise.resolve(undefined);
    }
}