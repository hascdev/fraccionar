import type { NextApiRequest, NextApiResponse } from "next";
import { Data, Maybe, Scalars } from "~/types";

export async function getCurrentExchangeRates(pair_at: string) : Promise<Data> {
  
  try {

    const response = await fetch("https://api.fraccional.app/graphql/v1", {
      method: "POST",
      headers: { 
        'apiKey': process.env.NEXT_PUBLIC_API_KEY ?? '', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `# Query GraphQL:
          query FraccionalChallenge($pair_at: Date) {
            exchange_rates: exchange_ratesCollection(
              filter: { pair_at: { eq: $pair_at }, pair_left: { eq: CLF }, pair_right: { eq: CLP } }
              orderBy: { pair_at: AscNullsFirst }
            ) {
              edges {
                node {
                  id
                  pair_at # Datetime (ISO)
                  pair_left
                  pair_right
                  pair_numeric
                  pair_decimals
                }
              }
            }
          }`,
        variables: { pair_at }
      })
    });

    //console.log('response', response);
    const { data } = await response.json();
    //console.log('getCurrentExchangeRates', data);
    return data;

  } catch (error) {
    throw error;
  }
}

export async function getExchangeRates(pair_at: string, before?: Maybe<Scalars['String']['output'] | undefined>) : Promise<Data> {
  
  try {

    const response = await fetch("https://api.fraccional.app/graphql/v1", {
      method: "POST",
      headers: { 
        'apiKey': process.env.NEXT_PUBLIC_API_KEY ?? '', 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `# Query GraphQL:
          query FraccionalChallenge($pair_at: Date $before: Cursor) {
            exchange_rates: exchange_ratesCollection(
              before: $before
              filter: { pair_at: { gte: $pair_at }, pair_left: { eq: CLF }, pair_right: { eq: CLP } }
              orderBy: { pair_at: AscNullsFirst }
            ) {
              edges {
                node {
                  id
                  pair_at # Datetime (ISO)
                  pair_left
                  pair_right
                  pair_numeric
                  pair_decimals
                }
              }
              pageInfo {
                hasNextPage     # if false, can disable next page button
                hasPreviousPage # if false, can disable prev page button
                startCursor     # used for getting prev page
                endCursor       # used for getting next page
              }
            }
          }`,
        variables: { pair_at, before }
      })
    });

    //console.log('response', response);
    const { data } = await response.json();
    //console.log('getExchangeRates', data);
    return data;

  } catch (error) {
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ date: new Date().toISOString() });
}
