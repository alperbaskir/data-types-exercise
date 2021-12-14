import Table from './components/Table';
import TableDataContext from './store/table-context';

function App() {
  return (
    <TableDataContext>
      <Table />
    </TableDataContext>
  );
}

export default App;
