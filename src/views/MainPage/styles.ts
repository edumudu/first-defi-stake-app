import styled from 'styled-components';
import { CardContent } from '@mui/material';

export const Wrapper = styled.div`
  margin-top: 1rem;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 2rem;
`;

export const HeaderCard = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StakeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const InputEndAdornment = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.3rem;
`;
