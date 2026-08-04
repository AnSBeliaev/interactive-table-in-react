import smallMockData from './mock-data/small_data.json';
import { Table } from './components';
import { STATIC_LEFT_COLUMNS, STATIC_RIGHT_COLUMNS } from './components/Table/constants/columns';

function App() {
  return (
    <>
      <Table data={smallMockData.data} leftColumns={STATIC_LEFT_COLUMNS} rightColumns={STATIC_RIGHT_COLUMNS} />
    </>
  );
}

export default App;
