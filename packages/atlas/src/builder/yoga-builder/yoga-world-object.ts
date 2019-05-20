import { Node, YogaNode, EDGE_ALL } from 'yoga-layout';
import { AbstractObject, AbstractWorldObject } from '../../world-objects';

export class YogaWorldObject {
  node: YogaNode;
  content: AbstractObject;
  object?: AbstractWorldObject;

  constructor(content: AbstractObject) {
    this.content = content;
    this.node = Node.create();
    this.node.setHeightAuto();
    this.node.setWidthPercent(21);
    this.node.setAspectRatio(content.width / content.height);
    this.node.setMarginPercent(EDGE_ALL, 2);
  }

  setWorldObject(worldObject: AbstractWorldObject) {
    this.object = worldObject;
  }

  mutate(func: (node: YogaNode) => void) {
    func(this.node);
    return this;
  }

  recalculate() {
    // const { width, height, left, top } = this.node.getComputedLayout();
    //
    // if (this.object) {
    //   if (this.object.id === 'https://view.nls.uk/iiif/7443/74438561.5/full/full/0/native.jpg') {
    //     console.log({ width, height, left, top });
    //     console.log('translating....', this.object.x - left, this.object.y - top);
    //   }
    //
    //   if (width !== this.object.width) {
    //     // const newScale =  width / this.object.width;
    //     // this.object.atScale(1 / newScale);
    //   }
    //   if (left !== this.object.x || top !== this.object.y) {
    //     this.object.translate(left - this.object.x, top - this.object.y);
    //   }
    // }
  }
}
