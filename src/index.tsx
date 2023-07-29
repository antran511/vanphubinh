import App from "./App";
import "./index.css";
import { LocaleProvider } from "@douyinfe/semi-ui";
import { Locale } from "@douyinfe/semi-ui/lib/es/locale/interface";
import vi_VN from "@douyinfe/semi-ui/lib/es/locale/source/vi_VN";
import React from "react";
import ReactDOM from "react-dom";

const local: Locale = {
  ...vi_VN,
  DatePicker: {
    ...vi_VN.DatePicker,
    selectDate: "Quay lại",
    selectTime: "Chọn thời gian",
    monthText: "${month}/${year}",
    months: {
      1: "01",
      2: "02",
      3: "03",
      4: "04",
      5: "05",
      6: "06",
      7: "07",
      8: "08",
      9: "09",
      10: "10",
      11: "11",
      12: "12",
    },
    fullMonths: {
      1: "01",
      2: "02",
      3: "03",
      4: "04",
      5: "05",
      6: "06",
      7: "07",
      8: "08",
      9: "09",
      10: "10",
      11: "11",
      12: "12",
    },
    weeks: {
      Mon: "T2",
      Tue: "T3",
      Wed: "T4",
      Thu: "T5",
      Fri: "T6",
      Sat: "T7",
      Sun: "CN",
    },
  },
  Table: {
    emptyText: "Không kết quả",
    pageText: "Hiển thị ${currentStart} - ${currentEnd} trong tổng ${total}",
  },
};

ReactDOM.render(
  <React.StrictMode>
    <LocaleProvider locale={local}>
      <App />
    </LocaleProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
