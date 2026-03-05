// App.js

import { HashRouter, Route, Routes } from "react-router-dom";
import Main from "./Main";
import { ExportComponent } from "./components/export/export";
import { ImportImageComponent } from "./components/import/importImage";


const App = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/export" element={<ExportComponent />} />
                <Route path="/import" element={<ImportImageComponent />} />
                
            </Routes>
        </HashRouter>
    );
};
export default App;