const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let csrfToken: string | undefined;

export const getCsrfToken = (): string | undefined => csrfToken;

export const setCsrfToken = (token: string | undefined): void => {
  csrfToken = token;
};

export const fetchNewCsrfToken = async (): Promise<string | undefined> => {
  const response = await fetch(`${BASE_URL}/csrf`, {
    credentials: 'include',
  });

  if (!response.ok) {
    csrfToken = undefined;
    return undefined;
  }

  const { csrfToken: token } = await response.json();

  csrfToken = token;

  return token;
};
