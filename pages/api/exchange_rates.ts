import type { NextApiRequest, NextApiResponse } from "next";
import { Data, RangeData } from "~/types";

export async function getCurrentExchangeRates(pair_at: string): Promise<Data> {

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
              edges { node { id pair_at pair_left pair_right pair_numeric pair_decimals } }
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

export async function getRangeExchangeRates(): Promise<RangeData> {

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

    //console.log('response', response);
    const { data } = await response.json();
    //console.log('getRangeExchangeRates', data);
    return data;

  } catch (error) {
    throw error;
  }
}

export async function getPrevExchangeRates(from_date: string, after: string): Promise<Data> {

  try {

    const response = await fetch("https://api.fraccional.app/graphql/v1", {
      method: "POST",
      headers: {
        'apiKey': process.env.NEXT_PUBLIC_API_KEY ?? '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `# Query GraphQL:
          query FraccionalChallenge($pair_at: Date $after: Cursor) {
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
    return data;

  } catch (error) {
    throw error;
  }
}

export async function getNextExchangeRates(to_date: string, before: string): Promise<Data> {

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
    return data;

  } catch (error) {
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ date: new Date().toISOString() });
}
