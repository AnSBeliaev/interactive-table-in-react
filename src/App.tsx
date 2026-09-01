import mockData from './mock-data/big_data.json';
import { Table } from './components';
import { STATIC_LEFT_COLUMNS, getStaticRightColumns } from './components/Table/constants/columns';
import { ThemeProvider } from './constext/theme-context';
import ToggleSwitch from './components/ThemeSwitch/ThemeSwitch';

function App() {
  const rightColumns = getStaticRightColumns(true);
  return (
    <>
      <ThemeProvider>
        <ToggleSwitch />
        <Table data={mockData.data} leftColumns={STATIC_LEFT_COLUMNS} rightColumns={rightColumns} isBigData />
      </ThemeProvider>
    </>
  );
}

export default App;
