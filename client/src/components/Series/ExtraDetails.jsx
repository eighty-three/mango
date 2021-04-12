import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darken } from 'polished';

import { HeaderText, Text, TextWrap } from './styles';

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
      <ToggleButton onClick={onClick}>{buttonState.text}</ToggleButton>
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

const ToggleButton = styled.button`
  width: 100%;
  height: 45px;
  
  margin-top: 0.5em;

  cursor: pointer;
  background-color: transparent;

  border-radius: 2px;
  border: thin solid rgb(220, 220, 220);
  outline: 0;

  font-size: 1em;
  font-weight: bold;
  color: gray;

  &:hover, &:focus {
    background-color: rgb(220, 220, 220);
  }

  &:active {
    background-color: ${darken(0.2, 'rgb(220, 220, 220)')};
  }
`;

const ExtraDetailsContainer = styled.div`
  display: ${props => props.hide ? 'none' : 'block'};
`;

ExtraDetails.propTypes = propTypes;
export default ExtraDetails;
