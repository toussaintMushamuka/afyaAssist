interface SymptomFormProps {
  onSubmit: (symptoms: {
    darkUrine: boolean;
    paleStool: boolean;
    fever: boolean;
    fatigue: boolean;
    abdominalPain: boolean;
  }) => void;
}

export default function SymptomForm({ onSubmit }: SymptomFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    onSubmit({
      darkUrine: form.get("darkUrine") === "yes",
      paleStool: form.get("paleStool") === "yes",
      fever: form.get("fever") === "yes",
      fatigue: form.get("fatigue") === "yes",
      abdominalPain: form.get("abdominalPain") === "yes",
    });
  };

  const Question = ({ name, label }: { name: string; label: string }) => (
    <div className="space-y-2">
      <p className="font-medium">{label}</p>

      <label className="mr-4">
        <input type="radio" name={name} value="yes" required /> Oui
      </label>

      <label>
        <input type="radio" name={name} value="no" /> Non
      </label>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-6 space-y-6"
    >
      <h2 className="text-xl font-bold">Quelques questions complémentaires</h2>

      <Question name="darkUrine" label="Vos urines sont-elles foncées ?" />

      <Question name="paleStool" label="Vos selles sont-elles très claires ?" />

      <Question name="fever" label="Avez-vous de la fièvre ?" />

      <Question
        name="fatigue"
        label="Ressentez-vous une fatigue inhabituelle ?"
      />

      <Question
        name="abdominalPain"
        label="Avez-vous une douleur du côté droit de l'abdomen ?"
      />

      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
        Continuer
      </button>
    </form>
  );
}
