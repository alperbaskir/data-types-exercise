import React, {useContext} from 'react';
import TableRow from '../models/tableRow';
import TableBody from './TableBody';
import { TableContext } from '../store/table-context';

const ChildTables: React.FC<{ row: TableRow; keys: string[]; type: string}> = (
  props
) => {
  const tableCtx = useContext(TableContext);
  // We use this component for recalling TableBody component recursievly
  // We need type prop for deciding to which delete method we use.
  return (
    <tbody>
      <TableBody
        row={props.row}
        keys={props.keys}
        onDelete={props.type === 'has_relatives' ? tableCtx.removeRelativeRow.bind(null,  props.row.data['Relative ID'], props.row.data['Patient ID']) : tableCtx.removePhoneRow.bind(null,  props.row.data['Phone ID'], props.row.data['ID of the relative'])}
        childRecordsType={props.type === 'has_relatives' ? 'has_phone' : ''} // We're in already kids level. one step deeper must be has_phone
      />
    </tbody>
  );
};

export default ChildTables;
