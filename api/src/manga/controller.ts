import { RequestHandler } from 'express';
import * as manga from './model';

import { sanitize } from './utils';

export const getSeries: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const series = await manga.getSeries(id) || { error: 'No series from ID saved' };
    res.status(200).json(series);
  } catch (err) {
    res.status(400).json({ error: 'Something went wrong' });
  }
};

export const getRandomSeries: RequestHandler = async (req, res) => {
  try {
    const { md_id } = await manga.getRandomSeries();
    res.status(200).json({ id: md_id });
  } catch (err) {
    res.status(400).json({ error: 'Something went wrong' });
  }
};

export const searchTitle: RequestHandler = async (req, res) => {
  try {
    const { str } = req.body;
    const series = await manga.searchTitle(sanitize(str));
    res.status(200).json(series);
  } catch (err) {
    res.status(400).json({ error: 'Something went wrong' });
  }
};

export const searchMetadata: RequestHandler = async (req, res) => {
  try {
    const {
      title,
      author,
      artist,
      language,
      publication,
      reading,
      downloaded,
      from_md,
      page
    } = req.body;

    const series = await manga.searchMetadata(
      sanitize(title),
      sanitize(author),
      sanitize(artist),
      language,
      publication,
      reading,
      downloaded,
      from_md,
      page
    );

    res.status(200).json(series);
  } catch (err) {
    res.status(400).json({ error: 'Something went wrong' });
  }
};
