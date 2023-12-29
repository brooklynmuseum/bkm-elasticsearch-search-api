import { transform } from '@/lib/primo/transform';
import type { PrimoDocument } from '@/lib/primo/transform';
import type { ElasticsearchDocument } from '@/types';

describe('primo transform', () => {
  it('transforms PrimoDocument to ElasticsearchDocument correctly', () => {
    const primoDocument: PrimoDocument = {
      context: 'L',
      adaptor: 'Local Search Engine',
      '@id': 'https://na01.alma.exlibrisgroup.com/primaws/rest/pub/pnxs/L/991011746099707141',
      pnx: {
        display: {
          source: ['Alma'],
          type: ['artists_books'],
          language: ['eng'],
          title: ['The library '],
          subject: [
            'Schulz, David, 1967-',
            'Fathers and sons',
            'Private libraries',
            'Forests and forestry -- Pictorial works',
          ],
          format: ['112 unnumbered pages : illustrations ; 31 cm'],
          identifier: ['$$COCLC$$V(OCoLC)1101436106'],
          creationdate: ['2019'],
          lds02: [
            'Edition of 100 copies.',
            'Digital offset printed, perfect binding, paper cover.',
            'Brooklyn: Library copy signed by the artist.',
          ],
          creator: ['Schulz, David, 1967- artist.$$QSchulz, David'],
          publisher: ['Walla Walla, Washington : Light Rail Works'],
          description: [
            "\"The Library is a meditation on realization and loss through the practice of reading. After his father's unexpected death, the author searched for him in selected books from his father's library in an attempt to access and preserve his (and his father's) memories and thoughts as well as to give shape to questions about a disturbing past. A fugue-structure assembles photographs of books from his father's library alongside the author's prose-poems which respond to his reading of those books. As photographs of books bear witness to the objects with which the father had physical contact, the texts emanating from those objects imagine representations of his thoughts as he read. Photo-collages of forests represent the visual thoughts of the author as he attempted to read his own father, who was often obscured by the enigmas of despair and anxiety. The multiple voices and narrative perspectives encountered in the books from the library expose a series of formative events within and surrounding the father's life. They also inspire the author to create an imagined history in the resulting prose-poems. The culminating book--a portrait in absentia--creates a parallel reality to his father, one that masks actual memories and obstructs his father's voice as it probes the space between documentation and invention, and between the imperative to understand and the impossibility of knowing.\" --Artist's website, viewed May 13, 2019.",
          ],
          mms: ['991011746099707141'],
          genre: [
            'Pictorial works.',
            "Artists' books 2019.",
            "Artists' books Brooklyn (New York, N.Y.)",
          ],
          place: ['Walla Walla, Washington] :'],
          version: ['1'],
          lds01: [
            'Schulz, David, 1967- http://id.loc.gov/authorities/names/no2018056159 http://viaf.org/viaf/7949152502863310800009',
            'Fathers and sons. http://id.loc.gov/authorities/subjects/sh85047455',
            'Private libraries. http://id.loc.gov/authorities/subjects/sh85076565',
            'Forests and forestry Pictorial works.',
          ],
          lds19: ['(nynyarc)b14510583-01nya_inst', '(OCoLC)1101436106'],
          lds27: ['Includes bibliographical references.'],
          lds34: ['unmediated'],
        },
        control: {
          sourcerecordid: ['991011746099707141'],
          recordid: ['alma991011746099707141'],
          sourceid: 'alma',
          originalsourceid: ['b14510583-01nya_inst'],
          sourcesystem: ['ILS'],
          sourceformat: ['MARC21'],
          score: ['7.2172422'],
          isDedup: false,
        },
        addata: {
          aulast: ['Schulz'],
          aufirst: ['David'],
          auinit: ['D'],
          au: ['Schulz, David'],
          creatorfull: ['$$NSchulz, David$$LSchulz$$FDavid$$Rauthor'],
          date: ['2019 - 2019', '2019'],
          notes: ['Includes bibliographical references.'],
          abstract: [
            "\"The Library is a meditation on realization and loss through the practice of reading. After his father's unexpected death, the author searched for him in selected books from his father's library in an attempt to access and preserve his (and his father's) memories and thoughts as well as to give shape to questions about a disturbing past. A fugue-structure assembles photographs of books from his father's library alongside the author's prose-poems which respond to his reading of those books. As photographs of books bear witness to the objects with which the father had physical contact, the texts emanating from those objects imagine representations of his thoughts as he read. Photo-collages of forests represent the visual thoughts of the author as he attempted to read his own father, who was often obscured by the enigmas of despair and anxiety. The multiple voices and narrative perspectives encountered in the books from the library expose a series of formative events within and surrounding the father's life. They also inspire the author to create an imagined history in the resulting prose-poems. The culminating book--a portrait in absentia--creates a parallel reality to his father, one that masks actual memories and obstructs his father's voice as it probes the space between documentation and invention, and between the imperative to understand and the impossibility of knowing.\" --Artist's website, viewed May 13, 2019.",
          ],
          cop: ['Walla Walla, Washington'],
          pub: ['Light Rail Works'],
          oclcid: ['(ocolc)1101436106'],
          ristype: ['BOOK'],
          btitle: ['The library'],
        },
        sort: {
          title: ['library /'],
          author: ['Schulz, David, 1967- artist.'],
          creationdate: ['2019'],
        },
        facets: {
          frbrtype: ['6'],
          frbrgroupid: ['9046573092659469818'],
        },
      },
    };

    const expected: ElasticsearchDocument = {
      _id: 'alma991011746099707141',
      type: 'L',
      url: 'https://library.brooklynmuseum.org/permalink/01NYA_INST/augm1n/alma991011746099707141',
      title: 'The library',
      description:
        "\"The Library is a meditation on realization and loss through the practice of reading. After his father's unexpected death, the author searched for him in selected books from his father's library in an attempt to access and preserve his (and his father's) memories and thoughts as well as to give shape to questions about a disturbing past. A fugue-structure assembles photographs of books from his father's library alongside the author's prose-poems which respond to his reading of those books. As photographs of books bear witness to the objects with which the father had physical contact, the texts emanating from those objects imagine representations of his thoughts as he read. Photo-collages of forests represent the visual thoughts of the author as he attempted to read his own father, who was often obscured by the enigmas of despair and anxiety. The multiple voices and narrative perspectives encountered in the books from the library expose a series of formative events within and surrounding the father's life. They also inspire the author to create an imagined history in the resulting prose-poems. The culminating book--a portrait in absentia--creates a parallel reality to his father, one that masks actual memories and obstructs his father's voice as it probes the space between documentation and invention, and between the imperative to understand and the impossibility of knowing.\" --Artist's website, viewed May 13, 2019.",
      language: 'en-US',
      tags: [
        'Schulz, David, 1967-',
        'Fathers and sons',
        'Private libraries',
        'Forests and forestry -- Pictorial works',
      ],
      primaryConstituent: {
        id: 'Schulz, David, 1967- artist.',
        name: 'Schulz, David',
      },
      startDate: '01-01-2019',
      startYear: 2019,
      endDate: '01-01-2019',
      endYear: 2019,
      rawSource: primoDocument,
    };

    const result = transform(primoDocument);
    expect(result).toEqual(expected);
  });
});
