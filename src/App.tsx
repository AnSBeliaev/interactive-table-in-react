import mockData from './mock-data/medium_data.json';
import { Table } from './components';
import { STATIC_LEFT_COLUMNS, STATIC_RIGHT_COLUMNS } from './components/Table/constants/columns';
import { ThemeProvider } from './constext/theme-context';
import ToggleSwitch from './components/ThemeSwitch/ThemeSwitch';
import { SelectionProvider } from './constext/selection/SelectionProvider';

function App() {
  return (
    <>
      <ThemeProvider>
        <ToggleSwitch />
        <SelectionProvider>
          <Table data={mockData.data} leftColumns={STATIC_LEFT_COLUMNS} rightColumns={STATIC_RIGHT_COLUMNS} />
        </SelectionProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
