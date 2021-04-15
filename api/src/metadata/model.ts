import db from '@utils/db';
import { PreparedStatement as PS } from 'pg-promise';

export const updateNotes = async (
  md_id: number,
  notes: string
): Promise<void> => {
  const query = new PS({ name: 'update-notes', text: '\
    UPDATE series SET notes = $2 WHERE md_id = $1'
  });

  query.values = [md_id, notes];
  await db.none(query);
};

export const getNotes = async (
): Promise<any> => {
  const query = new PS({ name: 'get-notes', text: '\
    SELECT md_id, title, notes FROM series WHERE notes != $1'
  });

  query.values = [''];
  return await db.manyOrNone(query);
};

export const getIDs = async (
): Promise<any> => {
  const query = new PS({ name: 'get-ids', text: '\
    SELECT md_id FROM series'
  });

  return await db.manyOrNone(query);
};
