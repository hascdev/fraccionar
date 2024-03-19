import React, { ChangeEvent, MouseEvent, useCallback, useRef, useState } from 'react'
import { Exchange_RatesEdge } from '~/types';

type Props = {
  edge: Exchange_RatesEdge | undefined;
  calcValue: number;
  resultValue: number;
  handleChangeResult: (event: ChangeEvent<HTMLInputElement>) => void;
  toExchange: (event: MouseEvent<HTMLButtonElement>) => void;
};

export default function Calculator(props: Props) {

  const { edge, calcValue, resultValue, handleChangeResult, toExchange } = props;

  const leftTitle = useRef<string>("UF (CLF)");
  const rightTitle = useRef<string>("Pesos (CLP)");

  const changeTitle = async (event: MouseEvent<HTMLButtonElement>) => {

    event.preventDefault();

    const newLeftTitle = rightTitle.current;
    const newRightTitle = leftTitle.current;

    leftTitle.current = newLeftTitle;
    rightTitle.current = newRightTitle;

    toExchange(event);
  }

  return (
    <>
      <h5 className="mt-12 block text-xl font-medium text-gray-900 dark:text-gray-100">Calculadora de {leftTitle.current} a {rightTitle.current}</h5>

      <div aria-description="Selector de unidades dentro del proyecto" className="mt-6 grid grid-cols-5 gap-2">

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{leftTitle.current}</label>
          <div className="mt-1">
            <input type="text" className="input input-4 sm:input-3 input-skin w-full" value={calcValue} onChange={handleChangeResult}></input>
          </div>
        </div>

        <div className="flex items-end justify-center">
          <button type="button" className="btn btn-skin btn-3 btn-rounded btn-shadow" onClick={changeTitle}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{rightTitle.current}</label>
          <div className="mt-1 px-3 py-2 w-full border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
            <span className="opacity-50">{resultValue?.toLocaleString('es-ES', { maximumFractionDigits: edge?.node.pair_decimals, minimumFractionDigits: edge?.node.pair_decimals })}</span>
          </div>
        </div>

      </div>
    </>
  )
}
