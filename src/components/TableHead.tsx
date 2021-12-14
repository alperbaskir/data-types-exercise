import React from "react";

const TableHead: React.FC<{ columns: string[];}> = (
  props
) => {
  // This component helps us to provide header of table with mapping string array.
  return (
    <React.Fragment>
    <tr>  
    <th></th>
      {props.columns.length > 0  && props.columns.map((column)=>(
         <th key={column.toString() + '_'+ Math.random().toString()}>{column}</th>
      ))}
     <th></th> 
    </tr>
    </React.Fragment>
  );
};

export default TableHead;
