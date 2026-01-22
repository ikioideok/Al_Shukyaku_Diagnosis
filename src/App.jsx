import { useMemo, useState } from "react";

function normalizeUrlForValidation(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidEmail(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export default function AIAttendanceDiagnosisLanding() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({ url: false, email: false });
  const [showPdf, setShowPdf] = useState(false);

  const errors = useMemo(() => {
    const next = { url: "", email: "" };

    // URL validation (lightweight)
    if (!url.trim()) {
      next.url = "URLを入力してください";
    } else {
      try {
        const normalized = normalizeUrlForValidation(url);
        // eslint-disable-next-line no-new
        new URL(normalized);
      } catch {
        next.url = "URLの形式が正しくありません";
      }
    }

    // Email validation
    if (!email.trim()) {
      next.email = "メールアドレスを入力してください";
    } else if (!isValidEmail(email)) {
      next.email = "メールアドレスの形式が正しくありません";
    }

    return next;
  }, [url, email]);

  const hasErrors = Boolean(errors.url || errors.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ url: true, email: true });
    if (hasErrors) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setUrl("");
    setEmail("");
    setTouched({ url: false, email: false });
    setSubmitted(false);
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage:
          "radial-gradient(1200px circle at 20% 10%, rgba(56, 189, 248, 0.35), transparent 55%), radial-gradient(1000px circle at 85% 0%, rgba(129, 140, 248, 0.28), transparent 55%), radial-gradient(900px circle at 50% 110%, rgba(14, 165, 233, 0.18), transparent 60%), linear-gradient(180deg, #f8fafc 0%, #ffffff 35%, #e0f2fe 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10">
        <div className="relative w-full">
          {/* Decorative blur blobs */}
          <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/70 shadow-xl backdrop-blur">
            <div className="grid gap-0 md:grid-cols-2">
              {/* Left: Brand / copy */}
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 shadow" />
                  <div>
                    <h1 className="font-display text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                      AI集客診断
                    </h1>
                  </div>
                </div>

                <p className="mt-5 text-slate-700 leading-relaxed">
                  サイトURLを入力すると、そのサイトが検索経由で
                  <br />
                  <span className="gradient-underline font-bold">どれくらい集客・売上につながる可能性があるか</span>
                  を
                  <br />
                  AIで簡易診断し、レポート形式でメールにお送りします。
                </p>

                <a
                  href="/SEO_Report_sample.pdf"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 underline decoration-teal-300 underline-offset-4 transition hover:text-teal-800 hover:decoration-teal-500"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPdf(true);
                  }}
                >
                  診断結果レポートのサンプルを見る
                </a>
                <p className="mt-4 text-sm font-semibold text-rose-600">
                  本レポートは完全無料で受け取っていただけます。
                </p>

                

                <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-600">
                    ※送信後、診断結果（PDF）をメールでお送りします。あわせて、改善提案や関連サービスのご案内をお送りする場合があります（いつでも配信停止できます）。
                  </p>
                </div>
              </div>

              {/* Right: Form / Result */}
              <div className="border-t border-slate-200 bg-white p-8 md:border-l md:border-t-0 md:p-10">
                {!submitted ? (
                  <>
                    <h2 className="text-lg font-bold text-slate-900">必要事項を入力して送信してください。</h2>

                    <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
                      <div>
                        <label className="block text-sm font-semibold text-slate-800" htmlFor="url">
                          サイトURL
                        </label>
                        <div className="mt-2">
                          <input
                            id="url"
                            type="url"
                            inputMode="url"
                            placeholder="例）https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, url: true }))}
                            className={`w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 outline-none transition focus:ring-4 focus:ring-sky-200 ${
                              touched.url && errors.url ? "border-rose-300" : "border-slate-200"
                            }`}
                          />
                        </div>
                        {touched.url && errors.url ? (
                          <p className="mt-2 text-sm text-rose-600">{errors.url}</p>
                        ) : (
                          <p className="mt-2 text-xs text-slate-500">※「https://」は省略してもOKです</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-800" htmlFor="email">
                          メールアドレス
                        </label>
                        <div className="mt-2">
                          <input
                            id="email"
                            type="email"
                            inputMode="email"
                            placeholder="例）you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                            className={`w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 outline-none transition focus:ring-4 focus:ring-sky-200 ${
                              touched.email && errors.email ? "border-rose-300" : "border-slate-200"
                            }`}
                          />
                        </div>
                        {touched.email && errors.email ? (
                          <p className="mt-2 text-sm text-rose-600">{errors.email}</p>
                        ) : (
                          <p className="mt-2 text-xs text-slate-500">結果送付用のアドレスです</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="group relative w-full rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-200/60 transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={hasErrors && (touched.url || touched.email)}
                        onClick={() => setTouched({ url: true, email: true })}
                      >
                        <span className="relative">診断結果を受け取る</span>
                        <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-white/40 transition group-hover:opacity-100" />
                      </button>

                    </form>
                  </>
                ) : (
                  <div className="flex h-full flex-col">
                    <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-sky-50 p-7">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100">
                          <CheckIcon />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">受付完了</h2>
                          <p className="mt-1 text-slate-700 leading-relaxed">
                            結果はメールでお送りします。
                            <br />
                            しばらくお待ちください。
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs text-slate-600">送付先：{email.trim() || "（未入力）"}</p>
                        <p className="mt-1 text-xs text-slate-600">対象URL：{url.trim() || "（未入力）"}</p>
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-sky-200"
                        >
                          最初の画面に戻る
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-xs text-slate-500">
                        迷惑メールフォルダに入る場合があります。届かないときはご確認ください。
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white/70 px-6 py-4 text-center">
              <p className="text-xs text-slate-500">
                © {new Date().getFullYear()}{" "}
                <a
                  href="https://ai-and-marketing.jp/"
                  className="text-slate-600 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-800 hover:decoration-slate-500"
                  target="_blank"
                  rel="noreferrer"
                >
                  株式会社AIMA
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showPdf ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="relative h-[80vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900">診断結果レポート サンプル</p>
              <button
                type="button"
                onClick={() => setShowPdf(false)}
                className="rounded-full px-3 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                閉じる
              </button>
            </div>
            <iframe
              title="診断結果レポート サンプル"
              src="/SEO_Report_sample.pdf"
              className="h-full w-full"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FeatureRow({ title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// --- Minimal self-tests (development only) ---
function runSelfTests() {
  // URL normalization
  if (normalizeUrlForValidation("example.com") !== "https://example.com") {
    throw new Error("Self-test failed: normalizeUrlForValidation should add protocol");
  }
  if (normalizeUrlForValidation("http://example.com") !== "http://example.com") {
    throw new Error("Self-test failed: normalizeUrlForValidation should keep protocol");
  }

  // Email validation
  if (!isValidEmail("a@b.co")) {
    throw new Error("Self-test failed: isValidEmail should accept valid email");
  }
  if (isValidEmail("not-an-email")) {
    throw new Error("Self-test failed: isValidEmail should reject invalid email");
  }
}

// Avoid crashing the app in production builds
try {
  if (import.meta.env.MODE !== "production") {
    runSelfTests();
  }
} catch {
  // no-op
}
