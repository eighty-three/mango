import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { HeaderText, Text, TextWrap, Button } from './styles';

const propTypes = {
  description: PropTypes.string,
  alt_titles: PropTypes.arrayOf(PropTypes.string),
  language: PropTypes.string,
  publication: PropTypes.string,
  from_md: PropTypes.bool
};

const ExtraDetails = (props) => {
  const {
    description,
    alt_titles,
    language,
    publication,
    from_md
  } = props;

  const initialState = { hide: true, text: 'Toggle Extra Details' };
  const [buttonState, setButtonState] = useState(initialState);

  const onClick = () =>
    setButtonState({ ...buttonState, hide: !buttonState.hide });

  return (
    <>
      <hr />
      <Button onClick={onClick}>{buttonState.text}</Button>
      <ExtraDetailsContainer hide={buttonState.hide}>
        <Text>
          <HeaderText>Publication Status:{' '}</HeaderText>
          {publication}
        </Text>

        <Text>
          <HeaderText>Language:{' '}</HeaderText>
          {language}
        </Text>

        <Text>
          <HeaderText>From MD:{' '}</HeaderText>
          {String(from_md)}
        </Text>

        <TextWrap>
          <HeaderText>Description:{' '}</HeaderText>
          {description}
        </TextWrap>

        <Text>
          <HeaderText>Alt Titles:{' '}</HeaderText>
          {alt_titles.map(title => (
            <span key={title}>[{title}] </span>
          ))}
        </Text>
      </ExtraDetailsContainer>
    </>
  );
};

const ExtraDetailsContainer = styled.div`
  display: ${props => props.hide ? 'none' : 'block'};
`;

ExtraDetails.propTypes = propTypes;
export default ExtraDetails;
