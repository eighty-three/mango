import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { darken } from 'polished';

import * as colors from '@/styles/colors';
import Layout from '@/components/Layout';
import Notes from '@/components/Series/Notes';

import { getNotes } from '@/lib/metadata';

const propTypes = {
  notes: PropTypes.arrayOf(
    PropTypes.shape({
      md_id: PropTypes.number,
      title: PropTypes.string,
      notes: PropTypes.string
    })
  )
};

const Series = (props) => {
  const {
    notes
  } = props;

  return (
    <Layout>
      <Head>
        <title>Notes</title>
      </Head>
      <Container>
        {notes.map((note) => (
          <Wrapper key={note.md_id}>
            <NotesContainer>
              <Link href={'/manga/[series]'} as={`/manga/${note.md_id}`} passHref>
                <Title>
                  {note.title}
                </Title>
              </Link>
              <Notes
                key={note.md_id}
                md_id={note.md_id}
                notes={note.notes}
              />
            </NotesContainer>
          </Wrapper>
        ))}
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));

  @media (max-width: 450px) { 
    display: block;
  }
`;

const Wrapper = styled.div`
  width: 100%;
`;

const NotesContainer = styled.div`
  margin: 0.5em;
  padding: 1em;
  border-radius: 4px;
  box-shadow: 0.15px 0.15px 5px rgb(220, 220, 220);
  background-color: white;

  border: 2px solid transparent;
  outline: none;

  &:hover {
    border: 2px solid ${colors.sub};
  }
`;

const Title = styled.a`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  cursor: pointer;

  font-size: 1em;
  font-weight: bold;
  color: black;

  &:visited {
    color: black;
  }

  &:hover {
    color: ${darken(0.6, colors.sub)};
  }
`;

export const getServerSideProps = async () => {
  const notes = await getNotes();

  return {
    props: {
      notes
    }
  };
};

Series.propTypes = propTypes;
export default Series;
