import traverse from 'traverse';
import hash from 'object-hash';

type Process<T> = (obj: T) => void;

export function buildProcess<T>(processes: Array<Process<T>>) {
    return (jsonLd): void => {
        traverse(jsonLd).forEach(function(obj) {
            processes.forEach(process => process.call(this, [obj]));
        });
    };
}

export function addMissingIds(obj: any): void {
    // Presentation 3 has only one optional.
    // But then again, some common missing ids...
    if (
        (obj.type === 'AnnotationPage' ||
            obj.type === 'Annotation' ||
            obj.type === 'Application' ||
            obj.type === 'Dataset' ||
            obj.type === 'Image' ||
            obj.type === 'Sound' ||
            obj.type === 'Text' ||
            obj.type === 'Video' ||
            obj.type === 'TextualBody' ||
            obj.profile) &&
        !obj.id
    ) {
        this.update({...obj, id: `https://hyperion/${hash(obj)}`});
    }
}
