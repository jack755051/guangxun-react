import "./App.css";
import { Footer } from "./components/Footer";
import { selectFooterVM } from "./store/footer/footerSelectors";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchFooterConfig } from "./api/footer.api";
import { setFooterDato } from "./store/footer/footerSlice";

function App() {
  const dispatch = useDispatch();
  const footerVm = useSelector(selectFooterVM);

  // 在應用啟動時獲取 Footer 配置
  useEffect(() => {
    fetchFooterConfig()
      .then((dto) => {
        dispatch(setFooterDato(dto));
      })
      .catch((error) => {
        console.error("Failed to fetch footer config:", error);
        // 失敗時會使用 footerSelectors 中的 DEFAULT_FOOTER_VM
      });
  }, [dispatch]);

  return (
    <div>
      <Footer {...footerVm} />
    </div>
  );
}

export default App;
