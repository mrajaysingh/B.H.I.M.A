import { useEffect } from 'react';
import AppLayout from './components/layout/AppLayout';
import { useSettingsStore } from './store/settingsStore';

function App() {
  const { settings } = useSettingsStore();
  
  // Update the document title
  useEffect(() => {
    document.title = 'Personal AI Assistant';
    
    // Apply theme to html element
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);
  
  return <AppLayout />;
}

export default App;