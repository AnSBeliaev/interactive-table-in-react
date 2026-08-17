// import mockData from './mock-data/medium_data.json';
import mockData from './mock-data/big_data.json';
import { Table } from './components';
import { STATIC_LEFT_COLUMNS, getStaticRightColumns } from './components/Table/constants/columns';
import { ThemeProvider } from './constext/theme-context';
import ToggleSwitch from './components/ThemeSwitch/ThemeSwitch';
import { SelectionProvider } from './constext/selection/SelectionProvider';

function App() {
  const rightColumns = getStaticRightColumns(true);
  return (
    <>
      <ThemeProvider>
        <ToggleSwitch />
        <SelectionProvider>
          <Table data={mockData.data} leftColumns={STATIC_LEFT_COLUMNS} rightColumns={rightColumns} />
        </SelectionProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
