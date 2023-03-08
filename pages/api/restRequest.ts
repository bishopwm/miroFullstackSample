import initMiro from "../../initMiro";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { miro } = initMiro(req, res);
  const api = miro.as('');

  const boards: string[] = [];
  
  for await (const board of api.getAllBoards()) {
    boards.push(board.name || '');
    boards.push(board.id || '');
  }

  if (req.method === "GET") {
    try {
      const miroRes = await miro
        .as("")
        ._api.call(
          "GET",
          `/v2/boards/${boards[3]}/images`
        );
      res.send(miroRes.body);
    } catch (err) {
      res.status(500).send({
        error: "Failed to perform operation",
      });
    }
    return;
  }
}