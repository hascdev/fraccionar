import React, { ChangeEvent, ClipboardEvent, MouseEvent, useCallback, useEffect, useState } from 'react'
import { getCurrentExchangeRates } from '~/pages/api/exchange_rates';
import { Exchange_RatesEdge } from '~/types';
import { toISOStringFormatShort } from '~/utils/date';
import { validateInputNumber } from '~/utils/number';
import CalculatorDayValue from './CalculatorDayValue';
import Calculator from './Calculator';

enum Operators {
  multiplicar, dividir 
}

export default function CalculatorContent() {

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [edge, setEdge] = useState<Exchange_RatesEdge>();
  const [calcValue, setCalcValue] = useState<number>(1);
  const [resultValue, setResultValue] = useState<number>(0);
  const [operator, setOperator] = useState<Operators>(Operators.multiplicar);

  const initData = useCallback(async () => {

    const current_date = toISOStringFormatShort(new Date());
    const { exchange_rates: { edges } } = await getCurrentExchangeRates(current_date);

    setSelectedDate(current_date);
    const current_edge = edges[0];
    setEdge(current_edge);
    setCalcValue(1)
    setResultValue(1 * Number(current_edge?.node.pair_numeric));

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

      //console.log("calcValue", calcValue, "resultValue", resultValue);
      if (operator === Operators.multiplicar) {
        const new_result = calcValue * Number(current_edge?.node.pair_numeric);
        setResultValue(Number(new_result.toFixed(2)));
      } else {
        const new_calc = resultValue * Number(current_edge?.node.pair_numeric);
        setCalcValue(validateInputNumber(new_calc.toFixed(2).replaceAll(".", ",")));
      }
      
    }, [calcValue, resultValue, operator]
  );

  const handleChangeResult = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      const { value } = event.target;
      const value_numeric = validateInputNumber(value);      
      setCalcValue(value_numeric);

      if (operator === Operators.multiplicar) {
        setResultValue(Number(value_numeric.replaceAll(",", ".")) * Number(edge?.node.pair_numeric));
      } else {
        setResultValue(Number(value_numeric.replaceAll(",", ".")) / Number(edge?.node.pair_numeric));
      }

    }, [edge, operator]
  );

  const toExchange = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      const last_result = validateInputNumber(resultValue.toFixed(2).replaceAll(".", ","));  
      const last_calc = calcValue.toString().replaceAll(",", ".");

      setCalcValue(last_result);
      setResultValue(Number(last_calc));
      setOperator(Operators.dividir);

    }, [calcValue, resultValue]
  );

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = event.clipboardData.getData('Text');
    setCalcValue(validateInputNumber(value));
  };

  return (
    <>
      <CalculatorDayValue 
        edge={edge} 
        selectedDate={selectedDate} 
        handleChangeDate={handleChangeDate} />

      <Calculator 
        edge={edge} 
        calcValue={calcValue} 
        resultValue={resultValue} 
        handleChangeResult={handleChangeResult}
        toExchange={toExchange} />
    </>
  )
}
