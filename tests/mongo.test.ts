import {Mongo} from "../src/providers/Mongo";
import {Curp} from "get-mexican-data-by-curp";
import {expect} from "chai";
import {Database} from "../src/providers/Database";
const mexicans = require('./mexicans.json');

describe('Mongo', () => {
    it('should retrieve data', async () => {
        const mongo = new Mongo();
        const mexican = await mongo.provide(new Curp(mexicans[0].curp));
        expect(mexican).to.not.be.null;
        expect(mexican).to.deep.include(mexicans[0]);
    }).timeout(2000);
    it('should retrieve null data', async () => {
        const mongo = new Mongo();
        const mexican = await mongo.provide(new Curp(mexicans[1].curp));
        expect(mexican).to.be.null;
    }).timeout(2000);
    it('should save data', async () => {
        const mongo = new Mongo();
        const curp = new Curp(mexicans[1].curp);
        await mongo.save({
            curp
        });
        const mexican = await mongo.provide(curp);
        expect(mexican).to.not.be.null;
        expect(mexican).to.deep.include(mexicans[1]);
        const MexicanModel = await Database.model('Mexican');
        await MexicanModel.deleteOne({curp}).exec();
    })
});