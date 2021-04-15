import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { useForm } from 'react-hook-form';

import { Button } from './styles';

import { updateNotes } from '@/lib/metadata';
import useButton from '@/hooks/useButton';

const propTypes = {
  notes: PropTypes.string,
  md_id: PropTypes.number
};

const Notes = (props) => {
  const {
    notes,
    md_id
  } = props;

  const [notesState, setNotes] = useState('');
  const { register, handleSubmit } = useForm();

  const initialButtonText = 'Update notes';
  const [buttonState, setButtonState] = useButton(initialButtonText);

  useLayoutEffect(() => {
    setNotes(notes);
  }, [md_id]);

  const revertText = () => setButtonState({ ...buttonState, text: initialButtonText });

  const onSubmit = async (data) => {
    if (data.notes !== notesState) {
      setNotes(data.notes);
      setButtonState({ text: 'Updating...', disabled: true });
      const req = await updateNotes(md_id, data.notes);

      (req.error)
        ? setButtonState({ text: req.error, disabled: true })
        : setButtonState({ text: 'Successfully updated!', disabled: false });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SubmitButton type={'submit'} disabled={buttonState.disabled} onBlur={revertText}>
        {buttonState.text}
      </SubmitButton>

      <TextArea
        value={notesState}
        spellCheck={'false'}
        placeholder={'Write some notes'}
        aria-describedby={'notes'}
        id={'notes'}
        name={'notes'}
        ref={register({ required: false })}
      />
    </form>
  );
};

const ifDisabled = css`
  color: white;
  background-color: gray;
  border: 0;

  &:hover, &:focus {
    border: 0;
    background-color: gray;
  }

  &:active {
    border: 0;
    background-color: gray;
  }
`;

const SubmitButton = styled(Button)`
  height: 30px;
  margin: 0.5em 0;
  ${props => props.disabled ? ifDisabled : ''};

  font-size: 0.8em;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 200px;
  font-size: 0.75em;
`;

Notes.propTypes = propTypes;
export default Notes;
