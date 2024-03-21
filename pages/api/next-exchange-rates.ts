import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }

  const { to_date, before } = req.body;

  if (!to_date && !before) {
    return res.status(400).json({ message: 'Invalid params' });
  }

  try {
    
    const response = await fetch("https://api.fraccional.app/graphql/v1", {
      method: "POST",
      headers: {
        'apiKey': process.env.NEXT_PUBLIC_API_KEY ?? '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `# Query GraphQL:
          query FraccionalChallenge($to_date: Date $before: Cursor) {
            exchange_rates: exchange_ratesCollection(
              before: $before
              filter: { pair_at: { gte: $to_date }, pair_left: { eq: CLF }, pair_right: { eq: CLP } }
              orderBy: { pair_at: AscNullsLast }
            ) {
              edges { node { id pair_at pair_left pair_right pair_numeric pair_decimals } }
              pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
            }
          }`,
        variables: { to_date, before }
      })
    });

    //console.log('response', response);
    const { data } = await response.json();
    //console.log('getNextExchangeRates', data);
    
    res.status(200).json(data);

  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : 'There was a problem getting result.';
    res.status(500).json({ message });
  }
}