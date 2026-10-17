
"use client";

import { useEffect, useState } from "react";
import { History, Trash2 } from "lucide-react";

type ScanRecord = {
  id: string;
  filename: string;
  created_at: string;
  prediction: string;
  confidence: number;
};

function formatLabel(value: string) {
  return value.replace("___", " — ").replaceAll("_", " ");
}

export default function HistoryPage() {
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setRecords(
        JSON.parse(
          localStorage.getItem("verdant-scan-history") ?? "[]",
        ),
      );
    } catch {
      setRecords([]);
    } finally {
      setReady(true);
    }
  }, []);

  function clearHistory() {
    localStorage.removeItem("verdant-scan-history");
    setRecords([]);
  }

  return (
    <main className="page-content">
      <section className="page-heading">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>Scan history.</h1>
          <p>
            Review previous predictions saved in this browser. This is local
            browser history, not a cloud account or a medical record.
          </p>
        </div>

        {records.length > 0 && (
          <button
            className="button button-secondary"
            onClick={clearHistory}
            type="button"
          >
            <Trash2 size={15} />
            Clear history
          </button>
        )}
      </section>

      <section className="card">
        <div className="section-heading" style={{ marginTop: 0 }}>
          <div>
            <h2>Previous analyses</h2>
            <p>{records.length} saved scan{records.length === 1 ? "" : "s"}</p>
          </div>
          <span className="neutral-badge">This browser only</span>
        </div>

        {!ready ? (
          <div className="empty-state">Loading local history…</div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><History size={21} /></div>
            <h3>No scans yet</h3>
            <p>
              After a successful analysis, its filename, date, prediction and
              score will appear here.
            </p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Predicted class</th>
                  <th>Model score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.filename}</td>
                    <td>{formatLabel(record.prediction)}</td>
                    <td>{(record.confidence * 100).toFixed(2)}%</td>
                    <td>
                      {new Date(record.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="page-footer">
        Clearing history removes only this browser&apos;s saved scan metadata.
        It does not affect the model, dataset, or server logs.
      </footer>
    </main>
  );
}
