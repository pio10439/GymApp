import React from "react";
import AppNavigation from './src/assets/navigation';
import { PaperProvider, Provider } from "react-native-paper";

function App () {
  return(
    <PaperProvider>
      <AppNavigation/>
    </PaperProvider>
  )
}

export default App;