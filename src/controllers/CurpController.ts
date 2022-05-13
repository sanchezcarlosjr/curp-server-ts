import {Response, Request} from "express"

import {
    Curp, Mexican, GovernmentScrapper, MexicanFinder, CaptchaSolver, Conectame,
} from 'get-mexican-data-by-curp';
import {Firestore} from "../providers/Firestore";
import {Mongo} from "../providers/Mongo";

require("dotenv").config();

const mexicanFinder = new MexicanFinder(new Mongo(), new Firestore(), new Conectame(), new GovernmentScrapper(new CaptchaSolver(process.env.CAPTCHA_KEY as string)));

const findMexicanByCURP = async (request: Request, response: Response) => {
    try {
        const curp = request.query.curp as string;
        const mexican = await mexicanFinder.findByCurp(new Curp(curp));
        if (mexicanFinder.finalState() !== "Mongo") {
            await (new Mongo()).save(mexican as Mexican);
        }
        return response.status(200).jsonp(mexican);
    } catch (error: any) {
        return response.status(500).jsonp({
            'error': error.message
        });
    }
};

export {findMexicanByCURP};
