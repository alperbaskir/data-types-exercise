import React, { useContext, useEffect } from 'react';

import TableBody from './TableBody';
import { TableContext } from '../store/table-context';
import classes from './Table.module.css';
import TableHead from './TableHead';
import TableRow from '../models/tableRow';

const Table: React.FC = () => {
  // Table component is our zero point, we need to fetch initial data from context in here.
  const tableCtx = useContext(TableContext);

  useEffect(()=> {
    tableCtx.getInitialData();
  }, []);

  return (
    <table className={classes.grid}>
      {tableCtx.data.length >0 && <thead><TableHead columns={Object.keys(tableCtx.data[0].data)}></TableHead></thead>}
      <tbody>
      {tableCtx.data.length >0 && tableCtx.data.map((item: TableRow) => (
        <TableBody
          key={item.data.id + '_' + Math.random().toString()}
          row={item}
          keys={Object.keys(tableCtx.data[0].data)}
          onDelete={tableCtx.removeRow.bind(null, item.data['Identification number'])}
          childRecordsType={"has_relatives"} // for finding out which level we're in data structure.
        />
      ))}
      </tbody>
    </table>
  );
};

export default Table;
