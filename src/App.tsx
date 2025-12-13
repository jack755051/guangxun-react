import "./App.css";
import { Footer } from "./components/Footer";
import { selectFooterVM } from "./store/footer/footerSelectors";
import { useSelector } from "react-redux";

function App() {
  const footerVm = useSelector(selectFooterVM);
  return (
    <>
      <Footer {...footerVm} />
    </>
  );
}

export default App;
