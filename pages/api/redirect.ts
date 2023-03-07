import initMiro from '../../initMiro';
import {NextApiRequest, NextApiResponse} from 'next';

// handle redirect with code and exchange it for the access token
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {miro} = initMiro(req, res);

  // Make sure the code is in query parameters
  if (typeof req.query.code !== 'string') {
    res.status(400);
    res.send('Missing code in the query');
    return;
  }
  
  console.log("I'm part of the OAuth2.0 flow being kicked off on the backend! Here's my code: " + req.query.code);
  await miro.exchangeCodeForAccessToken('', req.query.code);
  
  res.redirect('/');
}
