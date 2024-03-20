import { useCallback, useEffect, useState } from 'react'
import MonthTable from './MonthTable'
import { Exchange_RatesEdge_Grouped, Exchange_RatesEdge_Month } from '~/types';
import { getDateFromISOString, getMonthYearFormat, toISOStringFormatShort } from '~/utils/date';
import { getExchangeRates } from '~/pages/api/exchange_rates';

export default function MonthTableContent() {

  const [prev, setPrev] = useState<Exchange_RatesEdge_Month>();
  const [next, setNext] = useState<Exchange_RatesEdge_Month>();

  const initData = useCallback(async () => {

    const first_date_month = new Date();
    first_date_month.setDate(1);
    const pair_at = toISOStringFormatShort(first_date_month);

    const { exchange_rates } = await getExchangeRates(pair_at);
    const endCursor = exchange_rates.pageInfo.endCursor;

    let idx = 0;
    const rates_edge_gruped: Exchange_RatesEdge_Grouped = exchange_rates.edges.reduce((group: Exchange_RatesEdge_Grouped, edge) => {

      const { node } = edge;
      const local_date = getDateFromISOString(node.pair_at);
      const title = getMonthYearFormat(local_date);

      const index = group.findIndex(month => month?.title === title);
      if (index !== -1) {
        group[index]?.edges.push(edge);
      } else {
        group[idx] = { title, date: node.pair_at, endCursor, edges: [] };
        group[idx++]?.edges.push(edge);
      }

      return group;

    }, []);

    setPrev(rates_edge_gruped[0]);
    setNext(rates_edge_gruped[1]);

  }, []);

  useEffect(() => {
    initData();
  }, [initData]);

  const prevMonth = useCallback(

    async (date: string, before: any) => {

      try {

        setNext(prev);
        const prev_date = getDateFromISOString(date);
        prev_date.setMonth(prev_date.getMonth() - 1);
        const prev_pair_at = toISOStringFormatShort(prev_date);
        const { exchange_rates } = await getExchangeRates(prev_pair_at, before);
        const title = getMonthYearFormat(prev_date);
        const endCursor = exchange_rates.pageInfo.endCursor;
        setPrev({ title, date: prev_pair_at, endCursor, edges: exchange_rates.edges });

      } catch (error) {
        console.error('prevMonth', error);
      }
    }, [prev]
  );

  const nextMonth = useCallback(

    async (date: string, before: any) => {

      try {

        setPrev(next);
        const next_date = getDateFromISOString(date);
        next_date.setMonth(next_date.getMonth() + 1);
        const next_pair_at = toISOStringFormatShort(next_date);
        const { exchange_rates } = await getExchangeRates(next_pair_at, before);
        const title = getMonthYearFormat(next_date);
        setNext({ title, date: next_pair_at, edges: exchange_rates.edges });

      } catch (error) {
        console.error('nextMonth', error);
      }
    }, [next]
  );

  return (
    <>
      <h5 className="mt-12 block text-xl font-medium text-gray-900 dark:text-gray-100">Valores de UF (CLF) por mes y año</h5>

      <div aria-description="Valores de UF (CLF) por mes y año" className="mt-6 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="md:grid md:grid-cols-2 md:items-start md:gap-x-10 relative">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="flex items-center">
                <div className="mr-4">
                  <button type="button" className="btn btn-outline-skin btn-1 btn-rounded btn-shadow" onClick={() => prevMonth(prev?.date ?? "", prev?.endCursor)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                </div>
                <div className="flex-auto">
                  <h1 className="text-base text-center font-semibold capitalize leading-6 text-gray-700 dark:text-gray-300">{prev?.title}</h1>
                </div>
              </div>
              <MonthTable edges={prev?.edges ?? []} />
            </div>
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="flex items-center">
                <div className="flex-auto">
                  <h1 className="text-base text-center font-semibold capitalize leading-6 text-gray-700 dark:text-gray-300">{next?.title}</h1>
                </div>
                <div className="ml-4">
                  <button type="button" className="btn btn-outline-skin btn-1 btn-rounded btn-shadow" onClick={() => nextMonth(next?.date ?? "", next?.endCursor)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </div>
              <MonthTable edges={next?.edges ?? []} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
