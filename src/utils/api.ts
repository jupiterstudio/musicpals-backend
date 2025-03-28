import axios from 'axios';
import * as qs from 'qs';

export const tokenRequest = async (
  domain: string,
  requestBody: any,
): Promise<any> =>
  await axios({
    method: 'POST',
    url: `https://${domain}/oauth/token`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(requestBody),
  });

export const register = async (
  domain: string,
  email: string,
  password: string,
  token: string,
): Promise<any> =>
  await axios.post(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
    {
      email,
      password,
      connection: 'Username-Password-Authentication', // This depends on your Auth0 setup
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
