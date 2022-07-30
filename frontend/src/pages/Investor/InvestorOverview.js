import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import DrawdownCard from "../../tools/Card/DrawdownCard";
import RepaymentCard from "../../tools/Card/RepaymentCard";
import PoolCard from "./components/Cards/PoolCard";
import PieGraph from "../../investor/components/PieChart";
import GradientButton from "../../tools/Button/GradientButton";
import BorrowChart from "../../components/charts/BorrowChart";

const InvestorOverview = () => {
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
            style={{ fontSize: 28 }}
          >
            Investor Dashboard
          </h2>
          <GradientButton className={"w-40"}>+ Invest</GradientButton>
        </div>
      </div>

      <div className="flex-row items-center" style={{ display: "flex" }}>
        <div
          className="flex-row rounded-box justify-around bg-[#191D23]  "
          style={{ display: "flex", height: 278, width: 584 }}
        >
          <div
            style={{ display: "flex", marginLeft: -80, marginTop: -10 }}
            className="justify-start"
          >
            <PieGraph />
          </div>
          <div
            style={{ display: "flex", color: "red", marginLeft: -200 }}
            className="flex-col justify-center"
          >
            <div style={{ fontSize: 14, fontWeight: 400, color: "#777E91" }}>
              Total Amount Invested
            </div>
            <div style={{ fontSize: 28, color: "white" }} className="mb-10">
              345K USDC
            </div>
            <div style={{ fontSize: 14, fontWeight: 400, color: "#777E91" }}>
              Total Yield Earned
            </div>
            <div style={{ fontSize: 28, color: "white" }}>35K USDC</div>
          </div>
        </div>
        <div
          className="justify-center items-center rounded-box bg-[#191D23] w-50 ml-5 "
          style={{ display: "flex", height: 278, width: 584 }}
        >
          <BorrowChart />
        </div>
      </div>
      <div style={{ fontSize: 23 }} className="mt-5 mb-3">
        Your Investments
      </div>
      <div className="mb-16 ">
        <h2 style={{ fontSize: 24 }} className=" mb-5">
          Senior Pool
        </h2>
        <div style={{ display: "flex" }} className="gap-4">
          {repayment.map((item) => (
            <PoolCard />
          ))}
        </div>
      </div>
      <div className="mb-16">
        <h2 className="text-xl mb-5" style={{ fontSize: 24 }}>
          Junior Pool
        </h2>
        <div style={{ display: "flex" }} className=" gap-4">
          {data.map((item) => (
            <PoolCard />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorOverview;
<h2>InvestorOverview</h2>;
