import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import SingleJobCard from "./components/card/jobs/single-job-card.jsx";
import { Provider } from "react-redux";
import { store } from "./store.js";
import NavBar from "./pages/jobs/find-job-page.jsx"
import FindJob from "./pages/jobs/find-job-page.jsx";
import FreeLancerDetail from "./pages/jobs/bestfreelancer-details.jsx";
import SuccessStats from "./pages/jobs/successStates.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* <App /> */}
      {/* <SingleJobCard /> */}
      {/* <FreeLancerDetail></FreeLancerDetail> */}
       {/* <FindJob></FindJob>  */}
      <SuccessStats></SuccessStats>
    </Provider>
  </StrictMode>
);
