/**
 * Examens blancs : 3 tests de 40 questions, sur le modèle de l'examen civique (CSP).
 *
 * Format officiel (formation-civique.interieur.gouv.fr, « Informations générales sur l'examen civique ») :
 * 40 QCM (1 bonne réponse sur 4), dont 28 questions de connaissance et 12 mises en situation,
 * 45 minutes, réussite à partir de 32 bonnes réponses (80 %).
 *
 * Questions de connaissance : intitulés de la liste officielle CSP
 * (/examen-civique/liste-officielle-des-questions-de-connaissance-csp/), réponses rédigées
 * d'après les fiches de révision. Mises en situation : rédigées d'après les fiches
 * (la liste officielle ne les publie pas).
 *
 * Répartition par test (8 questions par thématique) :
 * principes 6 + 2 · institutions 6 + 2 · droits 5 + 3 · histoire 6 + 2 · société 5 + 3.
 */

export type ThemeKey = "principes" | "institutions" | "droits" | "histoire" | "societe";
export type QuestionKind = "connaissance" | "situation";

export type Question = {
  theme: ThemeKey;
  kind: QuestionKind;
  question: string;
  choices: [string, string, string, string];
  /** Index de la bonne réponse dans `choices`. */
  answer: 0 | 1 | 2 | 3;
  explanation: string;
  /** Fiche de révision liée. */
  fiche: string;
};

export type Exam = { id: string; title: string; questions: Question[] };

export const themes: Record<ThemeKey, string> = {
  principes: "Principes et valeurs de la République",
  institutions: "Système institutionnel et politique",
  droits: "Droits et devoirs",
  histoire: "Histoire, géographie et culture",
  societe: "Vivre dans la société française",
};

export const EXAM_RULES = { questions: 40, knowledge: 28, situations: 12, minutes: 45, passMark: 32 };

type Choices = Question["choices"];
const k = (theme: ThemeKey, question: string, choices: Choices, answer: Question["answer"], explanation: string, fiche: string): Question => ({ theme, kind: "connaissance", question, choices, answer, explanation, fiche });
const s = (theme: ThemeKey, question: string, choices: Choices, answer: Question["answer"], explanation: string, fiche: string): Question => ({ theme, kind: "situation", question, choices, answer, explanation, fiche });

