import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import styles from './index.module.scss';
import Navbar from '@/components/Navbar';

export const siteTitle = 'Mango';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ])
};

const Layout = (props) => {
  const {
    children
  } = props;

  return (
    <div className={styles.container}>
      {/* Meta Tags */}
      <Head>
        <link rel='icon' href='data:;base64,=' />
        <meta
          name='description'
          content={siteTitle}
        />
        <title>{siteTitle}</title>
      </Head>

      {/* Contents */}
      <main>
        <Navbar />
        {children}
      </main>
    </div>
  );
};

Layout.propTypes = propTypes;
export default Layout;
