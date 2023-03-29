import {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';

// handle redirect with code and exchange it for the access token
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Make sure the code is in query parameters
  if (typeof req.query.code !== 'string') {
    res.status(400);
    res.send('Missing code in the query');
    return;
  }
  
  console.log("I'm part of the Zoom OAuth2.0 flow being kicked off on the backend! Here's my code: " + req.query.code);
  let access_token;
  let zoom_response;

  let url = `https://zoom.us/oauth/token?grant_type=authorization_code&code=${req.query.code}&redirect_uri=http://localhost:3000/api/zoomRedirect&client_id=YSf7F2LARaqeAgqNt3x0uw&client_secret=5Yk5RgQU8f0ZaPiFahSkBEklbRCAzerh`;

  async function grabToken() {
    try {
      let oauthResponse = await axios.post(url);

      // Console log access_token
      console.log(`access_token: ${oauthResponse.data.access_token}`);

      // Set global variable for access_token
      access_token = oauthResponse.data.access_token;

      // Specify Miro API request URL
      let requestUrl = `https://api.zoom.us/v2/users/me/meetings`;

      // #4:
      // ---> If `access_token` was successfully retrieved, send an API request to any Miro endpoint that contains the same permissions as your OAuth 2.0 app, with `access_token` as value for Bearer Token.
      // ---> (See permissions under user profile > apps: https://miro.com/app/settings/user-profile/apps)
      if (access_token) {
        // API request options
        let config = {
          method: "get",
          url: requestUrl,
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        };
        async function callZoom() {
          try {
            let response = await axios(config);
            //console.log(JSON.stringify(response.data));
            zoom_response = JSON.stringify(response.data);
            //res.send(zoom_response)
            console.log(zoom_response);

          } catch (err) {
            console.log(`ERROR: ${err}`);
          }
        }
        callZoom();
      }
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  }
  grabToken();
  res.redirect('/');
}