const examen1: Question[] = [
  // Principes et valeurs de la République
  k("principes", "À quoi correspond la date du 14 juillet ?",
    ["À la fin de la Seconde Guerre mondiale", "À la fête nationale française", "À la fête du Travail", "À la naissance de Napoléon"], 1,
    "Le 14 juillet est la fête nationale. Il rappelle la prise de la Bastille (1789) et la fête de la Fédération (1790).", "la-fete-nationale"),
  k("principes", "Quelle est la devise de la République française ?",
    ["Travail, famille, patrie", "Unité, progrès, justice", "Liberté, égalité, fraternité", "Paix, travail, liberté"], 2,
    "« Liberté, Égalité, Fraternité » est la devise officielle depuis 1848. Elle est inscrite dans la Constitution de 1958.", "la-devise-francaise"),
  k("principes", "Le principe d'égalité signifie que :",
    ["Tout le monde gagne le même salaire", "Les citoyens sont égaux devant la loi, sans distinction d'origine, de sexe ou de religion", "Seuls les Français de naissance ont des droits", "Les hommes ont plus de droits que les femmes"], 1,
    "Tous les citoyens sont égaux devant la loi. Les discriminations sont interdites.", "egalite-1"),
  k("principes", "Qu'est-ce que la laïcité ?",
    ["L'obligation d'avoir une religion", "L'interdiction de toutes les religions", "La séparation des Églises et de l'État, qui garantit la liberté de conscience", "La religion officielle de l'État"], 2,
    "L'État est neutre : il ne reconnaît ni ne finance aucun culte. Chacun est libre de croire ou de ne pas croire.", "la-definition-de-la-laicite-1"),
  k("principes", "Quelle est la langue officielle de la République française ?",
    ["Le français", "L'anglais", "Le latin", "Le français et l'anglais"], 0,
    "L'article 2 de la Constitution dispose que « la langue de la République est le français ».", "la-langue-francaise"),
  k("principes", "A-t-on le droit d'insulter publiquement quelqu'un parce qu'il est différent (handicap, apparence physique, sexe…) ?",
    ["Oui, c'est la liberté d'expression", "Oui, si on le pense vraiment", "Oui, mais seulement sur internet", "Non, c'est une infraction punie par la loi"], 3,
    "L'injure discriminatoire est punie par la loi. La liberté d'expression a des limites.", "egalite-3"),
  s("principes", "Au guichet de la mairie, l'agent qui vous reçoit porte un signe religieux très visible. Que prévoit la loi ?",
    ["C'est autorisé, comme pour tout le monde", "Les agents publics doivent rester neutres : ils ne peuvent pas afficher leur religion pendant leur service", "C'est autorisé seulement le vendredi", "Le maire décide seul selon sa religion"], 1,
    "Dans les services publics, les agents ont un devoir de neutralité. Les usagers, eux, restent libres de porter des signes religieux.", "la-laicite-dans-les-services-publics"),
  s("principes", "Dans la rue, une personne se fait insulter à cause de sa couleur de peau. Que pouvez-vous faire ?",
    ["Rien, ce n'est pas interdit", "Témoigner auprès de la police ; la victime peut porter plainte, car le racisme est puni par la loi", "Insulter l'auteur à votre tour", "Attendre que la victime se défende seule"], 1,
    "Les propos racistes sont des délits. Un témoin peut aider la victime et témoigner.", "egalite-3"),

  // Système institutionnel et politique
  k("institutions", "Qui nomme le Premier ministre ?",
    ["Le président de la République", "Le Sénat", "Les citoyens, par un vote", "Le président de l'Assemblée nationale"], 0,
    "Le président de la République nomme le Premier ministre (article 8 de la Constitution).", "etat-de-droit-et-separation-des-pouvoirs-presentation-des-3-pouvoirs-1"),
  k("institutions", "Combien de députés composent l'Assemblée nationale ?",
    ["100", "348", "577", "1 000"], 2,
    "L'Assemblée nationale compte 577 députés, élus au suffrage universel direct. Le Sénat compte 348 sénateurs.", "etat-de-droit-et-separation-des-pouvoirs-presentation-des-3-pouvoirs-1"),
  k("institutions", "À partir de quel âge a-t-on le droit de voter ?",
    ["16 ans", "18 ans", "21 ans", "25 ans"], 1,
    "Tout citoyen français majeur (18 ans) peut voter, s'il jouit de ses droits civils et politiques.", "democratie-et-droit-de-vote-les-conditions-pour-voter-en-france-1"),
  k("institutions", "La séparation des pouvoirs est un principe fondamental. Quels sont les trois pouvoirs concernés ?",
    ["Le pouvoir militaire, religieux et économique", "Le pouvoir législatif, exécutif et judiciaire", "Le pouvoir national, régional et municipal", "Le pouvoir médiatique, politique et financier"], 1,
    "Le législatif vote la loi, l'exécutif l'applique, le judiciaire la fait respecter. Chacun contrôle les autres.", "etat-de-droit-et-separation-des-pouvoirs-presentation-de-letat-de-droit-et-principe-de-la-separation-des-pouvoirs"),
  k("institutions", "Qui représente l'État dans un département ?",
    ["Le maire", "Le président du conseil départemental", "Le député", "Le préfet"], 3,
    "Le préfet, nommé par le Gouvernement, représente l'État dans le département.", "le-decoupage-administratif-de-la-france-1"),
  k("institutions", "Combien d'États font partie de l'Union européenne au 1er janvier 2025 ?",
    ["12", "27", "28", "35"], 1,
    "L'Union européenne compte 27 États membres depuis la sortie du Royaume-Uni en 2020.", "le-fonctionnement-europeen-1"),
  s("institutions", "Vous venez d'obtenir la nationalité française et vous voulez voter aux prochaines élections municipales. Que devez-vous faire ?",
    ["Rien, on peut voter sans démarche dans n'importe quel bureau", "Vous inscrire sur les listes électorales de votre commune", "Demander l'autorisation au préfet à chaque élection", "Payer une taxe de vote"], 1,
    "Pour voter, il faut être inscrit sur les listes électorales (en mairie ou en ligne).", "democratie-et-droit-de-vote-les-conditions-pour-voter-en-france-2"),
  s("institutions", "Un ami affirme que le président de la République peut voter seul une nouvelle loi. Que lui répondez-vous ?",
    ["Il a raison, le président a tous les pouvoirs", "Les lois sont votées par le Parlement (Assemblée nationale et Sénat)", "Les lois sont votées par les préfets", "Les lois sont votées par les juges"], 1,
    "Le pouvoir législatif appartient au Parlement. Le président promulgue la loi mais ne la vote pas.", "comment-voter-une-loi-1"),

  // Droits et devoirs
  k("droits", "De quelle année date la Déclaration des droits de l'homme et du citoyen ?",
    ["1515", "1789", "1905", "1958"], 1,
    "La DDHC a été adoptée le 26 août 1789, pendant la Révolution française.", "les-principaux-textes-la-declaraion-des-droits-de-lhomme-et-du-citoyen"),
  k("droits", "La peine de mort est :",
    ["Appliquée pour les crimes graves", "Abolie en France depuis 1981", "Décidée par le maire", "Autorisée en temps de paix"], 1,
    "La peine de mort a été abolie en 1981, à l'initiative de Robert Badinter.", "focus-sur-la-cinquieme-republique-5"),
  k("droits", "En France, est-ce légal d'être marié à plusieurs personnes en même temps ?",
    ["Oui, si tout le monde est d'accord", "Oui, si le mariage a eu lieu à l'étranger", "Non, la polygamie est interdite", "Oui, pour les hommes seulement"], 2,
    "En France, on ne peut être marié qu'à une seule personne à la fois. La polygamie est interdite.", "les-libertes-au-sein-du-couple"),
  k("droits", "Quelle est l'infraction la plus grave ?",
    ["La contravention", "Le délit", "Le crime", "L'amende"], 2,
    "Il existe 3 catégories d'infractions : contravention, délit, crime. Le crime (meurtre, viol…) est jugé par la cour d'assises.", "se-conformer-aux-lois-les-infractions"),
  k("droits", "Quel est le rôle de la police ?",
    ["Voter les lois", "Juger les personnes", "Assurer la sécurité des personnes et des biens et faire respecter la loi", "Collecter les impôts"], 2,
    "La police nationale (surtout en ville) et la gendarmerie (surtout en zone rurale) protègent la population et font respecter la loi.", "se-conformer-aux-lois-les-acteurs"),
  s("droits", "Vous voyez une personne blessée et inconsciente sur le trottoir après une chute. Que devez-vous faire ?",
    ["Passer votre chemin", "Appeler les secours (15, 18 ou 112) et rester auprès d'elle", "La filmer pour les réseaux sociaux", "Attendre qu'un policier passe"], 1,
    "Porter secours est une obligation. La non-assistance à personne en danger est punie par la loi.", "les-obligations-en-tant-que-resident-francais"),
  s("droits", "Vous entendez régulièrement votre voisine crier et être frappée par son conjoint. Que faites-vous ?",
    ["Rien, c'est une affaire privée", "Vous appelez le 17 en cas d'urgence ; le 3919 peut aussi informer et orienter", "Vous attendez qu'elle vous demande de l'aide", "Vous en parlez seulement à vos amis"], 1,
    "Les violences conjugales sont un délit. Un témoin peut et doit alerter : 17 (police) ou 3919 (écoute et orientation).", "le-role-des-temoins-en-cas-de-violences"),
  s("droits", "Les parents de votre amie de 17 ans veulent la marier à un homme qu'elle n'a pas choisi. Que dit la loi ?",
    ["C'est permis si la famille est d'accord", "Le mariage forcé est interdit : le consentement libre des deux époux est obligatoire", "C'est permis si le mariage a lieu à l'étranger", "C'est permis à partir de 16 ans"], 1,
    "Le mariage exige le consentement libre et éclairé de chacun. Le mariage forcé est puni par la loi.", "la-declaration-de-mariage"),

  // Histoire, géographie et culture
  k("histoire", "En quelle année a débuté la Révolution française ?",
    ["1515", "1789", "1848", "1914"], 1,
    "La Révolution commence en 1789 (États généraux, prise de la Bastille le 14 juillet).", "la-fin-de-la-monarchie-absolue-et-le-debut-de-la-iere-republique-1789-1792"),
  k("histoire", "Qu'est-ce que la Shoah ?",
    ["Une fête religieuse", "Une bataille de la Première Guerre mondiale", "L'extermination des Juifs d'Europe par les nazis pendant la Seconde Guerre mondiale", "Un traité de paix"], 2,
    "La Shoah désigne le génocide d'environ 6 millions de Juifs par l'Allemagne nazie et ses complices.", "focus-sur-la-seconde-guerre-mondiale-la-shoah"),
  k("histoire", "Le 11 novembre est un jour férié. À quoi correspond cette date ?",
    ["À l'armistice de la Première Guerre mondiale (1918)", "À la victoire de 1945", "À la prise de la Bastille", "À la fête du Travail"], 0,
    "Le 11 novembre commémore l'armistice du 11 novembre 1918, qui met fin aux combats de la Première Guerre mondiale.", "patrimoine-francais-les-jours-feries"),
  k("histoire", "Quelle est la capitale de la France ?",
    ["Lyon", "Marseille", "Bordeaux", "Paris"], 3,
    "Paris est la capitale. C'est aussi le siège des principales institutions (Élysée, Parlement).", "ile-de-france"),
  k("histoire", "Qui était Molière ?",
    ["Un roi de France", "Un auteur de théâtre du XVIIe siècle", "Un peintre impressionniste", "Un président de la République"], 1,
    "Molière (1622-1673) est l'auteur de comédies célèbres comme Le Misanthrope ou Le Malade imaginaire. On dit du français que c'est « la langue de Molière ».", "patrimoine-francais-artistes-emblematiques-parmi-les-auteurs-1"),
  k("histoire", "Quel fleuve coule en France ?",
    ["Le Nil", "La Loire", "L'Amazone", "Le Danube"], 1,
    "Les grands fleuves français sont la Loire, la Seine, le Rhône et la Garonne.", "les-fleuves-francais"),
  s("histoire", "Le 8 mai, votre enfant n'a pas école et vous demande pourquoi. Que lui répondez-vous ?",
    ["C'est la fête nationale", "On commémore la victoire des Alliés sur l'Allemagne nazie en 1945", "C'est la fête du Travail", "C'est l'anniversaire de la Constitution"], 1,
    "Le 8 mai 1945 marque la fin de la Seconde Guerre mondiale en Europe. C'est un jour férié.", "patrimoine-francais-les-jours-feries"),
  s("histoire", "Un ami en visite veut voir le château construit par Louis XIV, symbole de la monarchie absolue. Où l'emmenez-vous ?",
    ["Au château de Versailles", "À la tour Eiffel", "Au Mont-Saint-Michel", "Au palais de l'Élysée"], 0,
    "Louis XIV installe la cour à Versailles, symbole de l'Ancien Régime et de la monarchie absolue.", "l-ancien-regime-jusqu-en-1789"),

  // Vivre dans la société française
  k("societe", "Quel numéro d'urgence permet d'appeler le SAMU ?",
    ["15", "17", "18", "115"], 0,
    "15 : SAMU (urgence médicale) ; 17 : police ; 18 : pompiers ; 112 : numéro d'urgence européen.", "annexe-les-numeros-durgence"),
  k("societe", "Qu'est-ce que le SMIC ?",
    ["Une aide au logement", "Le salaire minimum légal en France", "Un impôt sur le revenu", "Une assurance santé"], 1,
    "Le SMIC (salaire minimum interprofessionnel de croissance) est le salaire en dessous duquel aucun salarié ne peut être payé.", "le-droit-au-travail-2"),
  k("societe", "Quelle est la durée légale du temps de travail par semaine ?",
    ["25 heures", "35 heures", "40 heures", "48 heures"], 1,
    "La durée légale de référence est de 35 heures par semaine pour un salarié à temps complet.", "le-droit-au-travail-1"),
  k("societe", "À quoi sert la carte Vitale ?",
    ["À voter", "À prouver son identité à la frontière", "À faciliter le remboursement des frais de santé par l'Assurance maladie", "À payer dans les magasins"], 2,
    "La carte Vitale permet la télétransmission des feuilles de soins à l'Assurance maladie.", "sante-la-prise-en-charge-les-demarches-pour-etre-rembourse"),
  k("societe", "Jusqu'à quel âge l'école est-elle obligatoire ?",
    ["10 ans", "14 ans", "16 ans", "21 ans"], 2,
    "L'instruction est obligatoire pour tous les enfants de 3 à 16 ans.", "le-systeme-educatif"),
  s("societe", "Un dimanche, votre enfant a de la fièvre, mais son état n'est pas grave. Que faites-vous en priorité ?",
    ["Vous allez directement aux urgences de l'hôpital", "Vous contactez un médecin de garde ou une pharmacie de garde", "Vous appelez les pompiers", "Vous attendez une semaine"], 1,
    "Les urgences sont réservées aux cas graves. Pour un problème non urgent hors des heures habituelles, il y a les médecins et pharmacies de garde.", "acces-aux-soins-les-medecins-et-pharmacies-de-garde"),
  s("societe", "Vous allez louer un appartement. Quelle assurance le locataire doit-il souscrire ?",
    ["Aucune", "Une assurance habitation couvrant les risques locatifs (incendie, dégât des eaux…)", "Une assurance vie", "Une assurance voyage"], 1,
    "Le locataire est obligé de s'assurer contre les risques locatifs et de fournir l'attestation au propriétaire.", "les-demarches-relatives-au-logement-2"),
  s("societe", "Vous avez travaillé toute l'année en France. Que devez-vous faire au printemps suivant ?",
    ["Rien, seuls les Français déclarent leurs revenus", "Déclarer vos revenus aux impôts, même s'ils sont faibles", "Déclarer vos revenus uniquement si vous êtes propriétaire", "Envoyer votre salaire à la mairie"], 1,
    "Toute personne majeure résidant en France doit déclarer ses revenus chaque année, même faibles.", "l-impot-en-france-et-la-declaration-de-revenus"),
];

