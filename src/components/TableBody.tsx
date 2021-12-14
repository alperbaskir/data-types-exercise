import React, { useState } from 'react';
import TableRow from '../models/tableRow';
import ChildTables from './ChildTables';
import TableHead from './TableHead';
import classes from './TableBody.module.css';
const TableBody: React.FC<{ row: TableRow; keys: string[]; onDelete: () => void; childRecordsType:string }> = (
  props
) => {
  const [toggleChildRecords, setToggleChildRecords] = useState(false);
  const showChildRecordsHandlerHandler = () => {
    setToggleChildRecords((prevState)=> {return !prevState});
  }
  // We use TableBody component recursively for root level, kids>has_relatives level and kids>has_phone level. 
  // For finding out which level we are, we expect childRecordsType props as a mark
  return (
        <React.Fragment>
        <tr>
           <td>
             {(props.row.kids.has_relatives && props.row.kids.has_relatives.records.length > 0) || (props.row.kids.has_phone && props.row.kids.has_phone.records.length > 0) ?  <button className={classes.toggleButton} onClick={showChildRecordsHandlerHandler}>Show/Hide</button> : ''}
            </td>
          {props.keys.map((keyName)=>(
            <td key={keyName.toString() + '_'+ Math.random().toString()}>{props.row.data[keyName]}</td>
          ))}
          <td><button className={classes.deleteButton} onClick={props.onDelete}>Delete</button></td>
        </tr>
        {toggleChildRecords &&
        <tr><td colSpan={12}>
        <table className={classes.childTable}>
        {toggleChildRecords && props.childRecordsType === 'has_relatives' && <thead><TableHead columns={Object.keys(props.row.kids.has_relatives.records[0].data)}/></thead> }
        {toggleChildRecords && props.childRecordsType === 'has_relatives'&& props.row.kids.has_relatives.records.map((item)=>(
          <ChildTables
          row = {item}
          key={item.data['Relative ID'].toString() + '_'+ Math.random().toString()}
          keys={Object.keys(item.data)}
          type={'has_relatives'}
          />
        ))
        }
        {toggleChildRecords && props.childRecordsType === 'has_phone' && <thead><TableHead columns={Object.keys(props.row.kids.has_phone.records[0].data)}/></thead>}
        {toggleChildRecords && props.childRecordsType === 'has_phone'&& props.row.kids.has_phone.records.map((item)=>(
          <ChildTables
          row = {item}
          key={item.data['Phone ID'].toString() + '_'+ Math.random().toString()}
          keys={Object.keys(item.data)}
          type={'has_phone'}
          />
        ))
        }
        </table>
        </td></tr> 
        }

        </React.Fragment>
  );
};

export default TableBody;
