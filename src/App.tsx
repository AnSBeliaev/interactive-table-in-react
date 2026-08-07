import smallMockData from './mock-data/small_data.json';
import { Table } from './components';
import { STATIC_LEFT_COLUMNS, STATIC_RIGHT_COLUMNS } from './components/Table/constants/columns';
import { ThemeProvider } from './constext/theme-context';
import ToggleSwitch from './components/ThemeSwitch/ThemeSwitch';
import { SelectionProvider } from './constext/selection/SelectionProvider';

function App() {
  return (
    <>
      <SelectionProvider>
        <ThemeProvider>
          <ToggleSwitch />
          <Table data={smallMockData.data} leftColumns={STATIC_LEFT_COLUMNS} rightColumns={STATIC_RIGHT_COLUMNS} />
        </ThemeProvider>
      </SelectionProvider>
    </>
  );
}

export default App;
