import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Series from './Series';

const propTypes = {
  series: PropTypes.arrayOf(
    PropTypes.shape({
      md_id: PropTypes.number,
      title: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string
    })
  )
};

const SearchOutput = (props) => {
  const {
    series
  } = props;

  return (
    <Container>
      {(series.length > 0)
        ? (
          <>
            {series.map((title, idx) => {
              if (idx < 100) {
                /* Display only 100 series at a time.
                 * The 101st item is for pagination
                 */
                return (
                  <Series key={title.md_id} {...title} />
                );
              }
            })}
          </>
        )
        : (
          <Text>No output from search.</Text>
        )
      }
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 0.5em 0;

  @media (max-width: 800px) { 
    flex-flow: column;
    padding: 0;
  }
`;

const Text = styled.p`
  margin: 0 auto;

  font-size: 1.5em;
  font-weight: bold;
`;

SearchOutput.propTypes = propTypes;
export default SearchOutput;
