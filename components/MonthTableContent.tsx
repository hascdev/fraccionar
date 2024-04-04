import { useCallback, useEffect, useState } from 'react'
import MonthTable from './MonthTable'
import { Exchange_RatesEdge, Exchange_RatesEdge_Grouped, Exchange_RatesEdge_Month, PageInfo } from '~/types';
import { getDateFromISOString, getMonthYearFormat, toISOStringFormatShort } from '~/utils/date';

export default function MonthTableContent() {

  const [prev, setPrev] = useState<Exchange_RatesEdge_Month>();
  const [next, setNext] = useState<Exchange_RatesEdge_Month>();
  const [pageTableInfo, setPageTableInfo] = useState<PageInfo>({ hasPreviousPage: true, hasNextPage: false });

  const initData = useCallback(async () => {

    const first_date_month = new Date();
    first_date_month.setDate(1);
    const pair_at = toISOStringFormatShort(first_date_month);

    first_date_month.setMonth(first_date_month.getMonth() + 2);
    const before = '["' + toISOStringFormatShort(first_date_month) + '"]';
    const encode_before = btoa(before);
    //console.log("before", before, "encode_before", encode_before);

    const response = await fetch('/api/next-exchange-rates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "to_date": pair_at, "before": encode_before }),
    });

    if (response.ok) {

      const { exchange_rates } = await response.json();
      //console.log("exchange_rates", exchange_rates);

      let idx = 0;
      const rates_edge_gruped: Exchange_RatesEdge_Grouped = exchange_rates.edges.reduce((group: Exchange_RatesEdge_Grouped, edge: Exchange_RatesEdge) => {

        const { node } = edge;
        const local_date = getDateFromISOString(node.pair_at);
        const title = getMonthYearFormat(local_date);

        const index = group.findIndex(month => month?.title === title);
        if (index !== -1) {
          group[index]?.edges.push(edge);
        } else {
          group[idx] = { title, date: node.pair_at, edges: [] };
          group[idx++]?.edges.push(edge);
        }

        return group;

      }, []);

      setPrev(rates_edge_gruped[0]);
      setNext(rates_edge_gruped[1]);

    }

  }, []);

  useEffect(() => {
    initData();
  }, [initData]);

  const prevMonth = useCallback(

    async (from_date_str: string) => {

      try {

        setNext(prev);

        const after_date = getDateFromISOString(from_date_str);
        after_date.setMonth(after_date.getMonth() - 1);
        const title = getMonthYearFormat(after_date);
        const date = toISOStringFormatShort(after_date);

        after_date.setDate(after_date.getDate() - 1);
        const after = '["' + toISOStringFormatShort(after_date) + '"]';
        const encode_after = btoa(after);
        //console.log("after", after, "encode_after", encode_after);

        const response = await fetch('/api/prev-exchange-rates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "from_date": from_date_str, "after": encode_after })
        });

        if (response.ok) {

          const { exchange_rates: { edges, pageInfo } } = await response.json();
          //console.log("edges", edges);

          setPrev({ title, date, edges });
          setPageTableInfo({ hasPreviousPage: pageInfo.hasPreviousPage, hasNextPage: true });
        }

      } catch (error) {
        console.error('prevMonth', error);
      }
    }, [prev]
  );

  const nextMonth = useCallback(

    async (to_date_str: string) => {

      try {

        setPrev(next);

        const before_date = getDateFromISOString(to_date_str);
        before_date.setMonth(before_date.getMonth() + 1);
        const title = getMonthYearFormat(before_date);
        const date = toISOStringFormatShort(before_date);

        before_date.setMonth(before_date.getMonth() + 1);
        const before = '["' + toISOStringFormatShort(before_date) + '"]';
        const encode_before = btoa(before);
        //console.log("before", before, "encode_before", encode_before);

        const response = await fetch('/api/next-exchange-rates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "to_date": date, "before": encode_before }),
        });
    
        if (response.ok) {
          
          const { exchange_rates: { edges, pageInfo } } = await response.json();
  
          setNext({ title, date, edges });
          setPageTableInfo({ hasPreviousPage: true, hasNextPage: pageInfo.hasNextPage });
        }

      } catch (error) {
        console.error('nextMonth', error);
      }
    }, [next]
  );

  return (
    <>
      <h5 className="mt-12 block text-xl font-medium text-gray-900 dark:text-gray-100">Valores de UF (CLF) por mes y año</h5>

      <div aria-description="Valores de UF (CLF) por mes y año" className="mt-6 flow-root">
        <div className="-my-2 overflow-x-auto lg:-mx-8">
          <div className="md:grid md:grid-cols-2 md:items-start md:gap-x-10 relative">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="flex items-center">
                <div className="mr-4">
                  <button type="button" className={`btn btn-outline-skin btn-1 btn-rounded btn-shadow ${!pageTableInfo.hasPreviousPage && 'invisible'}`} onClick={() => prevMonth(prev?.date ?? "")}>
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
                  <button type="button" className={`btn btn-outline-skin btn-1 btn-rounded btn-shadow ${!pageTableInfo.hasNextPage && 'invisible'}`} onClick={() => nextMonth(next?.date ?? "")}>
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
