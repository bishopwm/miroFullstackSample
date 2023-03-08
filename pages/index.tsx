import {GetServerSideProps} from 'next';
import {useEffect} from 'react';
import initMiro from '../initMiro';
import Image from 'next/image';

import congratulations from '../public/congratulations.png';

export const getServerSideProps: GetServerSideProps =
  async function getServerSideProps({req}) {
    const {miro} = initMiro(req);

    // redirect to auth url if user has not authorized the app
    if (!(await miro.isAuthorized(''))) {
      return {
        redirect: {
          destination: miro.getAuthUrl(),
          permanent: false,
        },
      };
    }

    const api = miro.as('');

    const boards: string[] = [];
    
    for await (const board of api.getAllBoards()) {
      boards.push(board.name || '');
      // boards.push(board.id || '');
    }


    return {
      props: {
        boards,
      },
    }
  };

export default function Main({boards}: {boards: string[]}) {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('panel')) return;

    window.miro.board.ui.on('icon:click', async () => {
      window.miro.board.ui.openPanel({
        url: `/?panel=1`,
      });
    });
  }, []);

  // API Call Setup

async function apiCall(method: string, url: string) {
  const res = await fetch(url, {
    method: method,
    headers: { "content-type": "application/json" },
  });
  if (res.status !== 200) {
    const text = await res.text();
    try {
      throw new Error(JSON.parse(text));
    } catch (err) {
      throw new Error(text);
    }
  }

  try {
    const sampleItem = await res.json()
    // Send data from REST API to the console
    console.log("This image data was fetched using the REST API!");
    console.log(sampleItem.data[0]);

  } catch (err) {
    return;
  }
}

// Web SDK Example Button
const sdkHandler = () => {
  const image = window.miro.board.createImage({
    title: 'This is an image',
    url: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=834&q=80',
    x: 0, // Default value: horizontal center of the board
    y: 0, // Default value: vertical center of the board
    width: 800, // Set either 'width', or 'height'
    rotation: 0.0,
  });
  return image
};
 
// REST API Example Button
async function restHandler() {
  await apiCall("GET", "/api/restRequest", {});
}

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <Image src={congratulations} alt="Congratulations text" />
      </div>
      <div className="cs1 ce12">
        <h1>Congratulations!</h1>
        <p>You've just created your first Miro app!</p>
        <p>This is a list of all the boards that your user has access to:</p>

        <ul>
          {boards.map((board, idx) => (
            <li key={idx}>{board}</li>
          ))}
        </ul>

        <p>
          To explore more and build your own app, see the Miro Developer
          Platform documentation.
        </p>
      </div>
      <div className="cs1 ce12">
      <button className="button button-primary" type="button" onClick={sdkHandler}>
        SDK button
      </button>
      <button className="button button-primary" type="button" onClick={restHandler}>
        REST button
      </button>
      </div>
    </div>
  );
}
