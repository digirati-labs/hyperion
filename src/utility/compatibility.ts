import traverse from 'traverse';
import hash from 'object-hash';

type Process = (obj: any) => void;

export function buildProcess(processes: Process[]) {
  return (jsonLd: any): any => {
    traverse(jsonLd).forEach(function(obj: any) {
      // tslint:disable-next-line:no-invalid-this
      processes.forEach(process => process.call(this, [obj]));
    });
    return jsonLd;
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
    // @ts-ignore
    // tslint:disable-next-line:no-invalid-this
    this.update({ ...obj, id: `https://hyperion/${hash(obj)}` });
  }
}
