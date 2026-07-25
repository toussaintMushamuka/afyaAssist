interface ClinicalReportProps {
  result: {
    prediction: string;
    confidence: number;
    observations: string[];
    reasoning: string;
    recommendation: string;
  };
}

export default function ClinicalReport({ result }: ClinicalReportProps) {
  if (!result) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Résultat du dépistage</h2>
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-gray-500">Résultat</p>
        <p className="text-xl font-semibold">{result.prediction}</p>
      </div>

      <div>
        <p className="font-semibold mb-2">Niveau de confiance</p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{
              width: `${Number(result.confidence) * 100}%`,
            }}
          />
        </div>

        <p className="mt-2">{(Number(result.confidence) * 100).toFixed(0)}%</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Observations</h3>

        <ul className="list-disc pl-6">
          {result.observations.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Raisonnement</h3>

        <p>{result.reasoning}</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Recommandation</h3>

        <p>{result.recommendation}</p>
      </div>
    </div>
  );
}
