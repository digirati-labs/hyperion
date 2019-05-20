import { ViewingDirection } from '@hyperion-framework/types';
import {
  Node,
  YogaNode,
  FLEX_DIRECTION_COLUMN,
  FLEX_DIRECTION_COLUMN_REVERSE,
  FLEX_DIRECTION_ROW,
  FLEX_DIRECTION_ROW_REVERSE,
  WRAP_WRAP,
  EDGE_ALL,
  ALIGN_CENTER,
  JUSTIFY_SPACE_BETWEEN,
} from 'yoga-layout';
import { World } from '../../world';
import { AbstractObject } from '../../world-objects';
import { YogaWorldObject } from './yoga-world-object';

export class YogaBuilder {
  world: World;
  objects: YogaWorldObject[];
  worldNode: YogaNode;

  constructor() {
    // Start with a 1000x1000 world, it will be resized.
    this.world = new World(1000, 1000);
    this.worldNode = Node.create();
    this.worldNode.setPadding(EDGE_ALL, 40);
    this.worldNode.setFlexWrap(WRAP_WRAP);
    this.worldNode.setAlignItems(ALIGN_CENTER);
    this.worldNode.setJustifyContent(JUSTIFY_SPACE_BETWEEN);
    this.objects = [];
  }

  setViewingDirection(viewingDirection: ViewingDirection) {
    switch (viewingDirection) {
      case 'left-to-right':
        this.worldNode.setFlexDirection(FLEX_DIRECTION_ROW);
        break;
      case 'right-to-left':
        this.worldNode.setFlexDirection(FLEX_DIRECTION_ROW_REVERSE);
        break;
      case 'top-to-bottom':
        this.worldNode.setFlexDirection(FLEX_DIRECTION_COLUMN);
        break;
      case 'bottom-to-top':
        this.worldNode.setFlexDirection(FLEX_DIRECTION_COLUMN_REVERSE);
        break;
    }
  }

  setFixedDimensions(width: number, height: number) {
    this.worldNode.setHeight(height);
    this.worldNode.setWidth(width);
  }

  addContent(content: AbstractObject[]) {
    const count = content.length;
    const children = this.worldNode.getChildCount();
    for (let i = 0; i < count; i++) {
      const obj = content[i];
      const yogaObj = new YogaWorldObject(obj);
      this.objects.push(yogaObj);
      this.worldNode.insertChild(yogaObj.node, i + children);
    }
    this.worldNode.calculateLayout();
    for (let i = 0; i < count; i++) {
      const obj = this.objects[i + children];
      const { width, height, left, top } = obj.node.getComputedLayout();

      obj.setWorldObject(
        this.world.addObjectAt(obj.content, {
          width,
          height,
          x: left,
          y: top,
        })
      );
    }
  }

  setHeight(height: number) {
    this.worldNode.setHeight(height);
    this.worldNode.setWidthAuto();
  }

  setWidth(width: number) {
    this.worldNode.setWidth(width);
    this.worldNode.setHeightAuto();
  }

  recalculate() {
    this.worldNode.calculateLayout();
    // First we resize the world. Could be optimised.
    const { width, height } = this.worldNode.getComputedLayout();
    this.world.resize(width, height);
    const len = this.objects.length;
    for (let i = 0; i < len; i++) {
      const object = this.objects[i].object;
      const { width: tileWidth, left, top } = this.objects[i].node.getComputedLayout();
      if (object) {
        this.world.translateWorldObject(i, left - object.x, top - object.y);
        if (tileWidth !== object.width) {
          const newScale = tileWidth / object.width;
          this.world.scaleWorldObject(i, newScale);
        }
      }

    }
  }

  getWorld(): World {
    return this.world;
  }
}

// const root = Node.create();
// root.setWidth(500);
// root.setHeight(300);
// root.setJustifyContent(yoga.JUSTIFY_CENTER);
//
// const node1 = Node.create();
// node1.setWidth(100);
// node1.setHeight(100);
//
// const node2 = Node.create();
// node2.setWidth(100);
// node2.setHeight(100);
//
// root.insertChild(node1, 0);
// root.insertChild(node2, 1);
//
// root.calculateLayout(500, 300, yoga.DIRECTION_LTR);
//
// console.log(root.getComputedLayout());
// // {left: 0, top: 0, width: 500, height: 300}
// console.log(node1.getComputedLayout());
// // {left: 150, top: 0, width: 100, height: 100}
// console.log(node2.getComputedLayout());
// // {left: 250, top: 0, width: 100, height: 100}
