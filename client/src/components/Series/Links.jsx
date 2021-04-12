import React from 'react';
import PropTypes from 'prop-types';

import { StyledLink, HeaderText, Text } from './styles';

const propTypes = {
  md_id: PropTypes.number.isRequired,
  mu_id: PropTypes.number,
  mal_id: PropTypes.number,
};

const ExternalLinks = (props) => {
  const {
    md_id,
    mu_id,
    mal_id
  } = props;

  const md_link = 'https://www.mangadex.org/title/';
  const mu_link = 'https://www.mangaupdates.com/series.html?id=';
  const mal_link = 'https://myanimelist.net/manga/';

  return (
    <>
      <hr />
      <Text>
        <HeaderText>Links:{' '}</HeaderText>
        <StyledLink href={`${md_link}${md_id}`}>[MD]</StyledLink>

        { mu_id !== 0 &&
          <StyledLink href={`${mu_link}${mu_id}`}>[MU]</StyledLink>
        }
        { mal_id !== 0 &&
          <StyledLink href={`${mal_link}${mal_id}`}>[MAL]</StyledLink>
        }
      </Text>
    </>
  );
};

ExternalLinks.propTypes = propTypes;
export default ExternalLinks;
