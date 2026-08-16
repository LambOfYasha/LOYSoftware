import { Link } from "react-router";
import { ArrowRight, BookOpen, Brain, CheckCircle2, ExternalLink, GitBranch, ShieldCheck } from "lucide-react";
import { usePalette } from "../hooks/usePalette";

const learningCycle = ["Learn", "Practice", "Assess", "Challenge", "Independent Practice", "Teach", "Systematize"];

const modes = [
  {
    title: "Hand-Off Mode",
    body: "Use AI primarily for the result when the skill itself is low-value to you and the risk is controlled.",
  },
  {
    title: "Pair Mode",
    body: "Work with AI while staying involved in decisions, explanation, verification, and correction.",
  },
  {
    title: "Mastery Mode",
    body: "Use AI deliberately to reduce unnecessary dependency through understanding, reproduction, adaptation, diagnosis, and verification.",
  },
];

export function HLAPM() {
  const p = usePalette();

  return (
    <div>
      <section className="px-4 sm:px-6 py-20 sm:py-28" style={{ background: p.heroGrad }}>
        <div className="max-w-5xl mx-auto">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-6"
            style={{ background: p.accentDim, color: p.accent, border: `1px solid ${p.accentBorderStrong}` }}
          >
            <Brain size={14} />
            Open-source learning initiative
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: p.heading }}
          >
            Human-Led AI Project Mastery
          </h1>

          <p className="mt-6 text-lg sm:text-xl max-w-3xl leading-relaxed" style={{ color: p.body }}>
            Learn to use AI to increase what you can accomplish without requiring yourself to understand less.
          </p>

          <p className="mt-4 max-w-3xl leading-relaxed" style={{ color: p.muted }}>
            HLAPM is a public learning framework built around real projects, human verification, observable skill growth, live-project assessment, and disciplined challenge work.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://github.com/LambOfYasha/hlapm_public-repo"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm text-black transition-transform hover:scale-[1.02]"
              style={{ background: p.accent }}
            >
              View the open-source repository <ExternalLink size={16} />
            </a>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm transition-all"
              style={{ color: p.heading, border: `1px solid ${p.accentBorderStrong}`, background: p.accentDim }}
            >
              Explore LOY projects <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-16" style={{ background: p.pageBg }}>
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4" style={{ color: p.accent }}>
              <BookOpen size={20} />
              <span className="text-sm font-semibold uppercase tracking-wider">Why HLAPM?</span>
            </div>
            <h2 className="text-3xl font-bold" style={{ color: p.heading, fontFamily: "'Space Grotesk', sans-serif" }}>
              Productivity and human capability are not the same measurement.
            </h2>
            <p className="mt-4 leading-relaxed" style={{ color: p.body }}>
              AI can complete difficult work while leaving the person using it unable to explain, verify, reproduce, adapt, or diagnose the process. HLAPM makes that difference visible and turns real project work into an opportunity for measurable learning.
            </p>
          </div>

          <div className="rounded-3xl p-6" style={{ background: p.cardBg, border: `1px solid ${p.accentBorder}` }}>
            <div className="flex items-center gap-2 mb-5" style={{ color: p.accent }}>
              <ShieldCheck size={20} />
              <span className="font-semibold">Core principle</span>
            </div>
            <blockquote className="text-2xl font-semibold leading-snug" style={{ color: p.heading }}>
              AI should increase human capability without requiring human understanding to decrease.
            </blockquote>
            <p className="mt-5 text-sm leading-relaxed" style={{ color: p.muted }}>
              Important AI-assisted work should expose assumptions, verification requirements, human responsibilities, and remaining learning debt instead of hiding them behind polished output.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-16" style={{ background: p.sectionAlt }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3" style={{ color: p.accent }}>
            <GitBranch size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">Learning cycle</span>
          </div>
          <h2 className="text-3xl font-bold mb-8" style={{ color: p.heading, fontFamily: "'Space Grotesk', sans-serif" }}>
            Grow through work that actually matters.
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {learningCycle.map((step, index) => (
              <div key={step} className="rounded-2xl p-4" style={{ background: p.cardBg, border: `1px solid ${p.accentBorder}` }}>
                <div className="text-xs font-semibold mb-2" style={{ color: p.accent }}>STEP {index + 1}</div>
                <div className="font-semibold" style={{ color: p.heading }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-16" style={{ background: p.pageBg }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold" style={{ color: p.heading, fontFamily: "'Space Grotesk', sans-serif" }}>
            Choose your level of AI involvement intentionally.
          </h2>
          <p className="mt-3 max-w-3xl" style={{ color: p.body }}>
            HLAPM distinguishes three useful modes. No single mode is correct for every task; the goal is conscious dependency appropriate to the value and risk of the work.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {modes.map((mode) => (
              <article key={mode.title} className="rounded-2xl p-5" style={{ background: p.cardBg, border: `1px solid ${p.accentBorder}` }}>
                <CheckCircle2 size={19} style={{ color: p.accent }} />
                <h3 className="mt-4 font-bold text-lg" style={{ color: p.heading }}>{mode.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: p.body }}>{mode.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-16" style={{ background: p.sectionMid }}>
        <div className="max-w-5xl mx-auto rounded-3xl p-6 sm:p-8" style={{ background: p.cardBg, border: `1px solid ${p.accentBorderStrong}` }}>
          <div className="flex items-center gap-2" style={{ color: p.accent }}>
            <ExternalLink size={18} />
            <span className="text-sm font-semibold uppercase tracking-wider">Canonical source</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold" style={{ color: p.heading }}>
            The curriculum lives in the public HLAPM repository.
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed" style={{ color: p.body }}>
            LambOfYeshu.life is the reader-facing presentation layer. The GitHub repository remains the canonical source for the framework, documentation, assessments, challenges, templates, contribution history, and future revisions.
          </p>
          <a
            href="https://github.com/LambOfYasha/hlapm_public-repo"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: p.accent }}
          >
            Open HLAPM on GitHub <ExternalLink size={15} />
          </a>
        </div>
      </section>
    </div>
  );
}
