import { Exchange_RatesEdge } from '../types/index';

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
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-800 tabular-nums font-mono text-xs sm:text-sm">
        {
          props.edges.map(({ node }) => (
            <tr data-exchange_rate_id="848db744-c315-47c6-bc6e-0aecc97ec64f" className="text-gray-900 dark:text-gray-100" key={node.id}>
              <td className="whitespace-nowrap py-2 pl-4 pr-3 sm:pl-0">
                <time dateTime={node.pair_at} title={node.pair_at}>{node.pair_at}</time>
              </td>
              <td className="whitespace-nowrap px-2 py-2">{Number(node.pair_numeric).toLocaleString('es-ES', { maximumFractionDigits: node.pair_decimals, minimumFractionDigits: node.pair_decimals })}</td>
              <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right font-medium sm:pr-0">
                <button type="button" className="text-skin-600 hover:text-skin-900">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                  </svg>
                </button>
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}
