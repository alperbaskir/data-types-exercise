import React, { useState } from 'react';
import TableRow from '../models/tableRow';
import dummyData from '../example-data.json'

type TableContextObj = {
  data: TableRow[];
  removeRow: (id: string) => void;
  getInitialData: () => void,
  removePhoneRow: (phoneId: string, relativeId: string) => void;
  removeRelativeRow: (relativeId: string, patientId: string) => void;
};

export const TableContext = React.createContext<TableContextObj>({
  data: [],
  removeRow: (id: string) => {},
  getInitialData: () => {},
  removePhoneRow: (phoneId: string, relativeId: string) => {},
  removeRelativeRow: (relativeId: string, patientId: string) => {}
});

const TableContextProvider: React.FC = (props) => {
  const [tableRow, setTableRow] = useState<TableRow[]>([]);
  // We use 3 different remove method for diffferent level of data.
  const removeRowHandler = (rowId: string) => { // For removing root level data
    setTableRow((prevTableRow) => {
      return prevTableRow.filter((row) => row.data['Identification number'] !== rowId);
    });
  };
  const removePhoneRowHandler = (phoneId: string, relativeId: string) => { // For removing deepest level data
    const tempTableRow = [...tableRow]; // for following immutable patern
    let modifiedRelatives: TableRow[] = [];
    let modifiedPhones: TableRow[] = [];
    let rowIndex = 0;
    let relativeIndex = 0;
    // We need the find out current root level first then we will change has_phone records.
    tempTableRow.forEach((row,index)=> {
      if(row.kids['has_relatives']) {
        row.kids['has_relatives'].records.forEach((relative, kidsIndex)=> {
          if(relative.data['Relative ID'] === relativeId) {
            rowIndex = index;
            relativeIndex = kidsIndex;
            modifiedPhones= relative.kids['has_phone'].records.filter((phone)=> phone.data['Phone ID'] !== phoneId);
          }
        })
      }
    });
    // We need to split current row first then we will modify kids levels
    let currentRow = tempTableRow.splice(rowIndex,1);
    let tempRelatives = [...currentRow[0].kids.has_relatives.records]; // for saving first forms of has_relative level
    modifiedRelatives = currentRow[0].kids.has_relatives.records.splice(relativeIndex,1);
    modifiedRelatives[0].kids.has_phone.records = modifiedPhones
    tempRelatives.splice(relativeIndex,1);
    tempRelatives.splice(relativeIndex, 0, modifiedRelatives[0])
    const modifiedRow = {data:currentRow[0].data, kids:{has_relatives: {records: [...tempRelatives]}}};
    tempTableRow.splice(rowIndex, 0, modifiedRow);
    setTableRow(tempTableRow);
  };
  const removeRelativeRowHandler = (relativeId: string, patientId: string) => { // For removing has_relatives level data
    const tempTableRow = [...tableRow]; // for following immutable patern
    // We need to split current row first then we will modify has_relatives records.
    const index = tempTableRow.findIndex((row) => row.data['Identification number'] === patientId);
    let currentRow = tempTableRow.filter((row) => row.data['Identification number'] === patientId);
    let otherRows = tempTableRow.filter((row) => row.data['Identification number'] !== patientId);
    if(currentRow[0].kids.has_relatives.records.length === 1) { // if we have only one relative, we assing empty object to kids directly
      otherRows.splice(index, 0, {data:currentRow[0].data, kids: {}});
    } else {
      const modifiedKids = currentRow[0].kids.has_relatives.records.filter(relative=> relative.data['Relative ID'] !== relativeId);
      const modifiedRow = {data:currentRow[0].data, kids: {has_relatives :{ records: [modifiedKids[0]]}} };
      otherRows.splice(index, 0, modifiedRow);
    }
    setTableRow(otherRows)
  };
  
  const prepareData = (dummyData: any[]): TableRow[] => { // preparing data recursievly
    var output: TableRow[] = [];
    dummyData.forEach(row => {
        if (row.hasOwnProperty('data') && row.hasOwnProperty('kids')) {
            let data: Record<string, string> = row.data;
            let rowKids: Record<string, { records: TableRow[] }> = {};
            if (Object.keys(row.kids).length > 0) {
              if(row.kids['has_relatives']) {
                const key = 'has_relatives'
                let kids: TableRow[] =  prepareData(row.kids['has_relatives'].records);
                rowKids[key] = {records: kids};
              }
              if(row.kids['has_phone']) {
                const key = 'has_phone'
                let kids: TableRow[] =  prepareData(row.kids['has_phone'].records);
                rowKids[key] = {records: kids};
              }
            }
            output.push({data: data, kids: rowKids});
        }
    })
    return output;
  }

  const initialDataHandler = () => { // We use example-data json file for initialy. 
    const preparedData = prepareData(dummyData);
    setTableRow(preparedData)
  }

  const contextValue: TableContextObj = {
    data: tableRow,
    removeRow: removeRowHandler,
    getInitialData: initialDataHandler,
    removePhoneRow: removePhoneRowHandler,
    removeRelativeRow: removeRelativeRowHandler
  };

  return (
    <TableContext.Provider value={contextValue}>
      {props.children}
    </TableContext.Provider>
  );
};

export default TableContextProvider;