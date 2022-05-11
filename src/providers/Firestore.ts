import { getFirestore } from 'firebase-admin/firestore';
import { Curp } from 'get-mexican-data-by-curp';
import { Provider } from 'get-mexican-data-by-curp';
import { GovernmentScrapperCache } from 'get-mexican-data-by-curp';
import { Mexican } from 'get-mexican-data-by-curp';

export class Firestore extends Provider implements GovernmentScrapperCache {
    constructor(
        private documentPath: (curpValue: string) => string = curpValue =>
            `id/${curpValue}`
    ) {
        super();
    }
    save(mexican: Mexican): Promise<any> {
        if (mexican === undefined || mexican.curp === undefined) {
            throw new Error('Provider error');
        }
        return getFirestore().collection('id').doc(mexican.curp).set(mexican);
    }
    provide(curp: Curp) {
        return getFirestore()
            .doc(this.documentPath(curp.value))
            .get()
            .then((document: { exists: any; data: () => any }) => {
                if (!document.exists) {
                    return null;
                }
                const data = document.data();
                if (data.error) {
                    return {
                        curp: curp.value,
                        error: data.error,
                    };
                }
                return data;
            });
    }
}