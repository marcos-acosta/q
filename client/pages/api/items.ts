import clientPromise from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = clientPromise;
    const db = client.db("q");
    const items = await db.collection("items").find({}).toArray();
    res.json(items);
  } catch (e) {
    console.error(e);
  }
};
