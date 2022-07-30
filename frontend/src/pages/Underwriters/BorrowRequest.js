import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import ViewPoolCard from "../Investor/components/Cards/ViewPoolCard";

const BorrowRequest = () => {
  const [data, setData] = useState([]);
  const [repayment, setRepayment] = useState([]);

  useEffect(() => {
    fetch("/drawdown.json")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  useEffect(() => {
    fetch("/repayment.json")
      .then((res) => res.json())
      .then((data) => setRepayment(data));
  }, []);

  return (
    <div>
      <div className="px-5">
        <div
          style={{ display: "flex" }}
          className="items-center justify-between mb-14 "
        >
          <h2
            className="text-left font-bold text-white"
            style={{ fontSize: 28, marginLeft: -20 }}
          >
            Underwriter's Dashboard
          </h2>
        </div>
      </div>

      <div className="mb-16 ">
        <div style={{ display: "flex" }} className="gap-4">
          {repayment.map((item) => (
            <ViewPoolCard />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BorrowRequest;
<h2>Invest</h2>;
