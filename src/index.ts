import {Collection} from './types/resources/collection';

const collection: Collection = {
    id: 'http://...',
    type: 'Collection',
    label: {en: ['testing']},
    items: [
        {
            id: 'http://...',
            type: 'Manifest',
            label: {en: ['my manifest']},
            items: [
                {
                    id: 'http://...',
                    type: 'Canvas',
                    label: {en: ['my canvas']},
                },
            ],
        },
    ],
};

console.log(collection);
