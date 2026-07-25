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

  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-xl
        p-6
        space-y-8
      "
    >
      {/* Titre */}

      <div>
        <h2 className="text-2xl font-bold">Rapport final LifeLens AI</h2>

        <p className="text-gray-500 mt-2">
          Analyse basée sur l'image, les symptômes et les connaissances
          médicales.
        </p>
      </div>

      {/* Niveau de risque */}

      <section
        className="
          bg-blue-50
          rounded-xl
          p-5
        "
      >
        <h3 className="font-semibold text-gray-600">Niveau de risque</h3>

        <p className="text-2xl font-bold mt-2">{result.riskLevel}</p>
      </section>

      {/* Confiance */}

      <section>
        <h3 className="font-bold mb-3">Niveau de confiance</h3>

        <div
          className="
            w-full
            h-3
            bg-gray-200
            rounded-full
          "
        >
          <div
            className="
              h-3
              bg-green-500
              rounded-full
            "
            style={{
              width: `${result.confidence * 100}%`,
            }}
          />
        </div>

        <p className="mt-2 font-semibold">
          {(result.confidence * 100).toFixed(0)} %
        </p>
      </section>

      {/* Résumé */}

      <ReportSection title="Résumé" content={result.summary} />

      {/* Signes visuels */}

      <ListSection title="Signes visuels détectés" items={result.visualSigns} />

      {/* Facteurs de risque */}

      <ListSection
        title="Facteurs augmentant la suspicion"
        items={result.riskFactors}
      />

      {/* Signes absents */}

      <ListSection title="Signes non rapportés" items={result.negativeSigns} />

      {/* Symptômes patient */}

      <ListSection
        title="Symptômes rapportés"
        items={
          result.reportedSymptoms.length
            ? result.reportedSymptoms
            : ["Aucun symptôme rapporté"]
        }
      />

      {/* Raisonnement IA */}

      <ReportSection
        title="Raisonnement LifeLens AI"
        content={result.reasoning}
      />

      {/* Recommandation */}

      <section
        className="
          bg-yellow-50
          rounded-xl
          p-5
        "
      >
        <h3 className="font-bold mb-2">Recommandation médicale</h3>

        <p>{result.recommendation}</p>
      </section>
    </div>
  );
}

/**
 * Affichage d'un bloc texte
 */

function ReportSection({
  title,

  content,
}: {
  title: string;

  content: string;
}) {
  return (
    <section>
      <h3 className="font-bold mb-2">{title}</h3>

      <p className="text-gray-700 leading-relaxed">{content}</p>
    </section>
  );
}

/**
 * Affichage d'une liste
 */

function ListSection({
  title,

  items,
}: {
  title: string;

  items: string[];
}) {
  return (
    <section>
      <h3 className="font-bold mb-3">{title}</h3>

      <ul
        className="
          list-disc
          pl-6
          space-y-2
        "
      >
        {items?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
