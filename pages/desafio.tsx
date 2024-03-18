import React, { useEffect, useState } from "react";
import CalculatorContent from "~/components/CalculatorContent";
import MonthTableContent from "~/components/MonthTableContent";

/*
export async function getStaticProps() {

  const current_date = new Date();
  const first_date = new Date(current_date.getFullYear(), current_date.getMonth(), 1);
  console.log('first_date', first_date.toISOString());

  // Fetch data from an API
  const response = await fetch("https://api.fraccional.app/graphql/v1", {
    method: "POST",
    headers: {
      'apiKey': process.env.API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `# Query GraphQL:
          query FraccionalChallenge($date: String) {
            exchange_rates: exchange_ratesCollection(
              filter: { pair_at: { gte: $date }, pair_left: { eq: CLF }, pair_right: { eq: CLP } }
              orderBy: { pair_at: DescNullsLast }
            ) {
              edges {
                node {
                  id
                  pair_at # Datetime (ISO)
                  pair_left
                  pair_right
                  pair_numeric
                }
              }
            }
          }`,
      variables: { date: first_date.toISOString() }
    })
  });

  const { data: { exchange_rates } } = await response.json();
  console.log('getStaticProps', exchange_rates);

  // Return the data as props
  return { props: { edges: exchange_rates.edges } };
}
*/

export default function PagesChallenge() {


  return (
    <main className="pt-10 sm:pt-24 pb-32 min-h-screen antialiased">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-0">

        <header>
          <h1 className="sm:text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">Valores de UF (CLF)</h1>
        </header>
        <CalculatorContent />
        <MonthTableContent />        
      </div>
    </main>
  );
}
