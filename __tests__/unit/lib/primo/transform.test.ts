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
      source: 'primo',
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
      constituents: [
        {
          id: 'Schulz, David, 1967- artist.',
          name: 'Schulz, David',
        },
      ],
      startDate: '2019-01-01',
      startYear: 2019,
      endDate: '2019-01-01',
      endYear: 2019,
      rawSource: primoDocument,
    };

    const result = transform(primoDocument);
    expect(result).toEqual(expected);
  });

  it('transforms PrimoDocument to ElasticsearchDocument correctly', () => {
    const primoDocument: PrimoDocument = {
      context: 'L',
      adaptor: 'Local Search Engine',
      '@id': 'https://na01.alma.exlibrisgroup.com/primaws/rest/pub/pnxs/L/991013564915707141',
      pnx: {
        display: {
          source: ['Alma'],
          type: ['artists_books'],
          language: ['eng'],
          title: ['1% privilege in a time of global inequality '],
          subject: [
            'Photography, Artistic -- Exhibitions',
            'Distributive justice -- Pictorial works -- Exhibitions',
            'Leisure class -- Pictorial works -- Exhibitions',
            'Poor -- Pictorial works -- Exhibitions',
            'Distributive justice',
            'Leisure class',
            'Photography, Artistic',
            'Poor',
          ],
          format: ['80 unnumbered pages : color illustrations ; 30 cm'],
          identifier: [
            '$$CLC$$V  2018440936;$$CISBN$$V9783775740944;$$CISBN$$V3775740945;$$COCLC$$V(OCoLC)ocn940668135',
          ],
          creationdate: ['2016'],
          lds11: [
            'Part of 10x10 Photobooks\' "AWAKE Reading Room," a collection that responds to issues of liberty, resistance and social protest, held at the PGH Photo Fair, Carnegie Museum of Art, Pittsburgh, April 29-30, 2017; Magnum Foundation, New York, June 17, 2017; Image Text Ithaca Symposium, Ithaca, NY, June 30-July 1, 2017; Massachusetts College of Art and Design, Boston, December 4-5, 2017.',
          ],
          lds02: [
            'Published in conjunction with the exhibitions: Pingyao International Photography Festival, Pingyao, China, September 19-25, 2015; Browse Gallery, Berlin, Germany, October 9-30, 2015; LagosPhoto (Satellite Exhibit), Lagos, Nigeria, October 24-November 27, 2015; Lishui International Photography Festival, Lishui, China, November 6-10, 2015; and several others through January 1, 2017.',
            'Photographers: Christopher Anderson, Nina Berman, Sasha Bezzubov, Peter Bialobrzeski, Guillaume Bonn, Jörg Brüggemann, Philippe Chancel, David Chancellor, Jesse Chehak, Kevin Cooley, Mitch Epstein, Floto+Warner, Greg Girard, Jacqueline Hassink, Guillaume Herbaut, Shane Lavalette, David Leventi, Michael Light, Alex Majoli, Yves Marchand & Romain Meffre, Laura McPhee & Virginia Beahan, Andrew Moore, Zed Nelson, Simon Norfolk, Mike Osborne, Matthew Pillsbury, Ben Quinton, Daniel Shea, Anna Skladmann, Juliana Sohn, Alec Soth, Mikhael Subotzky, Brian Ulrich, Eirini Vourloumis, Henk Wildschut, Michael Wolf, Paolo Woods & Gabriele Galimberti.',
          ],
          publisher: ['Ostfildern, Germany : Hatje Cantz Verlag'],
          description: [
            "\"To be able to simply drift in the infinity pool on the roof terrace of the fifty-seven-floor Marina Bay Sands Hotel, while in the background you can enjoy the urban soundscape of Singapore's imposing sea of high-rises. Or to be personally welcomed to a private champagne party after an extended hot-air balloon ride over the Kenyan wilderness. The extravagant pleasures of the wealthiest one percent of the earth's population represent an extreme contrast to those of the remaining ninety-nine. Describing the gaping disparities in images is a challenge that has been taken up by Nina Berman, Peter Bialobrzeski, Guillaume Bonn, Mikhael Subotzky, and many others photographers. The volume assembles their works for the purpose of lending visual evidence to the blatant discrepancy between people's living conditions, which can be as fascinating as it is shocking.\" -- Publisher's description",
          ],
          mms: ['991013564915707141'],
          contributor: [
            'Little, Myles, 1984- editor.$$QLittle, Myles',
            'Dyer, Geoff, author.$$QDyer, Geoff',
            'Stiglitz, Joseph E., author.$$QStiglitz, Joseph E.',
          ],
          addtitle: [
            'One percent privilege in a time of global inequality',
            'The 10x10 AWAKE Reading Room',
          ],
          genre: [
            'Pictorial works',
            'Exhibitions.',
            'Exhibition catalogs.',
            "Artists' books 2016.",
            'Photobooks.',
            'Exhibition, pictorial works.',
          ],
          place: ['Ostfildern, Germany :'],
          version: ['1'],
          lds01: [
            'Photography, Artistic Exhibitions.',
            'Distributive justice Pictorial works Exhibitions.',
            'Leisure class Pictorial works Exhibitions.',
            'Poor Pictorial works Exhibitions.',
            'Distributive justice. fast (OCoLC)fst00895621',
            'Leisure class. fast (OCoLC)fst00996058',
            'Photography, Artistic. fast (OCoLC)fst01061964',
            'Poor. fast (OCoLC)fst01071040',
          ],
          lds19: ['(OCoLC)ocn940668135'],
          lds34: ['unmediated'],
        },
        control: {
          sourcerecordid: ['991013564915707141'],
          recordid: ['alma991013564915707141'],
          sourceid: 'alma',
          originalsourceid: ['ocn940668135'],
          sourcesystem: ['OCLC'],
          sourceformat: ['MARC21'],
          score: ['7.2172422'],
          isDedup: false,
        },
        addata: {
          aulast: ['Little', 'Dyer', 'Stiglitz'],
          aufirst: ['Myles', 'Geoff', 'Joseph E.'],
          auinit: ['M', 'G', 'J'],
          addau: ['Little, Myles', 'Dyer, Geoff', 'Stiglitz, Joseph E.'],
          contributorfull: [
            '$$NLittle, Myles$$LLittle$$FMyles$$Reditor',
            '$$NDyer, Geoff$$Rcontributor',
            '$$NStiglitz, Joseph E.$$Rcontributor',
          ],
          addtitle: ['One percent privilege in a time of global inequality'],
          date: ['2016 - 2016', '2016'],
          isbn: ['9783775740944', '3775740945'],
          abstract: [
            "\"To be able to simply drift in the infinity pool on the roof terrace of the fifty-seven-floor Marina Bay Sands Hotel, while in the background you can enjoy the urban soundscape of Singapore's imposing sea of high-rises. Or to be personally welcomed to a private champagne party after an extended hot-air balloon ride over the Kenyan wilderness. The extravagant pleasures of the wealthiest one percent of the earth's population represent an extreme contrast to those of the remaining ninety-nine. Describing the gaping disparities in images is a challenge that has been taken up by Nina Berman, Peter Bialobrzeski, Guillaume Bonn, Mikhael Subotzky, and many others photographers. The volume assembles their works for the purpose of lending visual evidence to the blatant discrepancy between people's living conditions, which can be as fascinating as it is shocking.\" -- Publisher's description",
          ],
          cop: ['Ostfildern, Germany'],
          pub: ['Hatje Cantz Verlag'],
          oclcid: ['(ocolc)940668135'],
          lccn: ['2018440936'],
          ristype: ['BOOK'],
          btitle: ['1% privilege in a time of global inequality'],
        },
        sort: {
          title: ['1% privilege in a time of global inequality /'],
          author: ['Little, Myles, 1984- editor.'],
          creationdate: ['2016'],
        },
        facets: {
          frbrtype: ['6'],
          frbrgroupid: ['9080493188715316330'],
        },
      },
    };

    const expected: ElasticsearchDocument = {
      _id: 'alma991013564915707141',
      source: 'primo',
      type: 'L',
      url: 'https://library.brooklynmuseum.org/permalink/01NYA_INST/augm1n/alma991013564915707141',
      title: '1% privilege in a time of global inequality',
      description:
        "\"To be able to simply drift in the infinity pool on the roof terrace of the fifty-seven-floor Marina Bay Sands Hotel, while in the background you can enjoy the urban soundscape of Singapore's imposing sea of high-rises. Or to be personally welcomed to a private champagne party after an extended hot-air balloon ride over the Kenyan wilderness. The extravagant pleasures of the wealthiest one percent of the earth's population represent an extreme contrast to those of the remaining ninety-nine. Describing the gaping disparities in images is a challenge that has been taken up by Nina Berman, Peter Bialobrzeski, Guillaume Bonn, Mikhael Subotzky, and many others photographers. The volume assembles their works for the purpose of lending visual evidence to the blatant discrepancy between people's living conditions, which can be as fascinating as it is shocking.\" -- Publisher's description",
      language: 'en-US',
      tags: [
        'Photography, Artistic -- Exhibitions',
        'Distributive justice -- Pictorial works -- Exhibitions',
        'Leisure class -- Pictorial works -- Exhibitions',
        'Poor -- Pictorial works -- Exhibitions',
        'Distributive justice',
        'Leisure class',
        'Photography, Artistic',
        'Poor',
      ],
      constituents: [
        {
          id: 'Little, Myles, 1984- editor.',
          name: 'Little, Myles',
        },
      ],
      startDate: '2016-01-01',
      startYear: 2016,
      endDate: '2016-01-01',
      endYear: 2016,
      rawSource: primoDocument,
    };

    const result = transform(primoDocument);
    expect(result).toEqual(expected);
  });
});
