import { ChangeEvent } from 'react'
import { Exchange_RatesEdge } from '~/types';
import { getReadableDateFormat } from '~/utils/date'

type Props = {
  edge: Exchange_RatesEdge | undefined;
  selectedDate: string;
  handleChangeDate: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
};

export default function CalculatorDayValue(props: Props) {

  const { edge, selectedDate, handleChangeDate } = props;

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
    </>
  )
}
