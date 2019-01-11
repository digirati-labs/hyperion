import {Collection} from './types/resources/collection';
import {ResourceType} from './types/iiif/technical';

const collection: Collection = {
    id: 'http://...',
    type: ResourceType.Collection,
    label: {en: ['testing']},
    items: [
        {
            id: 'http://...',
            type: ResourceType.Manifest,
            label: {en: ['my manifest']},
            items: [
                {
                    id: 'http://...',
                    type: ResourceType.Canvas,
                    label: {en: ['my canvas']},
                },
            ],
        },
    ],
};

console.log(collection);
