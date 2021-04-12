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
