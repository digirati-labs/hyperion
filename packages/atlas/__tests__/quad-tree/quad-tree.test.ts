import { QuadTree } from '../../src/quad-tree/quad-tree';

describe('quad tree', () => {
  test('simple 1 layer tree', () => {
    const tree = new QuadTree<void>({ x: 0, y: 0, width: 1000, height: 1000 });

    expect(
      tree.intersects({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      })
    ).toEqual(true);

    expect(
      tree.contains({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      })
    ).toEqual(true);

    for (let r = 0; r < 40; r++) {
      for (let c = 0; c < 40; c++) {
        tree.add({
          data: undefined,
          x: r * 25,
          y: c * 25,
          width: 25,
          height: 25,
        });
      }
    }

    const query = tree.query(50, 50, 20, 20);
    expect(tree.divided).toEqual(true);
    // @ts-ignore
    expect(tree.nw.nodes.length).toEqual(0);
    expect(tree.nodes.length).toEqual(0);
    expect(tree.children).toEqual(1600);
    expect(query.length).toEqual(25);

    const intQuery = tree.intersectionQuery(50, 50, 20, 20);
    expect(intQuery.length).toEqual(4);
    expect(intQuery).toEqual([
      { data: undefined, height: 25, width: 25, x: 25, y: 50 },
      { data: undefined, height: 25, width: 25, x: 50, y: 25 },
      { data: undefined, height: 25, width: 25, x: 50, y: 50 },
      { data: undefined, height: 25, width: 25, x: 25, y: 25 },
    ]);
  });
});
