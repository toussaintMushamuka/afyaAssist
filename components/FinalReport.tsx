"use client";

interface FinalReportProps {
  result: {
    riskLevel: string;

    confidence: number;

    summary: string;

    riskFactors: string[];

    negativeSigns: string[];

    visualSigns: string[];

    reportedSymptoms: string[];

    reasoning: string;

    recommendation: string;
  };
}

export default function FinalReport({ result }: FinalReportProps) {
  if (!result) return null;

  /**
   * Couleur du niveau de risque
   */
  const riskColor = () => {
    if (result.riskLevel === "Suspicion élevée") return "badge-error";

    if (result.riskLevel === "Suspicion modérée") return "badge-warning";

    return "badge-success";
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div
        className="
        card
        bg-base-100
        shadow-xl
        "
      >
        <div className="card-body">
          <h2
            className="
            card-title
            text-2xl
            "
          >
            🩺 Rapport final LifeLens AI
          </h2>

          <p className="text-sm opacity-70">
            Analyse basée sur :
            <br />
            Image + Symptômes + Connaissances médicales
          </p>
        </div>
      </div>

      {/* NIVEAU RISQUE */}

      <div
        className="
        card
        bg-base-100
        shadow-xl
        "
      >
        <div className="card-body">
          <h3 className="font-bold text-lg">Niveau de risque</h3>

          <div>
            <span
              className={`
              badge
              badge-lg
              ${riskColor()}
              `}
            >
              {result.riskLevel}
            </span>
          </div>

          <div className="mt-4">
            <p className="font-semibold">Niveau de confiance</p>

            <progress
              className="
              progress
              progress-primary
              w-full
              "
              value={result.confidence * 100}
              max="100"
            />

            <p className="mt-2">{Math.round(result.confidence * 100)} %</p>
          </div>
        </div>
      </div>

      {/* RESUME */}

      <div
        className="
        card
        bg-base-100
        shadow-xl
        "
      >
        <div className="card-body">
          <h3 className="card-title">Résumé</h3>

          <p>{result.summary}</p>
        </div>
      </div>

      {/* SIGNES VISUELS */}

      <ReportList
        title="👁️ Signes visuels détectés"
        items={result.visualSigns}
      />

      {/* FACTEURS RISQUE */}

      <ReportList
        title="⚠️ Facteurs augmentant la suspicion"
        items={result.riskFactors}
      />

      {/* SIGNES ABSENTS */}

      <ReportList
        title="✅ Signes non rapportés"
        items={result.negativeSigns}
      />

      {/* SYMPTOMES */}

      <ReportList
        title="📝 Symptômes rapportés"
        items={result.reportedSymptoms}
      />

      {/* RAISONNEMENT */}

      <div
        className="
        card
        bg-base-100
        shadow-xl
        "
      >
        <div className="card-body">
          <h3 className="card-title">🧠 Raisonnement LifeLens AI</h3>

          <p>{result.reasoning}</p>
        </div>
      </div>

      {/* RECOMMANDATION */}

      <div
        className="
        alert
        alert-info
        shadow-lg
        "
      >
        <div>
          <h3 className="font-bold">🏥 Recommandation médicale</h3>

          <div>{result.recommendation}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Composant réutilisable
 * pour afficher les listes
 */
function ReportList({
  title,

  items,
}: {
  title: string;

  items: string[];
}) {
  return (
    <div
      className="
      card
      bg-base-100
      shadow-xl
      "
    >
      <div className="card-body">
        <h3 className="card-title">{title}</h3>

        {items.length > 0 ? (
          <ul
            className="
              list-disc
              ml-6
              space-y-2
              "
          >
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="opacity-60">Aucun élément rapporté</p>
        )}
      </div>
    </div>
  );
}
