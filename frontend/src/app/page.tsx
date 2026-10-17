
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ImagePlus,
  Leaf,
  ShieldCheck,
  Sparkles,
  Sprout,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="page-content">
      <section className="page-heading">
        <div>
          <p className="eyebrow">YOUR PLANT HEALTH WORKSPACE</p>
          <h1>A clearer view of plant health.</h1>
          <p>
            Inspect a leaf, explore a prediction, and understand what the
            model can—and cannot—tell you.
          </p>
        </div>
        <Link className="button button-primary" href="/analyze">
          <ImagePlus size={16} />
          New analysis
        </Link>
      </section>

      <section className="hero-panel">
        <div className="hero-copy">
          <div className="hero-kicker">
            <Sparkles size={14} />
            A more thoughtful way to inspect leaves
          </div>
          <h2>Small details can tell a bigger story.</h2>
          <p>
            Upload a clear leaf photograph to explore one of 39 supported
            classes, including plant diseases and healthy leaves. Results are
            model predictions, not confirmed diagnoses.
          </p>
          <div className="hero-actions">
            <Link className="button button-light" href="/analyze">
              Analyze a leaf <ArrowRight size={15} />
            </Link>
            <Link className="button button-ghost" href="/library">
              Explore the library
            </Link>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="botanical-orbit">
            <div className="botanical-orbit-inner">
              <Sprout size={76} strokeWidth={0.9} />
            </div>
          </div>
        </div>
      </section>

      <div className="section-heading">
        <div>
          <h2>Model at a glance</h2>
          <p>Measured on the project&apos;s held-out test dataset.</p>
        </div>
        <Link href="/insights" className="button button-secondary">
          Evaluation details <ArrowRight size={14} />
        </Link>
      </div>

      <section className="metrics-grid" aria-label="Model metrics">
        <article className="metric-card">
          <div className="metric-top">
            Test accuracy
            <span className="metric-icon">
              <ShieldCheck size={17} />
            </span>
          </div>
          <div className="metric-value">98.42%</div>
          <div className="metric-note">
            Correct classifications in the existing held-out test set.
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-top">
            Macro F1
            <span className="metric-icon">
              <ArrowDownRight size={17} />
            </span>
          </div>
          <div className="metric-value">97.84%</div>
          <div className="metric-note">
            An average that gives each class equal weight.
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-top">
            Supported classes
            <span className="metric-icon">
              <Leaf size={17} />
            </span>
          </div>
          <div className="metric-value">39</div>
          <div className="metric-note">
            Includes the broad background class; not every class is a disease.
          </div>
        </article>
      </section>

      <section className="dashboard-lower">
        <article className="card">
          <div className="section-heading" style={{ marginTop: 0 }}>
            <div>
              <h2>Recent analyses</h2>
              <p>Images you have analyzed will appear here.</p>
            </div>
            <Link href="/history" className="button button-secondary">
              View history <ArrowRight size={14} />
            </Link>
          </div>

          <div className="empty-state">
            <div className="empty-icon">
              <ImagePlus size={21} />
            </div>
            <h3>A fresh start</h3>
            <p>
              Your scan history is stored in this browser after a successful
              analysis. No example activity is being shown as real data.
            </p>
            <Link href="/analyze" className="button button-primary">
              Analyze your first leaf
            </Link>
          </div>
        </article>

        <article className="card">
          <h2 className="card-title">Get a more useful result</h2>
          <p className="card-subtitle">
            A few simple choices can make the photo easier to inspect.
          </p>

          <div className="tip-row">
            <div className="tip-icon"><ImagePlus size={17} /></div>
            <div>
              <h3>Focus on one leaf</h3>
              <p>Fill the frame with the leaf and its visible symptoms.</p>
            </div>
          </div>

          <div className="tip-row">
            <div className="tip-icon"><Sparkles size={17} /></div>
            <div>
              <h3>Use clear, natural light</h3>
              <p>Avoid strong shadows, blur, and extreme color filters.</p>
            </div>
          </div>

          <div className="tip-row">
            <div className="tip-icon"><ShieldCheck size={17} /></div>
            <div>
              <h3>Keep an open mind</h3>
              <p>
                A confident prediction can still be wrong, especially for
                unfamiliar photographs.
              </p>
            </div>
          </div>
        </article>
      </section>

      <footer className="page-footer">
        Verdant is a research prototype for image classification. It does not
        confirm a disease, assess crop severity, or replace advice from a
        qualified plant-health specialist.
      </footer>
    </main>
  );
}
