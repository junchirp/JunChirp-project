import { ReactElement } from 'react';
import AuthFormContainer from '@/shared/components/AuthFormContainer/AuthFormContainer';
import RegistrationForm from './RegistrationForm/RegistrationForm';

export default function Registration(): ReactElement {
  return (
    <AuthFormContainer>
      <RegistrationForm />
    </AuthFormContainer>
  );
}
