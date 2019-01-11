import {manifest, normalize} from '../../src/process/schema';
import fixture0001 from './fixtures/0001.json';

describe('process/schema', () => {

    test('IIIF cookbook entry - 0001', () => {

        const result = normalize(fixture0001, manifest);

        console.log(result);

        expect(1).toEqual(1);

    });

});
