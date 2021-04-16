import db from '@utils/db';
import { PreparedStatement as PS, QueryParam } from 'pg-promise';
import { nanoid } from 'nanoid';

import {
  ISeries,
  IMetadata,
  ISearchOutput,
  IRelation,
  TLanguage,
  TPublicationStatus,
  TReadingStatus,
  TDownloadStatus,
} from './types';
import { pubStatus } from './utils';

export const getSeries = async (
  id: string
): Promise<ISeries|null> => {
  const query = new PS({ name: 'get-series', text: '\
    SELECT s.title, s.description, s.tags,\
           s.md_id, s.mu_id, s.mal_id,\
           s.language, s.publication, s.reading,\
           s.downloaded, s.from_md, s.notes,\
           ar.artist_names, au.author_names, at.alt_titles, r.relations\
    FROM series s \
    INNER JOIN (\
      SELECT array_to_json(array_agg(name)) AS artist_names\
      FROM artists\
      WHERE id = ANY(\
        SELECT unnest(artist) FROM series\
        WHERE md_id = $1)\
    ) AS ar ON TRUE\
    INNER JOIN (\
      SELECT array_to_json(array_agg(name)) AS author_names\
      FROM authors\
      WHERE id = ANY(\
        SELECT unnest(author) FROM series\
        WHERE md_id = $1)\
    ) AS au ON TRUE\
    LEFT JOIN (\
      SELECT array_to_json(array_agg(name)) AS alt_titles\
      FROM titles\
      WHERE md_id = $1\
    ) AS at ON TRUE\
    LEFT JOIN (\
      SELECT array_to_json(array_agg(row_to_json(sr))) AS relations\
      FROM (\
        SELECT id, title, type FROM relations\
        WHERE parent_id = $1\
      ) AS sr\
    ) AS r ON TRUE\
    WHERE md_id = $1'
  });

  query.values = [id];
  return await db.oneOrNone(query);
};

export const getRandomSeries = async (
): Promise<{md_id: number}> => {
  // Can probably do it all in just SQL
  const query = new PS({ name: 'get-all-series', text: '\
    SELECT md_id FROM series'
  });

  const all = await db.many(query);
  const len = all.length;
  const random = Math.floor(Math.random() * (len));
  return all[random];
};

// For quicksearch
export const searchTitle = async (
  str: string
): Promise<ISearchOutput[]> => {
  const query = new PS({ name: 'search-title', text: '\
    SELECT DISTINCT s.md_id, s.title FROM titles t\
      INNER JOIN series s ON s.md_id = t.md_id\
    WHERE t.name ~* $1 GROUP BY s.md_id, s.title'
  });

  query.values = [str];
  return await db.manyOrNone(query);
};


// No tags yet, waiting for MD to be back up
export const searchMetadata = async (
  title: string,
  author: string,
  artist: string,
  language: TLanguage,
  publication: TPublicationStatus,
  reading: TReadingStatus,
  downloaded: TDownloadStatus,
  from_md: boolean,
  offset: number
): Promise<ISearchOutput[]> => {
  let num = 1;
  let first = true;
  let joins = '';
  let conditions = '';
  const queryValues = [];
  let queryText = 'SELECT DISTINCT s.md_id, s.title, s.description FROM series s';
  let groupByText = ' GROUP BY s.md_id, s.title, s.description';

  const checkIfFirst = (check: boolean): void => {
    if (check) {
      first = false;
      conditions += ' WHERE';
    } else {
      conditions += ' AND';
    }
  };

  if (title) {
    checkIfFirst(first);
    queryValues.push(title);

    joins += ' INNER JOIN titles t ON t.md_id = s.md_id';
    conditions += ` t.name ~* $${num}`;
    num++;
  }

  if (author) {
    checkIfFirst(first);
    queryValues.push(author);

    joins += `
      INNER JOIN authors_series aur ON aur.md_id = s.md_id
      INNER JOIN authors au ON au.id = aur.id
    `;
    conditions += ` au.name ~* $${num}
    `;
    num++;
  }

  if (artist) {
    checkIfFirst(first);
    queryValues.push(artist);

    joins += `
      INNER JOIN artists_series atr ON atr.md_id = s.md_id
      INNER JOIN artists at ON at.id = atr.id
    `;
    conditions += ` at.name ~* $${num}
    `;
    num++;
  }

  if (language) {
    checkIfFirst(first);
    queryValues.push(language);

    conditions += ` s.language = $${num}
    `;
    num++;
  }

  if (publication) {
    checkIfFirst(first);
    queryValues.push(publication);

    conditions += ` s.publication = $${num}
    `;
    num++;
  }

  if (reading) {
    checkIfFirst(first);

    if (downloaded === 'null') {
      conditions += ` s.reading is NULL
      `;
    } else {
      conditions += ` s.reading = $${num}
      `;

      queryValues.push(reading);
      num++;
    }
  }

  if (downloaded) {
    checkIfFirst(first);

    if (downloaded === 'null') {
      conditions += ` s.downloaded is NULL
      `;
    } else {
      conditions += ` s.downloaded = $${num}
      `;

      queryValues.push(reading);
      num++;
    }
  }

  if (from_md || from_md === false) {
    checkIfFirst(first);
    queryValues.push(from_md);

    conditions += ` s.from_md = $${num}
    `;
    num++;
  }

  if (first) {
    queryText = 'SELECT md_id, title, description FROM series';
    groupByText = '';
  }


  /* Example fixedText:
   * SELECT DISTINCT s.md_id, s.title, s.description FROM series s
   *   INNER JOIN titles t ON t.md_id = s.md_id
   * 	 INNER JOIN authors_series aur ON aur.md_id = s.md_id
   * 	 INNER JOIN authors au ON au.id = aur.id
   * 	 INNER JOIN artists_series atr ON atr.md_id = s.md_id
   * 	 INNER JOIN artists at ON at.id = atr.id
   * 	 WHERE t.name ~* $1
   * 	   AND au.name ~* $2
   * 	   AND at.name ~* $3
   * 	   AND s.language = $4
   * 	   AND s.publication = $5
   * 	   AND s.reading = $6
   * 	   AND s.downloaded = $7
   * 	   AND s.from_md = $8
   * 	 GROUP BY s.md_id, s.title, s.description;
   */
  const fixedText = queryText + joins + conditions + groupByText;

  /* Not including the `PSname` string will return the error:
   *  Error: Prepared statements must be unique -
   *  'search-metadata' was used for a different statement
   *
   * Probably because the query text is composed differently
   * but the name stays the same.
   */
  const PSname = nanoid(10);
  const query = new PS({ name: `search-metadata-${PSname}`, text: fixedText, values: queryValues });
  return await db.manyOrNone(query);
};

