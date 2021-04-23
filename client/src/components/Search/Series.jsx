import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import { darken } from 'polished';

import * as colors from '@/styles/colors';

const propTypes = {
  md_id: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string
};

const Series = (props) => {
  const {
    md_id,
    title,
    description,
    image
  } = props;

  return (
    <Wrapper>
      <Container>
        <ImageContainer>
          <Image src={`/images/covers/thumbs/${image}.png`} />
        </ImageContainer>
        <Link href={'/manga/[series]'} as={`/manga/${String(md_id)}`} passHref>
          <Title>
            {title}
          </Title>
        </Link>

        <Description>{description}</Description>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 50%;
  margin-bottom: 1em;

  @media (max-width: 800px) { 
    width: 100%;
    margin: 0;
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: 50px auto;
  grid-template-columns: 150px auto;
  grid-template-areas:
    "title title"
    "image description";

  height: 210px;
  margin: 0 0.5em;
  background-color: white;

  border-radius: 4px;
  border: 2px solid transparent;
  outline: none;
  box-shadow: 0.15px 0.15px 5px rgb(220, 220, 220);

  &:hover {
    border: 2px solid ${colors.sub};
  }

  @media (max-width: 800px) { 
    margin: 0;

    border-radius: 0;
    border: 0;
    border-bottom: 5px solid ${colors.sub};
    box-shadow: none;

    &:hover {
      border: 0;
      border-bottom: 5px solid ${colors.sub};
    }
  }
`;

const ImageContainer = styled.div`
  grid-area: image;

  display: flex;
  justify-content: center;
  align-items: center;

  margin-right: 0.5em;

  border-right: thin solid ${colors.sub};
`;

const Image = styled.img`
  object-fit: contain;
`;

const Title = styled.a`
  grid-area: title;

  padding-left: 0.5em;

  border-bottom: thin solid ${colors.sub};

  font-size: 1.25em;
  font-weight: bold;
  color: black;
  line-height: 50px; // same as height in Container

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:visited {
    color: black;
  }
  
  &:hover {
    color: ${darken(0.6, colors.sub)};
  }
`;

const Description = styled.p`
  grid-area: description;

  font-size: 12px;
  overflow: hidden;
`;

Series.propTypes = propTypes;
export default Series;
