import {TextualContent} from '../../src/spacial-content';
import {DnaFactory} from '../../src';

describe('textual content', () => {

  test('it constructs', () => {
    const text = new TextualContent({
      id: 'http://example.org/content/c1',
      height: 50,
      width: 300,
      content: '<h1>Some testing content</h1>',
    });

    expect(text.points).toEqual(DnaFactory.singleBox(300, 50));
  });

});
