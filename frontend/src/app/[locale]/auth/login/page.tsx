import { ReactElement } from 'react';
import AuthFormContainer from '@/shared/components/AuthFormContainer/AuthFormContainer';
import LoginForm from './LoginForm/LoginForm';

export default function Login(): ReactElement {
  return (
    <AuthFormContainer>
      <LoginForm />
    </AuthFormContainer>
  );
}
