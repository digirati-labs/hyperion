import Ajv, { ValidateFunction } from 'ajv';
import schema from './schemas/presentation-3.json';

const schemaForType = (type: string) => ({
  $id: `http://iiif.io/api/presentation/3/${type}.json`,
  $ref: `schema.json#/classes/${type}`,
});

export class Validator {
  ajv: Ajv.Ajv;
  validators: { [key: string]: ValidateFunction };
  constructor(options: Ajv.Options = {}) {
    this.ajv = new Ajv({
      logger: false,
      schemas: [schema, schemaForType('collection'), schemaForType('manifest'), schemaForType('annotationPage')],
      ...options,
    });
    this.validators = {
      all: this.ajv.getSchema('http://iiif.io/api/presentation/3/schema.json') as ValidateFunction,
      manifest: this.ajv.getSchema('http://iiif.io/api/presentation/3/manifest.json') as ValidateFunction,
      collection: this.ajv.getSchema('http://iiif.io/api/presentation/3/collection.json') as ValidateFunction,
      annotationPage: this.ajv.getSchema('http://iiif.io/api/presentation/3/annotationPage.json') as ValidateFunction,
    };
  }

  validate(data: any) {
    return this.validators.all(data);
  }

  validateManifest(data: any) {
    return this.validators.manifest(data);
  }

  validateCollection(data: any) {
    return this.validators.collection(data);
  }

  validateAnnotationPage(data: any) {
    return this.validators.annotationPage(data);
  }

  validateCustom(type: string, data: any) {
    if (!this.validators[type]) {
      this.ajv.addSchema(schemaForType(type));
      this.validators[type] = this.ajv.getSchema(`http://iiif.io/api/presentation/3/${type}.json`) as ValidateFunction;
    }
    return this.validators[type](data);
  }
}
