import { bestResourceAtRatio } from '../src/utils';
import { SingleImage } from '../src/spacial-content';

describe('utils', () => {
  test('bestResourceAtRatio', () => {
    const layer = bestResourceAtRatio(2, [
      SingleImage.fromImage('http://example.org/test-2-big.jpg', { width: 100, height: 100 }),
      SingleImage.fromImage(
        'http://example.org/test-2-smol.jpg',
        { width: 100, height: 100 },
        { width: 50, height: 50 },
      ),
    ]);

    expect(layer.id).toEqual('http://example.org/test-2-smol.jpg');
  });
});
