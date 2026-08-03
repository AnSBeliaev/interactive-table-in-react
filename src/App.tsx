import smallMockData from "./mock-data/small_data.json";

import { Table } from "./components";

function App() {
  return (
    <>
      <Table data={smallMockData.data} />
    </>
  )
}

export default App
