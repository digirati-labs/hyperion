import nlsManifest2 from '../../fixtures/presentation-2/nls-manifest-2.json';
import { Vault } from '../../packages/vault/src/Vault';

describe('vault', () => {
  test('nls manifest 2', async () => {
    const httpMocks = {
      ['https://view.nls.uk/iiif/1291/1664/129116649.5/info.json']: {
        '@context': 'http://iiif.io/api/image/2/context.json',
        '@id': 'https://view.nls.uk/iiif/1291/1664/129116649.5',
        protocol: 'http://iiif.io/api/image',
        width: 1349,
        height: 2329,
        tiles: [{ width: 256, height: 256, scaleFactors: [1, 2, 4, 8, 16] }],
        profile: [
          'http://iiif.io/api/image/2/level1.json',
          {
            formats: ['jpg'],
            qualities: ['native', 'color', 'gray'],
            supports: [
              'regionByPct',
              'sizeByForcedWh',
              'sizeByWh',
              'sizeAboveFull',
              'rotationBy90s',
              'mirroring',
              'gray',
            ],
          },
        ],
      },

      ['https://view.nls.uk/iiif/1291/1666/129116661.5/info.json']: {
        '@context': 'http://iiif.io/api/image/2/context.json',
        '@id': 'https://view.nls.uk/iiif/1291/1666/129116661.5',
        protocol: 'http://iiif.io/api/image',
        width: 1349,
        height: 2329,
        tiles: [{ width: 256, height: 256, scaleFactors: [1, 2, 4, 8, 16] }],
        profile: [
          'http://iiif.io/api/image/2/level1.json',
          {
            formats: ['jpg'],
            qualities: ['native', 'color', 'gray'],
            supports: [
              'regionByPct',
              'sizeByForcedWh',
              'sizeByWh',
              'sizeAboveFull',
              'rotationBy90s',
              'mirroring',
              'gray',
            ],
          },
        ],
      },
    };

    // @ts-ignore
    global.fetch = jest.fn(async test => {
      return {
        json() {
          if (!httpMocks[test.toString()]) {
            throw new Error(`missing ${test}`);
          }

          return httpMocks[test.toString()];
        },
      };
    });

    const vault = new Vault();
    const manifest = await vault.loadManifest(nlsManifest2['@id'], nlsManifest2);

    expect(manifest).toMatchInlineSnapshot(`
      Object {
        "@context": "http://iiif.io/api/presentation/3/context.json",
        "accompanyingCanvas": null,
        "annotations": Array [],
        "behavior": Array [
          "paged",
        ],
        "homepage": null,
        "id": "https://view.nls.uk/manifest/1286/9359/128693590/manifest.json",
        "items": Array [
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/1",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/2",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/3",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/4",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/5",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/6",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/7",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/8",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/9",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/10",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/11",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/12",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/13",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/14",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/15",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/16",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/17",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/18",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/19",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/20",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/21",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/22",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/23",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/24",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/25",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/26",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/27",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/28",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/29",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/30",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/31",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/32",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/33",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/34",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/35",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/36",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/37",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/38",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/39",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/40",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/41",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/42",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/43",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/44",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/45",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/46",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/47",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/48",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/49",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/50",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/51",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/52",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/53",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/54",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/55",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/56",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/57",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/58",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/59",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/60",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/61",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/62",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/63",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/64",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/65",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/66",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/67",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/68",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/69",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/70",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/71",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/72",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/73",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/74",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/75",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/76",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/77",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/78",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/79",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/80",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/81",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/82",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/83",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/84",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/85",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/86",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/87",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/88",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/89",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/90",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/91",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/92",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/93",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/94",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/95",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/96",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/97",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/98",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/99",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/100",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/101",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/102",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/103",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/104",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/105",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/106",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/107",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/108",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/109",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/110",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/111",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/112",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/113",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/114",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/115",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/116",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/117",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/118",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/119",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/120",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/121",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/122",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/123",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/124",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/125",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/126",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/127",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/128",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/129",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/130",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/131",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/132",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/133",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/134",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/135",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/136",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/137",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/138",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/139",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/140",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/141",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/142",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/143",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/144",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/145",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/146",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/147",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/148",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/149",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/150",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/151",
            "type": "Canvas",
          },
          Object {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/152",
            "type": "Canvas",
          },
        ],
        "label": Object {
          "none": Array [
            "Robert Burns. [A biography.]",
          ],
        },
        "logo": Array [],
        "metadata": Array [
          Object {
            "label": Object {
              "none": Array [
                "Title",
              ],
            },
            "value": Object {
              "none": Array [
                "Robert Burns. [A biography.]",
              ],
            },
          },
          Object {
            "label": Object {
              "none": Array [
                "Description",
              ],
            },
            "value": Object {},
          },
          Object {
            "label": Object {
              "none": Array [
                "Part reference",
              ],
            },
            "value": Object {
              "none": Array [
                "1933",
              ],
            },
          },
          Object {
            "label": Object {
              "none": Array [
                "Shelfmark",
              ],
            },
            "value": Object {
              "none": Array [
                "R.169.g",
              ],
            },
          },
          Object {
            "label": Object {},
            "value": Object {
              "none": Array [
                "<a href=\\"http://digital.nls.uk/128693590\\">View in our digital gallery</a>",
              ],
            },
          },
          Object {
            "label": Object {
              "none": Array [
                "Full conditions of use",
              ],
            },
            "value": Object {
              "none": Array [
                "You have permission to make copies of this work under the <a target=\\"_top\\" href=\\"http://creativecommons.org/licenses/by/4.0/\\">Creative Commons Attribution 4.0 International Licence</a> unless otherwise stated.",
              ],
            },
          },
        ],
        "motivation": null,
        "navDate": null,
        "partOf": Array [],
        "placeholderCanvas": null,
        "posterCanvas": null,
        "provider": Array [],
        "rendering": Array [],
        "requiredStatement": Object {
          "label": Object {
            "none": Array [
              "Attribution",
            ],
          },
          "value": Object {
            "none": Array [
              "National Library of Scotland<br/>License: <a target=\\"_top\\" href=\\"http://creativecommons.org/licenses/by/4.0/\\">CC BY 4.0</a>",
            ],
          },
        },
        "rights": null,
        "seeAlso": Array [],
        "service": Array [],
        "services": Array [],
        "start": null,
        "structures": Array [],
        "summary": null,
        "thumbnail": Array [],
        "type": "Manifest",
        "viewingDirection": "left-to-right",
      }
    `);

    expect(await vault.getThumbnail(manifest.items[1], {}, true)).toMatchInlineSnapshot(`
      Object {
        "best": Object {
          "height": 256,
          "id": "https://view.nls.uk/iiif/1291/1664/129116649.5/full/256,/0/default.jpg",
          "type": "fixed",
          "unsafe": false,
          "width": 256,
        },
        "fallback": Array [
          Object {
            "height": 2329,
            "id": "https://view.nls.uk/iiif/1291/1664/129116649.5/full/full/0/native.jpg",
            "type": "fixed",
            "unsafe": true,
            "width": 1349,
          },
        ],
        "log": Array [],
      }
    `);
    expect(await vault.getThumbnail(manifest.items[2], {}, true)).toMatchInlineSnapshot(`
      Object {
        "best": Object {
          "height": 256,
          "id": "https://view.nls.uk/iiif/1291/1666/129116661.5/full/256,/0/default.jpg",
          "type": "fixed",
          "unsafe": false,
          "width": 256,
        },
        "fallback": Array [
          Object {
            "height": 2329,
            "id": "https://view.nls.uk/iiif/1291/1666/129116661.5/full/full/0/native.jpg",
            "type": "fixed",
            "unsafe": true,
            "width": 1349,
          },
        ],
        "log": Array [],
      }
    `);
  });
});
