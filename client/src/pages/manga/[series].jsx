import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import Layout from '@/components/Layout';
import SeriesComponent from '@/components/Series';

import { getSeries } from '@/lib/manga';

const propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    md_id: PropTypes.number.isRequired,
    mu_id: PropTypes.number,
    mal_id: PropTypes.number,
    artist_names: PropTypes.arrayOf(PropTypes.string),
    author_names: PropTypes.arrayOf(PropTypes.string),
    alt_titles: PropTypes.arrayOf(PropTypes.string),
    relations: PropTypes.arrayOf(
      PropTypes.shape({
        parent_id: PropTypes.number,
        md_id: PropTypes.number,
        title: PropTypes.string,
        type: PropTypes.number
      })
    ),
    language: PropTypes.string,
    publication: PropTypes.string,
    reading: PropTypes.string,
    downloaded: PropTypes.string,
    from_md: PropTypes.bool,
    tags: PropTypes.arrayOf(
      PropTypes.number // For now
    ),
    notes: PropTypes.string,
    error: PropTypes.string
  }).isRequired
};

const Series = (props) => {
  const {
    data
  } = props;
  const title = data.error ? data.error : data.title;

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      {data?.error
        ? (<h1>{data.error}</h1>)
        : (<SeriesComponent {...data} />)
      }
    </Layout>
  );
};
import { checkImage } from '@/lib/image';

export const getServerSideProps = async (ctx) => {
  const id = ctx.params.series;
  const data = await getSeries(id);
  if (data.error) return { props: { data: { error: data.error }}};

  const image = checkImage(id);

  return {
    props: {
      data: {
        ...data,
        image
      }
    }
  };
};

Series.propTypes = propTypes;
export default Series;
