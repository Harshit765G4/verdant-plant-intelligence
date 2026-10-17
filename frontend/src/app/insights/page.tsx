
import Link from "next/link";
import { ArrowRight, ChartNoAxesCombined, ShieldCheck } from "lucide-react";

const weakerClasses = [
  {
    name: "Tomato — Early blight",
    recall: "86.00%",
    f1: "89.27%",
  },
  {
    name: "Corn — Cercospora / Gray leaf spot",
    recall: "87.01%",
    f1: "84.28%",
  },
  {
    name: "Corn — Northern Leaf Blight",
    recall: "88.44%",
    f1: "88.74%",
  },
  {
    name: "Tomato — Leaf Mold",
    recall: "95.10%",
    f1: "96.45%",
  },
];

export default function InsightsPage() {
  return (
    <main className="page-content">
      <section className="page-heading">
        <div>
          <p className="eyebrow">EVALUATION & TRANSPARENCY</p>
          <h1>Model insights.</h1>
          <p>
            A concise view of the existing evaluation results and the
            limitations that matter when interpreting a prediction.
          </p>
        </div>
        <span className="neutral-badge">
          <ChartNoAxesCombined size={14} /> Evaluation summary
        </span>
      </section>

      <section className="metrics-grid">
        <article className="metric-card">
          <div className="metric-top">Test accuracy</div>
          <div className="metric-value">98.42%</div>
          <div className="metric-note">8,314 held-out test images.</div>
        </article>
        <article className="metric-card">
          <div className="metric-top">Macro F1</div>
          <div className="metric-value">97.84%</div>
          <div className="metric-note">Each class contributes equally.</div>
        </article>
        <article className="metric-card">
          <div className="metric-top">Weighted F1</div>
          <div className="metric-value">98.42%</div>
          <div className="metric-note">Weighted by class support.</div>
        </article>
      </section>

      <section className="card" style={{ marginTop: 18 }}>
        <div className="section-heading" style={{ marginTop: 0 }}>
          <div>
            <h2>Classes to investigate</h2>
            <p>Recall and F1 from the existing held-out test evaluation.</p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Recall</th>
                <th>F1 score</th>
              </tr>
            </thead>
            <tbody>
              {weakerClasses.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>{item.recall}</td>
                  <td>{item.f1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" style={{ marginTop: 18 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <ShieldCheck size={23} color="#315d3f" />
          <div>
            <h2 className="card-title">How to interpret these numbers</h2>
            <p className="card-subtitle">
              These results describe the model&apos;s performance on the
              project&apos;s held-out test dataset. They do not demonstrate
              equivalent performance on arbitrary photographs from the
              internet or on field images.
            </p>
            <p className="card-subtitle">
              The model produces softmax scores. Those scores are not
              calibrated probabilities that a disease diagnosis is correct.
            </p>
            <Link
              href="/analyze"
              className="button button-primary"
              style={{ marginTop: 14 }}
            >
              Try an analysis <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="page-footer">
        These results are preserved from the existing evaluation. Any new
        training experiment should be selected using validation results, not
        by repeatedly tuning against the held-out test set.
      </footer>
    </main>
  );
}
