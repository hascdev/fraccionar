import { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react'
import { Exchange_RatesEdge } from '~/types';
import { toISOStringFormatShort } from '~/utils/date';
import { truncateNumber, validateInputNumber } from '~/utils/number';
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

    const response = await fetch('/api/current-exchange-rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "pair_at": current_date })
    });

    if (response.ok) {

      const { exchange_rates: { edges } } = await response.json();
  
      setSelectedDate(current_date);
      const current_edge = edges[0];
      setEdge(current_edge);
      setCalcValue(1)
      setResultValue(1 * Number(current_edge?.node.pair_numeric));
    }

  }, []);

  useEffect(() => {
    initData();
  }, [initData]);

  const handleChangeDate = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();

      const { value } = event.target;

      const response = await fetch('/api/current-exchange-rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "pair_at": value })
      });
  
      if (response.ok) {

        const { exchange_rates: { edges } } = await response.json();
  
        setSelectedDate(value);
        const current_edge = edges[0];
        setEdge(current_edge);
  
        //console.log("calcValue", calcValue, "resultValue", resultValue);
        if (operator === Operators.multiplicar) {
          const new_result = calcValue * Number(current_edge?.node.pair_numeric);
          //console.log("new_result", new_result);
          setResultValue(Number(new_result.toFixed(2)));
        } else {
          const new_calc = resultValue * Number(current_edge?.node.pair_numeric);
          //console.log("new_calc", new_calc);
          setCalcValue(validateInputNumber(new_calc.toFixed(2).replaceAll(".", ",")));
        }
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
        
        let new_result = Number(value_numeric.replaceAll(",", ".")) / Number(edge?.node.pair_numeric);
        
        // Truncate when new_result == 0.996
        if (new_result < 1 && new_result.toFixed(2) === '1.00') {
          new_result = truncateNumber(new_result, 2); 
        }

        setResultValue(new_result);
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
      setOperator(operator === Operators.multiplicar ? Operators.dividir : Operators.multiplicar);

    }, [calcValue, resultValue, operator]
  );

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
