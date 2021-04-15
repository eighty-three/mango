import styled from 'styled-components';
import { darken } from 'polished';
import * as colors from '@/styles/colors';

export const HeaderText = styled.span`
  font-size: 0.85em;
  font-weight: bold;
  color: gray;
`;

export const Text = styled.p`
  overflow: hidden;
  margin: 0.5em 0;
`;

export const TextWrap = styled(Text)`
  word-break: break-word;
  white-space: break;
`;

export const StyledLink = styled.a`
  color: ${darken(0.6, colors.sub)};
  font-weight: bold;
  margin: 0 0.2em;
  cursor: pointer;
  font-size: ${props => props.size ? props.size : '0.85em'};

  :hover {
    text-decoration: underline;
  }
`;

export const Button = styled.button`
  width: 100%;
  height: 45px;

  margin-top: 0.5em;

  cursor: pointer;
  background-color: white;

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
