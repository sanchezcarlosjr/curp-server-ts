import {Response, Request} from "express"

import {
    Curp, GovernmentScrapper, MexicanFinder, CaptchaSolver, Conectame,
} from 'get-mexican-data-by-curp';
import {Mexican} from "get-mexican-data-by-curp/lib/src/models";
import {Firestore} from "../providers/Firestore";


const mexicanFinder = new MexicanFinder(
    new Firestore(),
    new Conectame(),
    new GovernmentScrapper(new CaptchaSolver(process.env.CAPTCHA_KEY as string))
);

const findMexican = async (request: Request, response: Response) => {
    try {
        const {curp} = request.params;
        const mexican = await mexicanFinder.findByCurp(new Curp(curp));
        if (mexicanFinder.finalState() !== "Firestore") {
            await (new Firestore()).save(mexican as Mexican);
        }
        return response.status(200).jsonp(mexican);
    } catch (error: any) {
        return response.status(500).jsonp({
            'error': error.message
        });
    }
};

export {findMexican};
