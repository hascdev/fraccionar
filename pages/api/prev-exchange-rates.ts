import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }

  const { from_date, after } = req.body;

  if (!from_date && !after) {
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
          query FraccionalChallenge($from_date: Date $after: Cursor) {
            exchange_rates: exchange_ratesCollection(
              after: $after
              filter: { pair_at: { lt: $from_date }, pair_left: { eq: CLF }, pair_right: { eq: CLP } }
              orderBy: { pair_at: AscNullsLast }
            ) {
              edges { node { id pair_at pair_left pair_right pair_numeric pair_decimals } }
              pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
            }
          }`,
        variables: { from_date, after }
      })
    });

    //console.log('response', response);
    const { data } = await response.json();
    //console.log('getPrevExchangeRates', data);
    
    res.status(200).json(data);

  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : 'There was a problem getting result.';
    res.status(500).json({ message });
  }
}