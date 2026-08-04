import smallMockData from './mock-data/small_data.json';
import { Table } from './components';
import { STATIC_COLUMNS } from './components/Table/constants/columns';

function App() {
  return (
    <>
      <Table data={smallMockData.data.documents} columns={STATIC_COLUMNS} />
    </>
  );
}

export default App;
