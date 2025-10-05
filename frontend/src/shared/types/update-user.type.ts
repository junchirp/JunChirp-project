type UpdateUserType = {
  firstName?: string;
  lastName?: string;
  email?: string;
} & ({ firstName: string } | { lastName: string } | { email: string });