const examen2: Question[] = [
  // Principes et valeurs de la République
  k("principes", "Qui est Marianne ?",
    ["Une reine de France", "Une figure symbolique qui représente la République française", "La première femme présidente", "Une sainte catholique"], 1,
    "Marianne, coiffée d'un bonnet phrygien, incarne la République. Son buste est présent dans les mairies.", "marianne"),
  k("principes", "Quel est le nom de l'hymne national ?",
    ["La Marseillaise", "Le Chant des partisans", "L'Internationale", "La Parisienne"], 0,
    "La Marseillaise, composée en 1792 par Rouget de Lisle, est l'hymne national (article 2 de la Constitution).", "hymne-francais"),
  k("principes", "Quelles sont les couleurs du drapeau français ?",
    ["Bleu, blanc, vert", "Rouge, blanc, noir", "Bleu, blanc, rouge", "Jaune, bleu, rouge"], 2,
    "Le drapeau tricolore bleu, blanc, rouge est l'emblème national.", "le-drapeau-francais"),
  k("principes", "En quelle année la loi de séparation des Églises et de l'État a-t-elle été votée ?",
    ["1789", "1848", "1905", "1958"], 2,
    "La loi du 9 décembre 1905 garantit la liberté de conscience et sépare les Églises de l'État.", "histoire-de-la-laicite"),
  k("principes", "Une personne peut-elle changer librement de religion ?",
    ["Non, c'est interdit", "Oui, la liberté de conscience permet de changer de religion ou de ne pas en avoir", "Oui, avec l'accord de sa famille", "Oui, avec l'autorisation du maire"], 1,
    "La liberté de conscience permet de croire, de ne pas croire ou de changer de religion.", "la-definition-de-la-laicite-1"),
  k("principes", "Certains métiers peuvent-ils être réservés aux hommes ?",
    ["Oui, les métiers physiques", "Oui, les postes de direction", "Non, les femmes et les hommes ont accès aux mêmes métiers", "Oui, dans l'armée"], 2,
    "L'égalité entre les femmes et les hommes s'applique au travail : refuser un emploi en raison du sexe est une discrimination.", "egalite-3"),
  s("principes", "Votre fille, élève dans un collège public, veut porter un signe religieux ostensible en classe. Que prévoit la loi ?",
    ["C'est autorisé partout", "Depuis 2004, les signes religieux ostensibles sont interdits aux élèves des écoles, collèges et lycées publics", "C'est autorisé si les parents signent un papier", "C'est décidé par chaque professeur"], 1,
    "La loi de 2004 protège la neutralité de l'école publique et la liberté de conscience des élèves.", "la-laicite-a-ecole-1"),
  s("principes", "Hospitalisé dans un hôpital public, un patient souhaite prier dans sa chambre. Est-ce possible ?",
    ["Non, la religion est interdite à l'hôpital", "Oui, les usagers des services publics peuvent pratiquer leur religion, sans troubler le fonctionnement du service", "Oui, mais seulement s'il est catholique", "Non, seulement à la maison"], 1,
    "La neutralité s'impose aux agents, pas aux usagers. Les usagers gardent leur liberté de culte dans le respect de l'ordre et du service.", "la-laicite-dans-les-services-publics"),

  // Système institutionnel et politique
  k("institutions", "Le Parlement est composé :",
    ["Du Gouvernement et du président", "De l'Assemblée nationale et du Sénat", "Des maires et des préfets", "Du Conseil constitutionnel"], 1,
    "Le Parlement comprend deux chambres : l'Assemblée nationale (577 députés) et le Sénat (348 sénateurs).", "etat-de-droit-et-separation-des-pouvoirs-presentation-des-3-pouvoirs-1"),
  k("institutions", "Pour combien de temps est élu le président de la République française ?",
    ["4 ans", "5 ans", "7 ans", "À vie"], 1,
    "Depuis 2002, le président est élu pour 5 ans (quinquennat) au suffrage universel direct.", "democratie-et-droit-de-vote-la-democratie-et-la-republique-2"),
  k("institutions", "Qui vote les lois ?",
    ["Le président de la République", "Les préfets", "Le Parlement", "Les juges"], 2,
    "Les députés et les sénateurs examinent et votent les lois.", "comment-voter-une-loi-1"),
  k("institutions", "Qui dirige la commune ?",
    ["Le préfet", "Le maire, avec le conseil municipal", "Le député", "Le président de la région"], 1,
    "Le maire est élu par le conseil municipal, lui-même élu par les habitants lors des élections municipales.", "le-decoupage-administratif-de-la-france-1"),
  k("institutions", "Que signifie « suffrage universel » ?",
    ["Seuls les propriétaires votent", "Seuls les hommes votent", "Tous les citoyens majeurs peuvent voter, sans condition de richesse ni de sexe", "Les citoyens du monde entier votent"], 2,
    "Le suffrage universel ouvre le vote à tous les citoyens majeurs. Les femmes votent en France depuis 1944.", "democratie-et-droit-de-vote-les-conditions-pour-voter-en-france-1"),
  k("institutions", "Quand célèbre-t-on la journée de l'Europe ?",
    ["Le 1er janvier", "Le 9 mai", "Le 14 juillet", "Le 11 novembre"], 1,
    "La journée de l'Europe, le 9 mai, rappelle la déclaration Schuman du 9 mai 1950.", "les-symboles-europeens-1"),
  s("institutions", "L'éclairage public de votre rue ne fonctionne plus depuis des semaines. À qui vous adressez-vous ?",
    ["À la mairie", "Au président de la République", "Au Parlement européen", "Au tribunal"], 0,
    "La voirie et l'éclairage public relèvent de la commune.", "le-decoupage-administratif-de-la-france-1"),
  s("institutions", "Votre voisin, de nationalité marocaine, vit en France depuis 10 ans. Peut-il voter aux élections municipales ?",
    ["Oui, après 5 ans de résidence", "Non : seuls les Français et les citoyens de l'Union européenne peuvent voter aux municipales", "Oui, s'il paie des impôts", "Oui, s'il est propriétaire"], 1,
    "Les citoyens de l'UE résidant en France votent aux municipales et aux européennes. Les autres étrangers ne votent pas.", "democratie-et-droit-de-vote-les-conditions-pour-voter-en-france-2"),

  // Droits et devoirs
  k("droits", "Comment s'appelle la Constitution actuelle de la France ?",
    ["La Constitution de la IIIe République", "La Constitution de la Ve République", "Le Code civil", "La Charte de 1830"], 1,
    "La Constitution du 4 octobre 1958 fonde la Ve République.", "les-principaux-textes-la-constitution-de-la-5-republique"),
  k("droits", "Qu'est-ce que la liberté d'expression ?",
    ["Le droit de dire tout ce qu'on veut, même des insultes", "Le droit d'exprimer ses opinions, dans les limites fixées par la loi", "Le droit de parler seulement à la maison", "Le droit réservé aux journalistes"], 1,
    "La liberté d'expression est garantie par la DDHC (article 11), mais la diffamation, l'injure ou l'appel à la haine sont punis.", "la-liberte"),
  k("droits", "Une femme peut avorter :",
    ["Jamais", "Seulement avec l'accord de son mari", "Librement, dans les conditions prévues par la loi", "Seulement à l'étranger"], 2,
    "L'IVG est autorisée depuis la loi Veil de 1975 ; la liberté d'y recourir est inscrite dans la Constitution depuis 2024.", "focus-sur-la-cinquieme-republique-le-droit-a-l-avortement"),
  k("droits", "Jeter une bouteille dans la rue est :",
    ["Autorisé", "Une infraction punie d'une amende", "Autorisé la nuit", "Obligatoire pour le recyclage"], 1,
    "Abandonner un déchet sur la voie publique est une infraction sanctionnée par une amende.", "obligations-et-devoirs-des-personnes-residants-en-france-adopter-une-attitude-respectueuse-vis-a-vis-de-environnement"),
  k("droits", "En quoi consiste la traite des êtres humains ?",
    ["Un commerce légal", "Le fait de recruter, transporter ou héberger une personne pour l'exploiter (travail forcé, prostitution…)", "Une aide humanitaire", "Un contrat de travail saisonnier"], 1,
    "La traite des êtres humains est un crime grave. Les victimes sont protégées.", "la-traite-des-etres-humains-et-la-prostitution"),
  s("droits", "Votre employeur garde votre passeport, ne vous paie pas et vous interdit de quitter le logement qu'il vous fournit. Que faites-vous ?",
    ["Vous acceptez, c'est normal pour un premier emploi", "Vous alertez la police ou une association d'aide aux victimes : c'est de l'exploitation, interdite par la loi", "Vous attendez la fin du contrat", "Vous payez pour récupérer votre passeport"], 1,
    "Confisquer des papiers et ne pas payer le travail sont des signes de traite et d'exploitation.", "la-traite-des-etres-humains-et-la-prostitution"),
  s("droits", "Un parent donne régulièrement des gifles à son enfant « pour l'éduquer ». Que dit la loi ?",
    ["C'est autorisé, c'est l'éducation", "Les violences, même éducatives (gifles, fessées), sont interdites ; on peut appeler le 119", "C'est autorisé avant 10 ans", "C'est autorisé si l'enfant a désobéi"], 1,
    "La loi interdit toutes les violences envers les enfants. Le 119 (Allô Enfance en danger) reçoit les signalements.", "l-interdiction-des-violences-faites-aux-enfants"),
  s("droits", "Votre conjoint vous interdit de travailler et garde votre salaire. Que prévoit la loi ?",
    ["C'est son droit en tant que chef de famille", "Chaque époux peut librement exercer une profession et disposer de ses revenus", "C'est autorisé si vous êtes mariés", "Seul le mari peut travailler"], 1,
    "Les époux sont égaux. Chacun est libre de travailler et de percevoir ses gains.", "les-libertes-au-sein-du-couple"),

  // Histoire, géographie et culture
  k("histoire", "Qui était Napoléon Ier ?",
    ["Un roi de France du Moyen Âge", "Un empereur des Français, au début du XIXe siècle", "Le premier président de la Ve République", "Un écrivain"], 1,
    "Napoléon Bonaparte devient empereur en 1804. Il crée notamment le Code civil et les préfets.", "le-1er-empire-1804-1815"),
  k("histoire", "Quand a eu lieu la Première Guerre mondiale ?",
    ["1870-1871", "1914-1918", "1939-1945", "1954-1962"], 1,
    "La Première Guerre mondiale (1914-1918) fait environ 1,4 million de morts parmi les soldats français.", "la-premiere-guerre-mondiale-1"),
  k("histoire", "Qui a été le premier Président élu sous la Ve République ?",
    ["François Mitterrand", "Charles de Gaulle", "Georges Pompidou", "Jacques Chirac"], 1,
    "Charles de Gaulle est élu président en décembre 1958, puis réélu en 1965.", "les-presidents-de-la-cinquieme-republique"),
  k("histoire", "Quel océan borde la côte ouest française ?",
    ["L'océan Pacifique", "L'océan Indien", "L'océan Atlantique", "L'océan Arctique"], 2,
    "La façade ouest de la France métropolitaine est bordée par l'océan Atlantique.", "le-territoire-de-la-france"),
  k("histoire", "Qui était Joséphine Baker ?",
    ["Une reine de France", "Une artiste de music-hall, résistante, devenue française, entrée au Panthéon", "Une scientifique", "Une présidente de l'Assemblée nationale"], 1,
    "Née aux États-Unis, devenue française, Joséphine Baker fut artiste, résistante et militante antiraciste.", "patrimoine-francais-artistes-emblematiques-devenus-francais"),
  k("histoire", "Où se situe la Corse ?",
    ["Dans l'océan Atlantique", "Dans la mer Méditerranée", "Dans la Manche", "Dans la mer du Nord"], 1,
    "La Corse est une île française de la mer Méditerranée.", "corse"),
  s("histoire", "Vous partez en voiture de Paris vers Marseille. Au bout du voyage, quelle mer découvrez-vous ?",
    ["La mer du Nord", "La Manche", "La mer Méditerranée", "La mer Baltique"], 2,
    "Marseille, grand port, est au bord de la Méditerranée, au sud de la France.", "les-ports-francais"),
  s("histoire", "Au musée, vous voyez « La Liberté guidant le peuple », une femme qui brandit le drapeau tricolore. Qui l'a peinte ?",
    ["Claude Monet", "Eugène Delacroix", "Pablo Picasso", "Paul Cézanne"], 1,
    "Eugène Delacroix l'a peinte en 1830. Le tableau est devenu un symbole de la liberté.", "la-liberte"),

  // Vivre dans la société française
  k("societe", "Quel numéro d'urgence permet d'appeler les pompiers ?",
    ["15", "17", "18", "119"], 2,
    "18 : sapeurs-pompiers (incendie, accident). Le 112 fonctionne aussi dans toute l'Europe.", "annexe-les-numeros-durgence"),
  k("societe", "Quand faut-il déclarer son enfant au service d'état civil de la mairie ?",
    ["Dans les 5 jours qui suivent la naissance", "Dans l'année", "Avant ses 3 ans", "À son entrée à l'école"], 0,
    "La déclaration de naissance est obligatoire dans les 5 jours qui suivent l'accouchement.", "la-declaration-de-naissance"),
  k("societe", "Quel est le rôle du médecin traitant ?",
    ["Il remplace les urgences", "Il suit votre santé et vous oriente vers des spécialistes si besoin", "Il délivre les titres de séjour", "Il vend les médicaments"], 1,
    "Le médecin traitant coordonne votre parcours de soins. Le respecter garantit un meilleur remboursement.", "acces-aux-soins-le-parcours-de-sante"),
  k("societe", "À partir de quel âge un mineur peut-il travailler ?",
    ["10 ans", "12 ans", "16 ans, avec l'autorisation de ses parents", "21 ans"], 2,
    "On peut travailler dès 16 ans, avec l'autorisation de son représentant légal (sauf émancipation).", "le-droit-au-travail-1"),
  k("societe", "Quel diplôme obtient-on à la fin du lycée ?",
    ["Le brevet des collèges", "Le baccalauréat", "La licence", "Le permis de conduire"], 1,
    "Le baccalauréat (bac) se passe à la fin de la terminale et ouvre l'accès à l'enseignement supérieur.", "le-systeme-educatif"),
  s("societe", "Vous arrivez en France avec votre fils de 10 ans, qui ne parle pas encore français. Que se passe-t-il pour sa scolarité ?",
    ["Il doit attendre de parler français pour aller à l'école", "Il est inscrit à l'école et peut bénéficier d'un dispositif d'accueil (UPE2A) pour apprendre le français", "Il doit aller dans une école privée payante", "L'école n'est pas obligatoire pour lui"], 1,
    "Tous les enfants de 3 à 16 ans doivent être scolarisés. Les élèves allophones sont accueillis en UPE2A.", "l-ecole-pour-les-enfants-allophones"),
  s("societe", "Au travail, un collègue fait un malaise et perd connaissance. Quel numéro appelez-vous ?",
    ["Le 15 (SAMU)", "Le 115", "Le 3919", "Le numéro de votre banque"], 0,
    "Pour une urgence médicale, on appelle le 15 (ou le 112).", "acces-aux-soins-services-et-numeros-d-urgence"),
  s("societe", "Vous n'avez pas d'adresse stable pour recevoir votre courrier administratif. Que pouvez-vous faire ?",
    ["Renoncer à vos démarches", "Demander une domiciliation auprès d'un CCAS ou d'une association agréée", "Donner une fausse adresse", "Utiliser l'adresse de la préfecture"], 1,
    "La domiciliation permet d'avoir une adresse pour recevoir du courrier et faire valoir ses droits.", "les-demarches-du-quotidien-comme-la-domiciliation"),
];

