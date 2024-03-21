import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
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
          query FraccionalChallenge($frist: Int = 1) {
              exchange_rates_first: exchange_ratesCollection(
                  first: $frist
                  filter: { pair_left: { eq: CLF }, pair_right: { eq: CLP } }
                  orderBy: { pair_at: AscNullsLast }
              ) {
                  edges { node { id pair_at pair_left pair_right pair_numeric pair_decimals } }
              }
              exchange_rates_last: exchange_ratesCollection(
                  first: $frist
                  filter: { pair_left: { eq: CLF }, pair_right: { eq: CLP } }
                  orderBy: { pair_at: DescNullsLast }
              ) {
                  edges { node { id pair_at pair_left pair_right pair_numeric pair_decimals } }
              }
          }`,
        variables: {}
      })
    });

    const { data } = await response.json();
    //console.log('data', data);
    
    res.status(200).json(data);

  } catch (e) {
    const message =
      e instanceof Error
        ? e.message
        : 'There was a problem getting result.';
    res.status(500).json({ message });
  }
}