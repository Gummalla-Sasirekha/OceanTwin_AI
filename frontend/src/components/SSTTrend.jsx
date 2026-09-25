import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function SSTTrend() {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/sst-trend")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch SST trend");
        }

        return response.json();
      })
      .then((data) => {
        setTrendData(data.trend || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load SST trend data.");
        setLoading(false);
      });
  }, []);

  return (
    <section className="sst-trend-section">

      <div className="sst-trend-header">
        <div>
          <h2>Sea Surface Temperature Trend</h2>
          <p>
            Monthly average SST for the Arabian Sea — 2020
          </p>
        </div>

        <div className="sst-source">
          NASA MUR SST v4.2
        </div>
      </div>

      {loading && (
        <div className="sst-trend-message">
          Loading SST trend...
        </div>
      )}

      {error && (
        <div className="sst-trend-message error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="sst-chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={trendData}
              margin={{
                top: 20,
                right: 30,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                domain={["auto", "auto"]}
                label={{
                  value: "SST (°C)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              <Tooltip
                formatter={(value) => [
                  `${Number(value).toFixed(3)} °C`,
                  "SST",
                ]}
              />

              <Line
                type="monotone"
                dataKey="sst"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

    </section>
  );
}

export default SSTTrend;