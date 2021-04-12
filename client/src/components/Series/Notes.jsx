import React from 'react';
import PropTypes from 'prop-types';

import { HeaderText, TextWrap } from './styles';

const propTypes = {
  notes: PropTypes.string
};

// Fix, create text-area form instead
const Notes = ({ notes }) => {
  return (
    <>
      <hr />
      <HeaderText>Notes:</HeaderText>
      <TextWrap>
        {notes}
      </TextWrap>
    </>
  );
};

Notes.propTypes = propTypes;
export default Notes;
