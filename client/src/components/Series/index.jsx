import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';

import * as colors from '@/styles/colors';
import Links from './Links';
import Notes from './Notes';
import ExtraDetails from './ExtraDetails';
import { StyledLink, HeaderText, Text } from './styles';

const propTypes = {
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
  notes: PropTypes.string
};

const SeriesComponent = (props) => {
  const {
    title,
    description,
    image,
    tags,
    md_id,
    mu_id,
    mal_id,
    artist_names,
    author_names,
    alt_titles,
    relations,
    language,
    publication,
    reading,
    downloaded,
    from_md,
    notes
  } = props;

  const fixedAltTitles = alt_titles.filter((altTitle) => title !== altTitle);

  return (
    <Container>
      <Cover>
        <a href={`/images/covers/${image}.png`}>
          <img src={`/images/covers/${image}.png`} />
        </a>
      </Cover>
      <Metadata>
        <hr />
        <Title>{title}</Title>

        <Text>
          <HeaderText>Authors:{' '}</HeaderText>
          {author_names.map(author => (
            <StyledLink key={author}>[{author}]</StyledLink>
          ))}
        </Text>

        <Text>
          <HeaderText>Artists:{' '}</HeaderText>
          {artist_names.map(artist => (
            <StyledLink key={artist}>[{artist}]</StyledLink>
          ))}
        </Text>

        <Text>
          <HeaderText>Tags:{' '}</HeaderText>
          {tags.map(tag => (
            <StyledLink key={tag}>[{tag}] </StyledLink>
          ))}
        </Text>

        {relations &&
          <>
            <hr />
            <Text>
              <HeaderText>Related Titles:</HeaderText>
              {relations.map(relation => (
                <Link key={relation.id} href={`/manga/${relation.id}`}>
                  <StyledLink as='li'>
                    {relation.title} - {relation.type}
                  </StyledLink>
                </Link>
              ))}
            </Text>
          </>
        }

        <Links
          md_id={md_id}
          mu_id={mu_id}
          mal_id={mal_id}
        />

        {/* should be buttons with dropdown to change status*/}
        <Text>
          <HeaderText>Reading:{' '}</HeaderText>
          {reading}
        </Text>

        <Text>
          <HeaderText>Downloaded:{' '}</HeaderText>
          {String(downloaded)}
        </Text>

        <Notes notes={notes} id={md_id} />

        <ExtraDetails
          publication={publication}
          language={language}
          description={description}
          alt_titles={fixedAltTitles}
          from_md={from_md}
        />

      </Metadata>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 35% 65%;
  grid-template-areas:
    "cover metadata";

  min-height: 500px;
  margin: 1em auto;

  background-color: white;
  border-radius: 3px;
  box-shadow: 0.25px 0.5px 10px rgb(200, 200, 200);

  @media (max-width: 800px) { 
    grid-template-columns: auto;
    grid-template-areas:
      "cover"
      "metadata";
  }
`;

const Cover = styled.div`
  grid-area: cover;

  display: flex;
  justify-content: center;

  width: auto; 
  margin: 1em;

  > a {
    height: auto;
    max-height: 500px;

    > img {
      height: 100%;
      max-height: 500px;
      object-fit: cover;

      border: 2px solid ${colors.sub};
    }
  }
`;

const Metadata = styled.div`
  grid-area: metadata;
  margin: 1em;
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 1.2em;
  margin-top: 0.5em;
`;

SeriesComponent.propTypes = propTypes;
export default SeriesComponent;
