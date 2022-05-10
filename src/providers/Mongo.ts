import {Curp, GovernmentScrapperCache, Mexican, Provider} from "get-mexican-data-by-curp";
import {Schema} from 'mongoose';
import {Database} from "./Database";

const mexicanSchema = new Schema();
mexicanSchema.add({
    curp: {
        type: String,
        index: true
    },
    fatherName: {
        type: String
    },
    motherName: {
        type: String,
    },
    name: String,
    gender: {
        type: String
    },
    birthday: {
        type: String
    },
    birthState: {
        type: String
    },
    statusCurp: {
        type: String
    },
    pdf: {
        type: String
    },
    nationality: {
        type: String
    },
    probatoryDocument: String,
    probatoryDocumentData: Object
});

export class Mongo extends Provider implements GovernmentScrapperCache {
    async provide(curp: Curp): Promise<Mexican | { error: string } | null> {
        const MexicanModel = await Database.model('Mexican', mexicanSchema);
        return await MexicanModel.findOne({
            curp
        }).exec();
    }

    async save(mexican: any): Promise<any> {
        const MexicanModel = await Database.model('Mexican', mexicanSchema);
        const model = new MexicanModel(mexican);
        await model.save();
    }
}