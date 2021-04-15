import { RequestHandler } from 'express';
import * as metadata from './model';

export const updateNotes: RequestHandler = async (req, res) => {
  try {
    const { md_id, notes } = req.body;
    await metadata.updateNotes(md_id, notes);
    res.status(200).json({ message: 'Notes successfully updated' });
  } catch (err) {
    res.status(400).json({ error: 'Something went wrong' });
  }
};

export const getNotes: RequestHandler = async (req, res) => {
  try {
    const notes = await metadata.getNotes();
    res.status(200).json(notes);
  } catch (err) {
    res.status(400).json({ error: 'Something went wrong' });
  }
};

export const getIDs: RequestHandler = async (req, res) => {
  try {
    const IDs = await metadata.getIDs();

    // Follow required formatting for getStaticPaths
    const fixedIDs = IDs.map((id: {md_id: number}) => {
      return {
        params: {
          series: String(id.md_id)
        }
      };
    });

    res.status(200).json({ IDs: fixedIDs });
  } catch (err) {
    res.status(400).json({ error: 'Something went wrong' });
  }
};
