import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import * as colors from '@/styles/colors';

import { siteTitle } from '@/components/Layout';
import { getRandomSeries } from '@/lib/manga';

const Navbar = () => {
  return (
    <>
      <Container>
        <Link href='/' passHref>
          <MainLink>
            {siteTitle}
          </MainLink>
        </Link>
        <LinksContainer>
          <StyledLink href='#' onClick={getRandomSeries}>
            Random
          </StyledLink>
          <Link href='/search' passHref>
            <StyledLink>
              Search
            </StyledLink>
          </Link>
          <Link href='/notes' passHref>
            <StyledLink>
              Notes
            </StyledLink>
          </Link>
        </LinksContainer>
      </Container>
      <Bar />
    </>
  );
};

const Container = styled.div`
  display: flex;
  align-items: flex-end;
`;

const MainLink = styled.a`
  margin: 0 1em;
  color: ${colors.main};
  font-size: 1.5em;
  font-weight: bold;
`;

const LinksContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 1em;

  flex-flow: row wrap;
  overflow: hidden;
  width: 100%;
  max-height: 30px;
`;

const StyledLink = styled.a`
  color: ${colors.link};
  font-size: 1em;
  font-weight: bold;
  margin-left: 1.5em;
  height: 30px;
`;

const Bar = styled.hr`
  border: thin solid ${colors.sub};
  margin: 0;
`;

export default Navbar;
