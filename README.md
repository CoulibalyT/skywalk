# Workflow du projet

## Branches principales
- **main** : version stable (production, protégée).  
- **develop** : branche d’intégration (protégée). Toutes les fonctionnalités passent par elle avant d’aller sur `main`.  

Le code est déjà structuré en deux dossiers dans la branch develop :  
- `/skywalk-frontend/` : pour le code du front-end  
- `/backend/` : pour le code du back-end  

⚠️ Ne pas créer de branches `frontend` ou `backend`. On travaille directement dans les dossiers.

---

## Qualité, CI/CD et couverture

[![CI/CD Pipeline](https://github.com/CoulibalyT/skywalk/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/CoulibalyT/skywalk/actions/workflows/ci.yml)
![Couverture frontend](https://img.shields.io/badge/couverture%20frontend-87%25%20lignes-brightgreen)
![Couverture backend](https://img.shields.io/badge/couverture%20backend-73%25%20lignes-green)

Chaque push sur `develop` déclenche le pipeline GitHub Actions (`.github/workflows/ci.yml`), **11 jobs** :

| Étape | Jobs |
|---|---|
| Qualité | Backend Lint · Frontend Lint |
| Tests unitaires | Backend Tests (1 249 tests, Jest) · Frontend Tests (1 824 tests, Vitest) |
| Tests de bout en bout | Backend E2E (27 modules, base PostgreSQL éphémère) · Frontend E2E (Playwright, 9 parcours) — non bloquants |
| Build | Backend Build · Frontend Build · Docker Build |
| Déploiement | Deploy Backend (Heroku) · Deploy Frontend (Vercel) — uniquement depuis `CoulibalyT/skywalk`, branche `develop` |

Un déploiement n'a lieu que si lint, tests et builds sont verts.

### Couverture de tests (mesurée le 10/09/2026)

| | Lignes | Instructions | Branches | Fonctions |
|---|---|---|---|---|
| Frontend (`skywalk-frontend`) | **87,2 %** | 85,6 % | 74,3 % | 80,8 % |
| Backend (`backend`) | **72,9 %** | 72,5 % | 73,6 % | 70,6 % |

Reproduire localement :

```bash
cd skywalk-frontend && npm run test:cov      # rapport dans coverage/
cd backend && npx jest --coverage            # rapport dans coverage/lcov-report/
```

## Comment contribuer

### 1. Créer une nouvelle branche à partir de `dev`
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ma-fonctionnalite

Utilise un nom explicite : feature/login, feature/dashboard, fix/api-bug, etc.
Une branche = une seule fonctionnalité.


2. Développer
	•	Si c’est du front : va dans /skywalk-frontend/.
	•	Si c’est du back : va dans /backend/.
	•	N’ajoute pas de nouveaux dossiers pour le front ou le back.


3. Commits clairs et réguliers

git add .
git commit -m "feat(auth): ajout du formulaire de connexion"
git push -u origin feature/ma-fonctionnalite

Conventions de commits :
	•	feat: ... → nouvelle fonctionnalité
	•	fix: ... → correction de bug
	•	chore: ... → tâches techniques (config, dépendances, etc.)
	•	docs: ... → documentation


4. Ouvrir une Pull Request
	•	Base branch = dev
	•	Compare branch = ta branche (feature/...)
	•	Utilise le template de PR fourni pour décrire clairement ce que tu as fait.

5. Merge
	•	Attendre review si besoin.
	•	Vérifier que tout fonctionne.
	•	Faire un squash and merge (pour un historique plus propre).