const examen3: Question[] = [
  // Principes et valeurs de la République
  k("principes", "Quel animal est un symbole de la France ?",
    ["Le lion", "L'aigle", "Le coq", "L'ours"], 2,
    "Le coq gaulois est un symbole non officiel de la France, très présent dans le sport.", "le-coq"),
  k("principes", "Que signifie le mot \"fraternité\" dans la devise française ?",
    ["L'obligation d'avoir des frères", "La solidarité et l'entraide entre tous les citoyens", "L'égalité des salaires", "Le respect d'une religion commune"], 1,
    "La fraternité exprime la solidarité : entraide, bénévolat, protection sociale.", "fraternite-1"),
  k("principes", "De quand date la Constitution de la Ve République ?",
    ["1789", "1848", "1946", "1958"], 3,
    "La Constitution de la Ve République date du 4 octobre 1958.", "la-cinquieme-republique"),
  k("principes", "Un enfant peut-il refuser d'aller à l'école pour une raison religieuse ?",
    ["Oui, la religion passe avant l'école", "Non, l'instruction est obligatoire pour tous les enfants", "Oui, pendant les fêtes religieuses seulement", "Oui, si les parents sont d'accord"], 1,
    "L'instruction est obligatoire de 3 à 16 ans, quelle que soit la religion de la famille.", "la-laicite-a-ecole-1"),
  k("principes", "\"La France est une République indivisible, ..., démocratique et sociale\". Complétez cette phrase extraite de l'article 1er de la Constitution :",
    ["chrétienne", "laïque", "monarchique", "fédérale"], 1,
    "Article 1er : « La France est une République indivisible, laïque, démocratique et sociale. »", "la-definition-de-la-laicite-1"),
  k("principes", "Qu'est ce qui est traditionnellement organisé sur les Champs Élysées le 14 juillet pour célébrer la fête nationale ?",
    ["Un marathon", "Un défilé militaire", "Un concert de rock", "Une course cycliste"], 1,
    "Chaque 14 juillet, un défilé militaire a lieu sur les Champs-Élysées en présence du président.", "la-fete-nationale"),
  s("principes", "Au travail, dans une entreprise privée, un collègue insiste chaque jour pour convaincre les autres d'adopter sa religion. Que peut faire l'employeur ?",
    ["Rien, c'est la liberté religieuse", "Il peut interdire ce prosélytisme, qui perturbe le travail et fait pression sur les collègues", "Il doit renvoyer tous les salariés croyants", "Il doit imposer une religion à tous"], 1,
    "La liberté religieuse existe au travail, mais le prosélytisme et les pressions peuvent être interdits et sanctionnés.", "le-proselytisme"),
  s("principes", "Un journal publie une caricature qui se moque d'une religion. Est-ce autorisé en France ?",
    ["Non, le blasphème est un délit", "Oui, critiquer ou caricaturer une religion est permis, mais pas inciter à la haine contre des personnes", "Non, toute critique est interdite", "Oui, mais seulement pour certaines religions"], 1,
    "Le blasphème n'est pas un délit en France. La loi protège les personnes, pas les croyances.", "le-blaspheme"),

  // Système institutionnel et politique
  k("institutions", "Pour combien de temps sont élus les sénateurs ?",
    ["3 ans", "5 ans", "6 ans", "9 ans"], 2,
    "Les sénateurs sont élus pour 6 ans au suffrage indirect, par les grands électeurs.", "democratie-et-droit-de-vote-la-democratie-et-la-republique-2"),
  k("institutions", "Qui réside au palais de l'Élysée ?",
    ["Le Premier ministre", "Le président de la République", "Le maire de Paris", "Le président du Sénat"], 1,
    "L'Élysée est la résidence officielle du président. Le Premier ministre siège à l'hôtel de Matignon.", "etat-de-droit-et-separation-des-pouvoirs-presentation-des-3-pouvoirs-1"),
  k("institutions", "Combien y a-t-il de départements en France ?",
    ["13", "50", "101", "200"], 2,
    "La France compte 101 départements, dont 5 en outre-mer.", "le-decoupage-administratif-de-la-france-1"),
  k("institutions", "Quel est le rôle de l'autorité judiciaire ?",
    ["Voter les lois", "Juger les litiges et sanctionner ceux qui ne respectent pas la loi", "Diriger l'armée", "Élire le président"], 1,
    "Les juges, indépendants, tranchent les conflits et appliquent les sanctions.", "etat-de-droit-et-separation-des-pouvoirs-presentation-des-3-pouvoirs-2"),
  k("institutions", "Quel pays est un pays fondateur de l'Union européenne ?",
    ["L'Espagne", "La Pologne", "L'Italie", "La Suède"], 2,
    "Les 6 fondateurs sont la France, l'Allemagne, l'Italie, la Belgique, les Pays-Bas et le Luxembourg.", "les-etapes-cles-de-la-construction-europeenne"),
  k("institutions", "Est-ce que le président de la République a tous les pouvoirs ?",
    ["Oui, il décide de tout", "Non, les pouvoirs sont séparés et contrôlés", "Oui, en temps de paix", "Oui, depuis 1958"], 1,
    "La séparation des pouvoirs empêche une personne de concentrer tous les pouvoirs.", "etat-de-droit-et-separation-des-pouvoirs-presentation-de-letat-de-droit-et-principe-de-la-separation-des-pouvoirs"),
  s("institutions", "Votre titre de séjour arrive à expiration. Quelle administration de l'État gère son renouvellement ?",
    ["La mairie", "La préfecture", "Le tribunal", "Le conseil régional"], 1,
    "La préfecture, qui représente l'État dans le département, délivre et renouvelle les titres de séjour.", "les-demarches-relatives-au-sejour-en-france"),
  s("institutions", "Une collègue de nationalité française veut créer un nouveau parti politique avec des amis. Est-ce possible ?",
    ["Non, il y a un nombre fixe de partis", "Oui, les partis se forment et exercent leur activité librement, dans le respect de la démocratie", "Oui, avec l'accord du président", "Non, seuls les députés peuvent créer un parti"], 1,
    "Le pluralisme des partis est garanti par l'article 4 de la Constitution.", "democratie-et-droit-de-vote-le-principe-de-pluralite-des-partis"),

  // Droits et devoirs
  k("droits", "Quel droit permet à une personne de se défendre devant la justice ?",
    ["Le droit de vote", "Le droit à un procès équitable, avec un avocat", "Le droit de grève", "Le droit de propriété"], 1,
    "Toute personne a droit à un procès équitable et à être assistée d'un avocat ; elle est présumée innocente.", "les-droits-inherents-a-la-personne-humaine"),
  k("droits", "Est-il toujours possible de divorcer ?",
    ["Non, le mariage est définitif", "Oui, chaque époux peut demander le divorce", "Oui, seulement pour le mari", "Oui, seulement avec l'accord des familles"], 1,
    "Le divorce est un droit pour chacun des époux, femme comme homme.", "les-libertes-au-sein-du-couple"),
  k("droits", "Pourquoi les libertés individuelles peuvent-elles être limitées ?",
    ["Pour protéger les droits des autres et l'ordre public", "Pour favoriser certaines personnes", "Elles ne peuvent jamais l'être", "Pour faire plaisir au Gouvernement"], 0,
    "« La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui » (DDHC, article 4).", "la-limite-des-libertes-individuelles"),
  k("droits", "Que risque une personne qui ne respecte pas la loi ?",
    ["Rien", "Une sanction : amende, peine de prison…", "Une récompense", "Uniquement un avertissement"], 1,
    "Toute infraction peut être sanctionnée par la justice, selon sa gravité.", "se-conformer-aux-lois-les-infractions"),
  k("droits", "Déposer une machine à laver cassée sur le trottoir est :",
    ["Autorisé", "Un dépôt sauvage, interdit et puni d'une amende", "Autorisé le dimanche", "Une bonne action pour les voisins"], 1,
    "Les encombrants doivent être apportés en déchetterie ou collectés selon les règles de la commune.", "obligations-et-devoirs-des-personnes-residants-en-france-adopter-une-attitude-respectueuse-vis-a-vis-de-environnement"),
  s("droits", "Une femme enceinte souhaite avorter, mais son mari s'y oppose. Que prévoit la loi ?",
    ["Le mari décide", "La décision appartient à la femme seule", "Le maire décide", "Il faut l'accord des deux familles"], 1,
    "Le droit de disposer de son corps : l'IVG est le choix de la femme, dans les délais légaux.", "un-droit-fondamental-le-droit-de-disposer-de-son-corps"),
  s("droits", "On vous a volé votre téléphone dans le métro. Que faites-vous ?",
    ["Rien", "Vous portez plainte au commissariat ou à la gendarmerie", "Vous cherchez le voleur pour le punir vous-même", "Vous allez à la mairie"], 1,
    "La plainte permet l'enquête et l'indemnisation éventuelle. Se faire justice soi-même est interdit.", "se-conformer-aux-lois-les-acteurs"),
  s("droits", "Un camarade de classe de votre enfant est victime d'insultes et de moqueries répétées, aussi sur les réseaux sociaux. Que faire ?",
    ["Laisser faire, ce sont des jeux d'enfants", "Prévenir l'école et appeler le 3018, le numéro contre le harcèlement", "Attendre la fin de l'année", "Changer de quartier"], 1,
    "Le harcèlement scolaire est un délit. Le 3018 aide les victimes et les témoins.", "la-protection-des-victimes-de-violences"),

  // Histoire, géographie et culture
  k("histoire", "En quelle année l'esclavage a-t-il été aboli définitivement en France ?",
    ["1789", "1802", "1848", "1905"], 2,
    "Le décret du 27 avril 1848, préparé par Victor Schœlcher, abolit définitivement l'esclavage.", "la-deuxieme-republique-1848-1851"),
  k("histoire", "Qui a rendu l'école gratuite, laïque et obligatoire ?",
    ["Napoléon Ier", "Jules Ferry", "Louis XIV", "Charles de Gaulle"], 1,
    "Les lois Jules Ferry (1881-1882) rendent l'école primaire publique gratuite, laïque et obligatoire.", "la-troisieme-republique-1870-1940"),
  k("histoire", "Combien y a-t-il eu de républiques en France ?",
    ["2", "3", "5", "7"], 2,
    "La France a connu cinq républiques. Nous vivons sous la Ve République depuis 1958.", "les-regimes-politiques"),
  k("histoire", "Quelle chaîne de montagnes est située entre la France et l'Italie ?",
    ["Les Pyrénées", "Les Vosges", "Les Alpes", "Le Massif central"], 2,
    "Les Alpes séparent la France de l'Italie ; le mont Blanc en est le point culminant.", "les-frontieres-de-la-france"),
  k("histoire", "Qui était Simone de Beauvoir ?",
    ["Une reine de France", "Une philosophe et écrivaine féministe", "Une chanteuse", "Une peintre impressionniste"], 1,
    "Simone de Beauvoir (1908-1986) a écrit Le Deuxième Sexe (1949), ouvrage majeur du féminisme.", "patrimoine-francais-artistes-emblematiques-parmi-les-auteurs-3"),
  k("histoire", "Qu'est-ce que le Louvre ?",
    ["Une gare", "Un grand musée situé à Paris", "Un fleuve", "Un stade"], 1,
    "Ancien palais royal, le Louvre est l'un des musées les plus visités au monde (la Joconde).", "une-puissance-culturelle"),
  s("histoire", "Votre enfant prépare un exposé sur la Résistance. Qui a lancé depuis Londres l'appel du 18 juin 1940 ?",
    ["Le maréchal Pétain", "Le général de Gaulle", "Napoléon III", "Jean Jaurès"], 1,
    "Le 18 juin 1940, le général de Gaulle appelle à poursuivre le combat contre l'Allemagne nazie.", "la-seconde-guerre-mondiale-3"),
  s("histoire", "Vous partez en vacances en Guadeloupe. Quel est son statut ?",
    ["Un pays étranger", "Un département et une région d'outre-mer : vous restez en France", "Une colonie", "Un territoire britannique"], 1,
    "La Guadeloupe, dans les Caraïbes, est une région et un département français d'outre-mer.", "guadeloupe"),

  // Vivre dans la société française
  k("societe", "Après avoir obtenu le permis de conduire, que faut-il faire pour pouvoir conduire sa voiture ?",
    ["Rien de plus", "Souscrire une assurance automobile", "Demander l'accord du maire", "Repasser le code chaque année"], 1,
    "L'assurance automobile est obligatoire pour circuler. Il faut aussi une carte grise et faire le contrôle technique.", "les-demarches-du-quotidien-comme-le-permis-de-conduire-1"),
  k("societe", "Le travail non déclaré est :",
    ["Autorisé pour les petits boulots", "Interdit : il prive le salarié de ses droits (santé, retraite, chômage)", "Autorisé pour les étrangers", "Obligatoire la première année"], 1,
    "Le travail « au noir » est illégal. Employeur et salarié peuvent être sanctionnés.", "le-droit-au-travail-5"),
  k("societe", "Auprès de quel organisme faut-il demander le remboursement des frais de santé ?",
    ["La mairie", "La caisse primaire d'Assurance maladie (CPAM)", "La préfecture", "France Travail"], 1,
    "La CPAM rembourse les frais de santé ; la mutuelle complète ce remboursement.", "sante-la-prise-en-charge-les-demarches-pour-etre-rembourse"),
  k("societe", "À quelles conditions un mariage est-il reconnu juridiquement ?",
    ["Il doit être célébré par un religieux", "Il doit être célébré à la mairie par un officier d'état civil", "Il suffit d'une fête avec la famille", "Il doit être enregistré à la banque"], 1,
    "Seul le mariage civil, célébré en mairie, a une valeur juridique. Une cérémonie religieuse ne peut avoir lieu qu'après.", "la-declaration-de-mariage"),
  k("societe", "Les enfants qui ne parlent pas français :",
    ["Ne peuvent pas aller à l'école", "Doivent être scolarisés comme les autres et sont aidés pour apprendre le français", "Doivent payer des cours privés", "Vont à l'école à partir de 16 ans"], 1,
    "L'école est obligatoire pour tous. Des dispositifs (UPE2A) aident les élèves allophones.", "l-ecole-pour-les-enfants-allophones"),
  s("societe", "Vous travaillez à temps plein et votre employeur vous paie nettement moins que le SMIC. Que pouvez-vous faire ?",
    ["Rien, c'est le choix de l'employeur", "Saisir l'inspection du travail ou le conseil de prud'hommes", "Arrêter de travailler sans prévenir", "Demander à la mairie de payer la différence"], 1,
    "Payer moins que le SMIC est interdit. Les prud'hommes jugent les litiges sur le salaire.", "le-droit-au-travail-2"),
  s("societe", "Plusieurs banques ont refusé de vous ouvrir un compte. Que pouvez-vous faire ?",
    ["Renoncer à avoir un compte", "Saisir la Banque de France pour faire valoir votre droit au compte", "Ouvrir un compte au nom d'un ami", "Demander au maire de vous prêter le sien"], 1,
    "Le droit au compte permet, via la Banque de France, d'obtenir l'ouverture d'un compte dans une banque désignée.", "les-demarches-du-quotidien-comme-louverture-dun-compte-bancaire"),
  s("societe", "Des parents veulent garder leur enfant de 4 ans à la maison, sans école ni instruction. Est-ce permis ?",
    ["Oui, l'école commence à 6 ans", "Non, l'instruction est obligatoire dès 3 ans", "Oui, jusqu'à 10 ans", "Oui, si l'enfant est timide"], 1,
    "L'instruction est obligatoire de 3 à 16 ans. Ne pas la respecter expose les parents à des sanctions.", "exercice-de-l-autorite-parentale-1"),
];

/**
 * Mélange déterministe des choix (graine = intitulé) : la bonne réponse ne tombe pas
 * toujours au même rang, et l'ordre reste identique au serveur et au client.
 */
function shuffleChoices(q: Question): Question {
  let seed = 0;
  for (const c of q.question) seed = (Math.imul(seed, 31) + c.charCodeAt(0)) | 0;
  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const order = [0, 1, 2, 3];
  for (let i = 3; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    ...q,
    choices: order.map((i) => q.choices[i]) as Choices,
    answer: order.indexOf(q.answer) as Question["answer"],
  };
}

export const exams: Exam[] = [
  { id: "examen-blanc-1", title: "Examen blanc n° 1", questions: examen1.map(shuffleChoices) },
  { id: "examen-blanc-2", title: "Examen blanc n° 2", questions: examen2.map(shuffleChoices) },
  { id: "examen-blanc-3", title: "Examen blanc n° 3", questions: examen3.map(shuffleChoices) },
];

export const getExam = (id: string) => exams.find((e) => e.id === id);
