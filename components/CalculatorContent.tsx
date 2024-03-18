import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { getCurrentExchangeRates } from '~/pages/api/exchange_rates';
import { Exchange_RatesEdge } from '~/types';
import { getReadableDateFormat, toISOStringFormatShort } from '~/utils/date';

export default function CalculatorContent() {

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [edge, setEdge] = useState<Exchange_RatesEdge>();
  const [calcValue, setCalcValue] = useState<number>(1);
  const [resultValue, setResultValue] = useState<number>();

  const initData = useCallback(async () => {

    const current_date = toISOStringFormatShort(new Date());
    const { exchange_rates: { edges } } = await getCurrentExchangeRates(current_date);

    setSelectedDate(current_date);
    const current_edge = edges[0];
    setEdge(current_edge);
    setResultValue(calcValue * Number(current_edge?.node.pair_numeric));

  }, []);

  useEffect(() => {
    initData();
  }, [initData]);

  const handleChangeDate = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      const { value } = event.target;
      const { exchange_rates: { edges } } = await getCurrentExchangeRates(value);

      setSelectedDate(value);
      const current_edge = edges[0];
      setEdge(current_edge);
      setResultValue(calcValue * Number(current_edge?.node.pair_numeric));

    }, [calcValue]
  );

  const handleChangeCalcValue = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      const { value } = event.target;
      console.log("value", value);

      const value_numeric = validateInputNumber(value);
      console.log("value_numeric", value_numeric);
      setCalcValue(value_numeric);

      const pair_numeric = Number(edge?.node.pair_numeric);
      console.log("pair_numeric", pair_numeric);
      setResultValue(Number(value_numeric.replaceAll(",", ".")) * pair_numeric);

    }, [edge]
  );

  const validateInputNumber = (inputValue: any) => {

    var regex = /^\d+[,]?\d{0,2}$/;

    if (regex.test(inputValue)) {
      return inputValue;
    } else {
      return inputValue.substring(0, inputValue.length - 1);
    }
  }

  return (
    <>

      <div aria-description="Selector de fecha" className="mt-12 relative w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prueba con distintas fechas</label>
        <input id="date" name="date" type="date" className="mt-1 input input-4 sm:input-3 input-skin w-full sm:max-w-xs" onChange={handleChangeDate} defaultValue={selectedDate}></input>
      </div>

      <div aria-description="Valor de la UF" className="mt-6 relative w-full">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor del día
          <time className="text-skin-600" title={getReadableDateFormat(selectedDate)} suppressHydrationWarning> {getReadableDateFormat(selectedDate)}</time>
        </label>
        <div className="relative mt-1 px-3 py-2 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
          <div className="flex flex-row flex-wrap items-center justify-center">
            <p className="mt-0 text-2xl sm:text-3xl tracking-tight text-gray-900 dark:text-gray-100 flex flex-row flex-wrap items-baseline px-4 my-1">
              <span className="tabular-nums font-semibold mr-2">1</span>
              <span className="text-gray-600 dark:text-gray-400 text-xl sm:text-2xl leading-none block"> UF</span>
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
            <p className="mt-0 text-2xl sm:text-3xl tracking-tight text-gray-900 dark:text-gray-100 flex flex-row flex-wrap items-baseline px-4 my-1">
              <span className="tabular-nums font-semibold mr-2">{Number(edge?.node.pair_numeric).toLocaleString('es-ES', { maximumFractionDigits: edge?.node.pair_decimals, minimumFractionDigits: edge?.node.pair_decimals })}</span>
              <span className="text-gray-600 dark:text-gray-400 text-xl sm:text-2xl leading-none block"> Pesos</span>
            </p>
          </div>
        </div>
      </div>

      <h5 className="mt-12 block text-xl font-medium text-gray-900 dark:text-gray-100">Calculadora de UF (CLF) a Peso (CLP)</h5>

      <div aria-description="Selector de unidades dentro del proyecto" className="mt-6 grid grid-cols-5 gap-2">

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">UF (CLF)</label>
          <div className="mt-1">
            <input type="text" className="input input-4 sm:input-3 input-skin w-full" value={calcValue} onChange={handleChangeCalcValue}></input>
          </div>
        </div>

        <div className="flex items-end justify-center">
          <button type="button" className="btn btn-skin btn-3 btn-rounded btn-shadow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pesos (CLP)</label>
          <div className="mt-1 px-3 py-2 w-full border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
            <span className="opacity-50">{resultValue?.toLocaleString('es-ES', { maximumFractionDigits: edge?.node.pair_decimals, minimumFractionDigits: edge?.node.pair_decimals })}</span>
          </div>
        </div>

      </div>
    </>
  )
}
