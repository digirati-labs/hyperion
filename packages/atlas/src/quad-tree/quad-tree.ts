import { Projection } from '../types';

export type QuadTreeNode<T> = {
  x: number;
  y: number;
  width: number;
  height: number;
  data: T;
};

const intersects = (a: Projection, b: Projection) => {
  return (
    a.x <= b.width + b.x &&
    // right vs left
    a.x + a.width >= b.x &&
    // top vs bottom
    a.y <= b.y + b.height &&
    // bottom vs top
    a.y + a.height >= b.y
  );
};

export class QuadTree<T> {
  size: number;
  dimensions: Projection;
  divided: boolean = false;
  nw?: QuadTree<T>;
  ne?: QuadTree<T>;
  sw?: QuadTree<T>;
  se?: QuadTree<T>;
  nodes: Array<QuadTreeNode<T>>;
  i = 0;
  children = 0;

  constructor(dimensions: Projection, size: number = 4) {
    this.size = size;
    this.dimensions = dimensions;
    this.nodes = [];
  }

  add(node: QuadTreeNode<T>): boolean {
    if (!this.contains(node)) {
      return false;
    }
    this.children++;
    if (!this.divided && this.nodes.length > this.size) {
      this.divide();
    }
    if (this.divided) {
      const inChild = this.nw!.add(node) || this.ne!.add(node) || this.sw!.add(node) || this.se!.add(node);

      if (inChild) {
        return true;
      }
    }

    this.nodes.push(node);
    return true;
  }

  contains(node: Projection): boolean {
    const { width, height, x, y } = this.dimensions;
    return node.x >= x && node.y >= y && node.x + node.width <= x + width && node.y + node.height <= y + height;
  }

  intersects(node: Projection): boolean {
    return intersects(this.dimensions, node);
  }

  query(x: number, y: number, width: number, height: number): Array<QuadTreeNode<T>> {
    const results: Array<QuadTreeNode<T>> = [];
    if (this.nodes.length > 0) {
      if (this.intersects({ x, y, width, height })) {
        results.push(...this.nodes);
      }
    }
    if (this.divided) {
      results.push(...this.nw!.query(x, y, width, height));
      results.push(...this.ne!.query(x, y, width, height));
      results.push(...this.sw!.query(x, y, width, height));
      results.push(...this.se!.query(x, y, width, height));
    }
    return results;
  }

  intersectionQuery(x: number, y: number, width: number, height: number): Array<QuadTreeNode<T>> {
    const query = { x, y, width, height };
    const candidates = this.query(x, y, width, height);

    const results: Array<QuadTreeNode<T>> = [];
    const len = candidates.length;
    for (let i = 0; i < len; i++) {
      const candidate = candidates[i];
      if (intersects(candidate, query)) {
        results.push(candidate);
      }
    }
    return results;
  }

  private divide() {
    if (this.divided) {
      return;
    }
    this.divided = true;
    const x = this.dimensions.x;
    const y = this.dimensions.y;
    const width = this.dimensions.width / 2;
    const height = this.dimensions.height / 2;
    this.nw = new QuadTree<T>({ x, y, width, height }, this.size);
    this.ne = new QuadTree<T>({ x: x + width, y, width, height }, this.size);
    this.sw = new QuadTree<T>({ x, y: y + height, width, height }, this.size);
    this.se = new QuadTree<T>({ x: x + width, y: y + height, width, height }, this.size);
    const len = this.nodes.length;
    const newNodes = [];
    for (let i = 0; i < len; i++) {
      const node = this.nodes[i];
      const inChild = this.nw.add(node) || this.ne.add(node) || this.sw.add(node) || this.se.add(node);
      if (!inChild) {
        newNodes.push(node);
      }
    }
    this.nodes = newNodes;
  }
}
