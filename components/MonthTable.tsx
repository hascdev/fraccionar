import { toISOStringFormatShort } from '~/utils/date';
import { Exchange_RatesEdge } from '../types/index';
import MonthTableButtonCopy from './MonthTableButtonCopy';

type Props = {
  edges: Array<Exchange_RatesEdge>;
};

export default function MonthTable(props: Props) {

  return (
    <table className="mt-4 min-w-full divide-y divide-gray-300 dark:divide-skin-600">
      <thead>
        <tr>
          <th scope="col" className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 sm:pl-0">Fecha</th>
          <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Valor</th>
          <th scope="col" className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0">
            <span className="sr-only">Copiar</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-800 tabular-nums font-mono text-xs sm:text-sm">
        {
          props.edges.map(({ node }) => (
            <tr data-exchange_rate_id="848db744-c315-47c6-bc6e-0aecc97ec64f" className={node.pair_at === toISOStringFormatShort(new Date()) ? "text-skin-500" : "text-gray-900 dark:text-gray-100"} key={node.id}>
              <td className="whitespace-nowrap py-2 pl-4 pr-3 sm:pl-0">
                <time dateTime={node.pair_at} title={node.pair_at}>{node.pair_at}</time>
              </td>
              <td className="whitespace-nowrap px-2 py-2">{Number(node.pair_numeric).toLocaleString('es-ES', { maximumFractionDigits: node.pair_decimals, minimumFractionDigits: node.pair_decimals })}</td>
              <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right font-medium sm:pr-0">
                <MonthTableButtonCopy textToCopy={node.pair_numeric.replaceAll(".", ",")} />
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}
