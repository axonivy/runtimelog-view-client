import type { RuntimeLogViewData } from '@axonivy/log-view-protocol';
import { View } from './view/View';
import './App.css';

function App(props: RuntimeLogViewData) {
  return <View {...props} />;
}

export default App;
