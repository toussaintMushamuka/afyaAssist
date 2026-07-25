import { NextRequest, NextResponse } from "next/server";

import { ai } from "@/lib/gemma";
import { getJaundiceKnowledge } from "@/lib/rag";
import { extractJson } from "@/lib/parser";

/**
 * API : Analyse médicale finale
 *
 * Cette route combine :
 *
 * 1. Analyse visuelle réalisée par Gemma Vision
 * 2. Symptômes récoltés dans le chat
 * 3. Base de connaissances médicale (RAG)
 *
 * Objectif :
 * Produire une estimation de risque plus fiable
 * qu'une simple analyse d'image.
 */
export async function POST(req: NextRequest) {
  try {
    /**
     * Récupération des données envoyées
     * depuis le frontend
     */
    const { imageAnalysis, conversation } = await req.json();

    /**
     * Vérification minimale
     * pour éviter une analyse vide
     */
    if (!imageAnalysis || !conversation) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing analysis data",
        },
        {
          status: 400,
        },
      );
    }

    /**
     * Chargement du contexte médical RAG
     *
     * Ce document contient :
     * - définition de la jaunisse
     * - symptômes
     * - limites de l'analyse visuelle
     * - recommandations médicales
     */
    const medicalKnowledge = getJaundiceKnowledge();

    /**
     * Appel de Gemma 4
     *
     * Le modèle reçoit :
     *
     * - les connaissances médicales
     * - l'analyse de l'image
     * - la conversation patient
     *
     * Il réalise ensuite un raisonnement combiné.
     */
    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it",

      contents: [
        {
          text: `

Tu es LifeLens AI.

Tu es un assistant de dépistage médical
spécialisé dans l'évaluation des signes
compatibles avec la jaunisse (ictère).

IMPORTANT :
Tu ne remplaces pas un médecin.
Tu fournis uniquement une estimation
basée sur les informations disponibles.



============================
BASE DE CONNAISSANCES MÉDICALES (RAG)
============================

${medicalKnowledge}



============================
ANALYSE VISUELLE DE L'IMAGE
============================

${JSON.stringify(imageAnalysis, null, 2)}



============================
HISTORIQUE DE CONVERSATION PATIENT
============================

${JSON.stringify(conversation, null, 2)}



============================
RÈGLES DE RAISONNEMENT MÉDICAL
============================


1.
Une image seule ne permet jamais
de confirmer une jaunisse.


2.
Une coloration jaune peut être influencée par :

- l'éclairage ;
- la qualité de la caméra ;
- la balance des couleurs ;
- les filtres ;
- le teint naturel.


3.
La sclère jaune
(blanc des yeux)
est un signe plus important
que la coloration de la peau.


4.
Tu dois analyser ensemble :

- les signes visibles ;
- les symptômes rapportés ;
- les symptômes absents.



5.
L'absence de symptômes importants
doit diminuer le niveau de suspicion.



6.
Utilise :

"Suspicion élevée"

uniquement si :

- les signes visuels sont très probables ;
ET
- plusieurs symptômes compatibles
  sont présents.



7.
Utilise :

"Suspicion modérée"

si :

- des signes visuels existent ;
MAIS
- les symptômes associés sont limités.



8.
Utilise :

"Faible suspicion"

si :

- l'image est incertaine ;
OU
- les symptômes sont absents.



============================
FORMAT DE RÉPONSE OBLIGATOIRE
============================


Réponds UNIQUEMENT avec ce JSON :


{
  "riskLevel": "",
  "confidence": 0,
  "summary": "",

  "riskFactors": [],

  "negativeSigns": [],

  "visualSigns": [],

  "reportedSymptoms": [],

  "reasoning": "",

  "recommendation": ""
}



Contraintes :

riskLevel doit être uniquement :

- Faible suspicion
- Suspicion modérée
- Suspicion élevée


confidence doit être un nombre
entre 0 et 1.

La confiance doit refléter la quantité
d'informations disponibles.

Règles de calibration :

- Analyse uniquement basée sur image :
  confiance maximale 0.60

- Image + quelques symptômes :
  confiance maximale 0.75

- Image + plusieurs symptômes cohérents :
  confiance maximale 0.90

- Ne donne jamais une confiance supérieure à 0.90
  pour une analyse visuelle seule.


riskFactors :
éléments qui augmentent la suspicion.


negativeSigns :
symptômes importants absents.


visualSigns :
uniquement les observations visibles
sur l'image.


reportedSymptoms :
uniquement les symptômes déclarés
par le patient.


reasoning :
explique comment les informations
ont été combinées.


recommendation :
conseil prudent orienté vers
la santé.


`,
        },
      ],
    });

    /**
     * Nettoyage et conversion
     * de la réponse Gemma en JSON
     */
    const result = extractJson(response.text ?? "");

    /**
     * Réponse envoyée au frontend
     */
    return NextResponse.json({
      success: true,

      result,
    });
  } catch (error) {
    /**
     * Gestion globale des erreurs
     */
    console.error("Final analysis error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Final analysis failed",
      },

      {
        status: 500,
      },
    );
  }
}