// Subject to change depending on MD's new API output
export const addSeries = async (
  metadata: IMetadata
): Promise<void> => {
  const title = metadata.title;
  const description = metadata.description;
  const tags = metadata.tags;

  const md_id = metadata.id;
  const mu_id = Number(metadata.links?.mu) || 0;
  const mal_id = Number(metadata.links?.mal) || 0;
  const language = metadata.publication.language;
  const publication = pubStatus(metadata.publication.status);

  const authors = metadata.author;
  const artists = metadata.artist;
  const altTitles = metadata.altTitles;
  altTitles.push(title);

  const altTitlesArr = [...new Set(altTitles)];
  const relations = metadata.relations;

  await db.tx(async t => {
    const author_ids = (authors.length)
      ? (await t.batch(
        authors.map((author) => t.one(createAuthorQuery(author)))
      )).map((obj) => Number(obj.id))
      : [];

    const artist_ids = (artists.length)
      ? (await t.batch(
        artists.map((artist) => t.one(createArtistQuery(artist)))
      )).map((obj) => Number(obj.id))
      : [];

    const query = new PS({ name: 'add-series', text: '\
      INSERT INTO series (\
        title, description, author, artist, tags,\
        md_id, mu_id, mal_id, language, publication)\
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
    });
    query.values = [
      title, description, author_ids, artist_ids, tags,
      md_id, mu_id, mal_id, language, publication
    ];

    await t.none(query);

    await t.batch(
      altTitlesArr.map((altTitle) => t.none(altTitleQuery(md_id, altTitle)))
    );

    // Tags are from MD, creating a new row for tags isn't necessary (I think?)

    await t.batch(
      relations.map((relation) => t.none(createRelationQuery(md_id, relation)))
    );

    await t.batch(
      author_ids.map((author) => t.none(authorsSeriesQuery(author, md_id)))
    );

    await t.batch(
      artist_ids.map((artist) => t.none(artistsSeriesQuery(artist, md_id)))
    );
  });
};

const authorsSeriesQuery = (
  author: number,
  md_id: number
): QueryParam => {
  const query = new PS({ name: 'authors-series-query', text: '\
    INSERT INTO authors_series (id, md_id) VALUES ($1, $2)'
  });

  query.values = [author, md_id];
  return query;
};

const artistsSeriesQuery = (
  artist: number,
  md_id: number
): QueryParam => {
  const query = new PS({ name: 'artists-series-query', text: '\
    INSERT INTO artists_series (id, md_id) VALUES ($1, $2)'
  });

  query.values = [artist, md_id];
  return query;
};

const altTitleQuery = (
  md_id: number,
  title: string
): QueryParam => {
  const query = new PS({ name: 'add-alt-title', text: '\
    INSERT INTO titles (md_id, name) VALUES ($1, $2)'
  });

  query.values = [md_id, title];
  return query;
};

const createRelationQuery = (
  parent_id: number,
  relation: IRelation
): QueryParam => {
  const query = new PS({ name: 'create-relation', text: '\
    INSERT INTO relations (parent_id, id, title, type)\
    VALUES ($1, $2, $3, $4)'
  });

  query.values = [parent_id, relation.id, relation.title, relation.type];
  return query;
};

const createAuthorQuery = (
  tag: string
): QueryParam => {
  /* If the author is not in the database,
   * create row, returning id. Else,
   * return its id.
   */
  const query = new PS({ name: 'create-author', text: '\
    WITH ins AS (\
      INSERT INTO authors (name)\
      VALUES ($1)\
      ON     CONFLICT (name) DO UPDATE\
      SET    name = NULL \
      WHERE  FALSE\
      RETURNING id\
      )\
    SELECT id FROM ins\
      UNION  ALL\
      SELECT id FROM authors\
      WHERE  name = $1'
  });

  query.values = [tag];
  return query;
};

const createArtistQuery = (
  tag: string
): QueryParam => {
  /* If the artist is not in the database,
   * create row, returning id. Else,
   * return its id.
   */
  const query = new PS({ name: 'create-artist', text: '\
    WITH ins AS (\
      INSERT INTO artists (name)\
      VALUES ($1)\
      ON     CONFLICT (name) DO UPDATE\
      SET    name = NULL \
      WHERE  FALSE\
      RETURNING id\
      )\
    SELECT id FROM ins\
      UNION  ALL\
      SELECT id FROM artists\
      WHERE  name = $1'
  });

  query.values = [tag];
  return query;
};
