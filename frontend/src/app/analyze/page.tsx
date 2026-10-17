"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileImage,
  ImagePlus,
  LoaderCircle,
  RefreshCw,
  ScanSearch,
  ShieldAlert,
  Upload,
} from "lucide-react";

type Prediction = {
  class_name: string;
  confidence: number;
};

type ApiResult = {
  prediction: Prediction;
  top_predictions: Prediction[];
  is_background?: boolean;
  message?: string | null;
  device?: string;
};

type ScanRecord = {
  id: string;
  filename: string;
  created_at: string;
  prediction: string;
  confidence: number;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

function formatLabel(value: string) {
  return value.replace("___", " — ").replaceAll("_", " ");
}

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function chooseFile(candidate?: File) {
    setError("");
    setResult(null);

    if (!candidate) return;

    if (!candidate.type.startsWith("image/")) {
      setError("Choose an image file, such as JPG, PNG, or WebP.");
      return;
    }

    if (candidate.size > 10 * 1024 * 1024) {
      setError(
        "This file is larger than 10 MB. Please choose a smaller image.",
      );
      return;
    }

    setFile(candidate);
  }

  async function analyze() {
    if (!file) {
      setError("Choose a leaf image before starting the analysis.");
      return;
    }

    setBusy(true);
    setError("");
    setResult(null);

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch(`${API_BASE}/api/predict`, {
        method: "POST",
        body,
      });

      if (!response.ok) {
        let detail = `The model service returned an error (${response.status}).`;

        try {
          const data = await response.json();
          if (typeof data.detail === "string") detail = data.detail;
        } catch {
          // Keep the readable fallback error.
        }

        throw new Error(detail);
      }

      const data = (await response.json()) as ApiResult;

      if (
        !data.prediction ||
        typeof data.prediction.class_name !== "string" ||
        !Array.isArray(data.top_predictions)
      ) {
        throw new Error("The model service returned an unexpected response.");
      }

      setResult(data);

      const record: ScanRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        filename: file.name,
        created_at: new Date().toISOString(),
        prediction: data.prediction.class_name,
        confidence: data.prediction.confidence,
      };

      try {
        const existing: ScanRecord[] = JSON.parse(
          localStorage.getItem("verdant-scan-history") ?? "[]",
        );
        localStorage.setItem(
          "verdant-scan-history",
          JSON.stringify([record, ...existing].slice(0, 100)),
        );
      } catch {
        // Prediction should still be shown if browser storage is unavailable.
      }
    } catch (exception) {
      setError(
        exception instanceof Error
          ? `${exception.message} Make sure the FastAPI service is running.`
          : "Analysis failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  const isBackground =
    result?.is_background === true ||
    result?.prediction.class_name === "Background_without_leaves";

  return (
    <main className="page-content">
      <section className="page-heading">
        <div>
          <p className="eyebrow">IMAGE ANALYSIS</p>
          <h1>Take a closer look.</h1>
          <p>
            Use a clear leaf photograph to explore a prediction from the trained
            classification model.
          </p>
        </div>
        <span className="neutral-badge">JPG · PNG · WEBP · Up to 10 MB</span>
      </section>

      <div className="content-grid">
        <section className="card">
          <h2 className="card-title">Your image</h2>
          <p className="card-subtitle">
            Select a photograph from your device. Your original image is not
            saved to scan history.
          </p>

          <div style={{ marginTop: 19 }}>
            {preview ? (
              <div>
                <Image
                  className="preview-image"
                  src={preview}
                  alt="Selected leaf for analysis"
                  width={1000}
                  height={800}
                  unoptimized
                />
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 10,
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 13,
                  }}
                >
                  <span className="card-subtitle">{file?.name}</span>
                  <button
                    className="button button-secondary"
                    onClick={() => {
                      setFile(null);
                      setResult(null);
                      setError("");
                    }}
                    type="button"
                  >
                    <RefreshCw size={14} />
                    Clear result
                  </button>
                </div>
                <label
                  className="button button-secondary"
                  htmlFor="leaf-file"
                  style={{ marginTop: 12, cursor: "pointer" }}
                >
                  <Upload size={15} />
                  Choose another image
                </label>
              </div>
            ) : (
              <label
                className="upload-zone"
                htmlFor="leaf-file"
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  chooseFile(event.dataTransfer.files?.[0]);
                }}
                style={
                  dragging
                    ? { borderColor: "#557d4d", background: "#edf4e5" }
                    : undefined
                }
              >
                <span className="empty-icon">
                  <ImagePlus size={22} />
                </span>
                <h3>Drop an image here, or browse</h3>
                <p>
                  For the most useful result, start with a single, sharp leaf
                  and visible details.
                </p>
                <span className="button button-secondary">
                  <Upload size={15} />
                  Choose image
                </span>
              </label>
            )}

            <input
              id="leaf-file"
              className="file-input-hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0];
                console.log("Selected image:", selectedFile);
                chooseFile(selectedFile);
              }}
            />
          </div>

          {error && (
            <div className="result-warning" role="alert">
              <AlertCircle size={16} style={{ verticalAlign: "middle" }} />{" "}
              {error}
            </div>
          )}

          <button
            className="button button-primary"
            onClick={analyze}
            disabled={!file || busy}
            type="button"
            style={{ marginTop: 18, width: "100%" }}
          >
            {busy ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Analyzing image…
              </>
            ) : (
              <>
                <ScanSearch size={16} />
                Analyze leaf
              </>
            )}
          </button>
        </section>

        <aside className="card">
          <h2 className="card-title">Analysis result</h2>
          <p className="card-subtitle">
            Your prediction and alternative model scores will appear here.
          </p>

          {!result && !busy && (
            <div className="empty-state">
              <div className="empty-icon">
                <FileImage size={20} />
              </div>
              <h3>Ready when you are</h3>
              <p>
                Choose an image and start the analysis. The result panel will
                update when the model service responds.
              </p>
            </div>
          )}

          {busy && (
            <div className="empty-state">
              <LoaderCircle size={30} className="animate-spin" />
              <h3>Examining the image</h3>
              <p>The model is processing your upload.</p>
            </div>
          )}

          {result && (
            <>
              <div className="result-box">
                <div className="result-label">Top prediction</div>
                <h3 className="result-name">
                  {formatLabel(result.prediction.class_name)}
                </h3>
                <div className="metric-value">
                  {(result.prediction.confidence * 100).toFixed(2)}%
                </div>
                <div className="metric-note">
                  Model softmax score — not a calibrated probability of
                  diagnostic correctness.
                </div>
              </div>

              {isBackground && (
                <div className="result-warning">
                  <ShieldAlert size={16} style={{ verticalAlign: "middle" }} />{" "}
                  The model's strongest prediction is the broad background
                  class. This does not prove that the image contains no leaves.
                  Try a clear close-up, but treat the result as uncertain.
                </div>
              )}

              {result.message && (
                <div className="notice" style={{ marginTop: 12 }}>
                  {result.message}
                </div>
              )}

              <div style={{ marginTop: 22 }}>
                <h3 className="card-title">Other model predictions</h3>

                {result.top_predictions.map((item) => (
                  <div className="prediction-row" key={item.class_name}>
                    <div className="prediction-head">
                      <span>{formatLabel(item.class_name)}</span>
                      <strong>{(item.confidence * 100).toFixed(2)}%</strong>
                    </div>
                    <div
                      className="prediction-track"
                      role="progressbar"
                      aria-label={formatLabel(item.class_name)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={item.confidence * 100}
                    >
                      <div
                        className="prediction-fill"
                        style={{ width: `${item.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="notice" style={{ marginTop: 22 }}>
                <CheckCircle2 size={15} style={{ verticalAlign: "middle" }} />{" "}
                Scan history stores the filename and prediction in this browser
                only. The image itself is not saved there.
              </div>
            </>
          )}
        </aside>
      </div>

      <footer className="page-footer">
        Predictions are experimental. The model can make confidently wrong
        classifications on unfamiliar crops, backgrounds, and real-world
        photographs. Do not use this result alone to make treatment decisions.
      </footer>
    </main>
  );
}
