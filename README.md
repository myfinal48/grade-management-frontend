# 📚 Grade Management System - Documentation Fonctionnelle

## 👥 Membres de l'équipe

- Jean Vincent YOUMSSI TOGUEM
- Jake Melvin TIOKOU
- Belvinard POUADJEU
- Hassan Mahamat DOGO
- Loïc Luc KENMOE MBEUKEM

## 🚀 Lancement du projet

### Prérequis
- Node.js (version 18 ou supérieure)
- npm (version 9 ou supérieure) ou yarn

### Installation
1. Cloner le dépôt :
   ```bash
   git clone <url-du-depot>
   cd grade-management-frontend
   ```

2. Installer les dépendances :
   ```bash
   npm install
   # ou
   yarn install
   ```

### Développement
Pour lancer l'application en mode développement :
```bash
npm run dev
# ou
yarn dev
```

### Production
Pour construire l'application pour la production :
```bash
npm run build
# ou
yarn build
```

Puis pour démarrer le serveur de production :
```bash
npm start
# ou
yarn start
```

### Variables d'environnement
Créez un fichier `.env.local` à la racine du projet avec les variables nécessaires (consultez le fichier `.env.template` pour référence).

## 📚 Documentation


## 🎯 Objectif Fonctionnel


Le système de gestion des notes est une plateforme académique complète permettant la gestion des utilisateurs, cours, notes et relevés avec un système de validation multi-niveaux basé sur les rôles utilisateur.


## 🏗️ Principes Fonctionnels


### Architecture Multi-Rôles
- **Validation flow** : Défini par rôle utilisateur (ADMIN, TEACHER, STUDENT) avec des permissions spécifiques
- **Validation step** : Chaque action est validée selon le rôle et les permissions de l'utilisateur
- **Role-based access** : Contrôle d'accès granulaire avec redirection automatique selon les droits
- **Hiérarchie** : ADMIN > TEACHER > STUDENT avec délégation de permissions
- **Restrictions** : Séparation des responsabilités et validation croisée


### Workflow de Validation
- **Authentification** : Connexion sécurisée avec gestion de session
- **Autorisation** : Vérification des droits sur chaque action
- **Audit Trail** : Journalisation des actions utilisateurs
- **Notifications** : Système d'alertes et de rappels


## 💻 Interfaces Utilisateur


### Dashboard Administrateur
#### Gestion des Utilisateurs
- **Création d'utilisateurs** : Formulaire complet avec attribution de rôle
- **Modification des profils** : Édition des informations personnelles
- **Gestion des rôles** : Attribution et modification des permissions
- **Suppression d'utilisateurs** : Avec confirmation et sauvegarde des données


#### Gestion de la Structure Académique
- **Universités** : Création et gestion des établissements
- **Filières** : Configuration des parcours d'études
- **Niveaux** : Définition des années d'études (L1, L2, L3, M1, M2)
- **Semestres** : Organisation temporelle des enseignements


#### Gestion des Cours
- **Création de cours** : Code, nom, description, crédits
- **Affectation d'enseignants** : Attribution des cours aux professeurs
- **Planification** : Organisation par semestre et filière
- **Modification** : Mise à jour des informations de cours


#### Supervision des Notes
- **Vue globale** : Consultation de toutes les notes du système
- **Validation** : Approbation des notes saisies par les enseignants
- **Corrections** : Modification des notes en cas d'erreur
- **Historique** : Suivi des modifications avec horodatage


#### Gestion des Relevés de Notes
- **Génération automatique** : Création basée sur les notes validées
- **Export multi-format** : PDF et Excel disponibles
- **Envoi par email** : Distribution automatique aux étudiants
- **Templates personnalisables** : Modèles d'emails configurables


### Dashboard Enseignant
#### Mes Cours
- **Liste des cours assignés** : Vue d'ensemble des enseignements
- **Détails par cours** : Informations complètes (étudiants inscrits, crédits)
- **Planification** : Calendrier des cours et examens


#### Gestion des Notes
- **Saisie des notes** : Interface intuitive par cours et étudiant
- **Modification** : Correction des notes avant validation finale
- **Calculs automatiques** : Moyennes avec coefficients et crédits
- **Suivi des étudiants** : Consultation des performances individuelles


### Dashboard Étudiant
#### Consultation des Notes
- **Mes notes par cours** : Vue détaillée par matière
- **Moyennes par semestre** : Calculs automatiques avec crédits
- **Historique complet** : Évolution des performances
- **Notifications** : Alertes lors de nouvelles notes


#### Relevés de Notes
- **Accès aux relevés officiels** : Documents certifiés
- **Téléchargement PDF** : Format imprimable
- **Historique des relevés** : Archive complète du parcours


### Fonctionnalités Communes
#### Interface Utilisateur
- **Navigation responsive** : Adaptation mobile/tablette/desktop
- **Thème sombre/clair** : Personnalisation de l'affichage
- **Sidebar contextuelle** : Navigation adaptée au rôle
- **Notifications temps réel** : Alertes et confirmations


#### Authentification et Sécurité
- **Connexion sécurisée** : Email/mot de passe avec validation
- **Gestion de session** : Déconnexion automatique après inactivité
- **Récupération de mot de passe** : Processus de réinitialisation
- **Audit des connexions** : Journalisation des accès


## 🧾 Règles de Gestion


### Validation des Notes
#### Règles de Saisie
- **Autorisation** : Seuls les enseignants peuvent saisir les notes de leurs cours
- **Format** : Notes sur 20 avec décimales autorisées
- **Validation** : Contrôle de cohérence (0 ≤ note ≤ 20)
- **Historique** : Traçabilité de toutes les modifications


#### Processus de Validation
- **Saisie enseignant** : Première étape de création
- **Vérification automatique** : Contrôles de cohérence
- **Validation administrative** : Approbation finale par l'admin
- **Verrouillage** : Impossibilité de modification après validation


### Gestion des Relevés
#### Génération Automatique
- **Déclenchement** : Basé sur les notes validées du semestre
- **Calculs** : Moyennes pondérées avec coefficients et crédits
- **Mentions** : Attribution automatique selon les seuils
- **Validation** : Contrôle qualité avant diffusion


#### Distribution
- **Format PDF** : Document officiel avec en-tête établissement
- **Envoi email** : Distribution automatique aux étudiants
- **Archive** : Sauvegarde permanente dans le système
- **Réimpression** : Possibilité de régénération


### Contrôle d'Accès
#### Authentification
- **Connexion obligatoire** : Accès conditionné à l'authentification
- **Session sécurisée** : Durée limitée avec renouvellement
- **Déconnexion automatique** : Après période d'inactivité
- **Tentatives limitées** : Protection contre les attaques


#### Autorisation par Rôle
- **Administrateur** : Accès complet à toutes les fonctionnalités
- **Enseignant** : Limité à ses cours et étudiants
- **Étudiant** : Consultation de ses propres données uniquement
- **Redirection automatique** : Vers les pages autorisées


## 🔑 Matrice des Permissions


### Administrateur (ADMIN)
| Fonctionnalité | Créer | Lire | Modifier | Supprimer |
|----------------|-------|------|----------|-----------|
| Utilisateurs | ✅ | ✅ | ✅ | ✅ |
| Structure académique | ✅ | ✅ | ✅ | ✅ |
| Cours | ✅ | ✅ | ✅ | ✅ |
| Notes (toutes) | ✅ | ✅ | ✅ | ✅ |
| Relevés | ✅ | ✅ | ✅ | ✅ |
| Templates email | ✅ | ✅ | ✅ | ✅ |


### Enseignant (TEACHER)
| Fonctionnalité | Créer | Lire | Modifier | Supprimer |
|----------------|-------|------|----------|-----------|
| Cours assignés | ❌ | ✅ | ❌ | ❌ |
| Notes (ses cours) | ✅ | ✅ | ✅ | ❌ |
| Étudiants (ses cours) | ❌ | ✅ | ❌ | ❌ |
| Profil personnel | ❌ | ✅ | ✅ | ❌ |


### Étudiant (STUDENT)
| Fonctionnalité | Créer | Lire | Modifier | Supprimer |
|----------------|-------|------|----------|-----------|
| Ses notes | ❌ | ✅ | ❌ | ❌ |
| Ses relevés | ❌ | ✅ | ❌ | ❌ |
| Profil personnel | ❌ | ✅ | ✅ | ❌ |


## 📌 Cas d'Usage (User Stories)


### Module Utilisateurs
- **US001** : En tant qu'administrateur, je peux créer un nouvel utilisateur avec son rôle pour l'intégrer au système
- **US002** : En tant qu'administrateur, je peux modifier les informations d'un utilisateur pour maintenir les données à jour
- **US003** : En tant qu'utilisateur, je peux me connecter avec mes identifiants pour accéder à mon espace personnel


### Module Structure Académique
- **US004** : En tant qu'administrateur, je peux créer une nouvelle université pour étendre le périmètre du système
- **US005** : En tant qu'administrateur, je peux définir les filières et niveaux pour organiser les parcours d'études
- **US006** : En tant qu'administrateur, je peux configurer les semestres pour planifier l'année académique


### Module Cours
- **US007** : En tant qu'administrateur, je peux créer un cours et l'assigner à un enseignant
- **US008** : En tant qu'enseignant, je peux consulter la liste de mes cours assignés
- **US009** : En tant qu'enseignant, je peux voir les étudiants inscrits à mes cours


### Module Notes
- **US010** : En tant qu'enseignant, je peux saisir les notes de mes étudiants pour évaluer leurs performances
- **US011** : En tant qu'administrateur, je peux valider les notes saisies par les enseignants
- **US012** : En tant qu'étudiant, je peux consulter mes notes par cours et semestre


### Module Relevés
- **US013** : En tant qu'administrateur, je peux générer les relevés de notes des étudiants
- **US014** : En tant qu'administrateur, je peux exporter les relevés en format PDF ou Excel
- **US015** : En tant qu'étudiant, je peux télécharger mes relevés de notes officiels


### Module Communication
- **US016** : En tant qu'administrateur, je peux configurer des templates d'email pour standardiser les communications
- **US017** : En tant qu'administrateur, je peux envoyer les relevés par email aux étudiants
- **US018** : En tant qu'administrateur, je peux consulter l'historique des emails envoyés


## 🚀 État Fonctionnel du Projet


### Fonctionnalités Opérationnelles (v0.1.0 - 2025)
✅ **Authentification multi-rôles** : Connexion sécurisée avec gestion des permissions
✅ **Gestion complète des utilisateurs** : CRUD avec attribution de rôles
✅ **Structure académique** : Universités, filières, niveaux, semestres
✅ **Gestion des cours** : Création et affectation aux enseignants
✅ **Saisie et consultation des notes** : Interface intuitive par rôle
✅ **Interface responsive** : Adaptation tous écrans
✅ **Thème personnalisable** : Mode sombre/clair


### En Cours de Finalisation
🔄 **Génération automatique des relevés** : Calculs et mise en forme
🔄 **Système d'email avancé** : Templates et envoi automatique
🔄 **Tableau de bord analytique** : Statistiques et graphiques


### Prochaines Évolutions
📋 **Workflow de validation avancé** : Processus d'approbation multi-étapes
📋 **Notifications push** : Alertes temps réel
📋 **Export avancé** : Formats multiples et personnalisation
📋 **API mobile** : Synchronisation avec applications mobiles
📋 **Intégrations externes** : Connexion avec autres systèmes académiques


## 🎯 Objectifs Métier


### Court Terme (3 mois)
- Finalisation du système de relevés automatiques
- Déploiement en environnement de production
- Formation des utilisateurs finaux


### Moyen Terme (6 mois)
- Intégration avec le système d'information existant
- Développement de l'application mobile
- Mise en place des tableaux de bord analytiques


### Long Terme (12 mois)
- Extension multi-établissements
- Intelligence artificielle pour l'analyse prédictive
- Plateforme d'échange inter-universitaire


---


*Documentation fonctionnelle validée par les utilisateurs métier*


# 🛠️ Grade Management System - Documentation Technique


## 🎯 Objectif Technique


Application web moderne basée sur Next.js 15 avec architecture multi-rôles, authentification JWT et gestion d'état optimisée pour la performance et la sécurité.


## 🏗️ Architecture Technique


### Stack Technologique
- **Frontend** : Next.js 15, React 19, TypeScript
- **Styling** : Tailwind CSS 4, Radix UI, Lucide Icons
- **State Management** : TanStack Query, React Hook Form
- **Authentication** : NextAuth.js v5 avec JWT
- **HTTP Client** : Axios avec intercepteurs
- **Validation** : Zod schemas
- **Charts** : Recharts pour les visualisations


### Structure du Projet
```
grade-management-frontend/
├── app/                    # App Router (Next.js 15)
│   ├── (auth)/            # Routes d'authentification
│   ├── (protected)/       # Routes protégées avec middleware
│   └── api/               # API routes
├── components/            # Composants réutilisables
│   ├── global/           # Composants globaux
│   ├── layout/           # Composants de mise en page
│   ├── modules/          # Composants métier par module
│   └── ui/               # Composants UI de base
├── hooks/                # Custom hooks React
├── lib/                  # Utilitaires et configurations
├── providers/            # Context providers
├── services/             # Services API
└── types/                # Définitions TypeScript
```


### Patterns Architecturaux
- **Parallel Routes** : Rendu conditionnel selon le rôle utilisateur
- **Server Components** : Optimisation des performances
- **Client Components** : Interactivité côté client
- **Custom Hooks** : Logique métier réutilisable
- **Service Layer** : Abstraction des appels API


## 📊 Modèle de Données


### Entités Principales


#### Users (Utilisateurs)
```typescript
interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  registrationNumber: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
}
```


#### Courses (Cours)
```typescript
interface Course {
  id: number
  code: string
  name: string
  description: string
  credit: number
  semesterId: number
  teacherId: number
}
```


#### Grades (Notes)
```typescript
interface Grade {
  id: number
  student: User
  course: Course
  value: number
  createdAt: string
  updatedAt: string
}
```


#### Transcripts (Relevés)
```typescript
interface Transcript {
  nom: string
  matricule: string
  filiere: string
  niveau: string
  semestre: string
  notes: Note[]
  moyenne: number
  mention: string
  creditsInscrits: number
  creditsValides: number
}
```


### Structure Académique
- **Universities** : Établissements d'enseignement
- **Levels** : Niveaux d'études (L1, L2, L3, M1, M2)
- **Majors** : Filières d'études
- **Semesters** : Semestres académiques


## 🔐 Système d'Authentification


### Configuration NextAuth.js
```typescript
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  providers: [Credentials],
  callbacks: { jwt, session },
  pages: { signIn: "/login" }
}
```


### Workflow d'Authentification
1. **Login** : Validation des credentials via API backend
2. **JWT Generation** : Création du token avec rôle utilisateur
3. **Session Management** : Stockage sécurisé côté client
4. **Auto-refresh** : Renouvellement automatique des tokens


### Middleware de Protection
```typescript
// Vérification des rôles sur routes protégées
const { session } = await getAuthenticatedUser({
  allowedRoles: [UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT],
  authRedirect: "/login",
  authzRedirect: "/unauthorized"
})
```


## 🌐 Services API


### Architecture des Services
```typescript
// Pattern de service générique
export const gradeService = {
  getAll: () => apiClient.get<GradeResponseData[]>('/grades'),
  getById: (id: number) => apiClient.get<GradeResponseData>(`/grades/${id}`),
  create: (grade: GradeRequestData) => apiClient.post<GradeResponseData>('/grades', grade),
  update: (id: number, grade: GradeRequestData) => apiClient.put<GradeResponseData>(`/grades/${id}`, grade),
  delete: (id: number) => apiClient.delete<void>(`/grades/${id}`)
}
```


### Configuration Axios
```typescript
// Intercepteurs pour authentification et gestion d'erreurs
apiClient.interceptors.request.use((config) => {
  const token = getSession()?.accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```


## 🎨 Système de Composants


### Architecture UI
- **Radix UI** : Composants accessibles et non-stylés
- **Tailwind CSS** : Styling utilitaire avec design system
- **Lucide React** : Icônes cohérentes
- **CVA** : Variants de composants typés


### Composants Globaux
```typescript
// Exemple de composant réutilisable
interface SubmitButtonProps {
  isLoading?: boolean
  children: React.ReactNode
  variant?: 'default' | 'destructive'
}
```


### Hooks Personnalisés
```typescript
// Hook de gestion d'état avec TanStack Query
export function useGrades() {
  return useQuery({
    queryKey: ['grades'],
    queryFn: gradeService.getAll,
    staleTime: 5 * 60 * 1000
  })
}
```


## 📱 Responsive Design


### Breakpoints Tailwind
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px  
- **Desktop** : > 1024px


### Hook Mobile Detection
```typescript
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>()
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: 767px)`)
    const onChange = () => setIsMobile(window.innerWidth < 768)
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < 768)
    return () => mql.removeEventListener("change", onChange)
  }, [])
  return !!isMobile
}
```


## 🔧 Configuration et Déploiement


### Variables d'Environnement
```env
NEXTAUTH_SECRET="clé_secrète_jwt"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:8888/api/v1"
```


### Scripts de Build
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```


### Installation et Lancement
```bash
# Installation des dépendances
pnpm install


# Configuration environnement
cp env.template .env


# Développement
pnpm dev


# Production
pnpm build && pnpm start
```


## 🔒 Sécurité Technique


### Authentification
- **JWT** : Tokens signés avec expiration (24h)
- **HTTPS** : Communication chiffrée obligatoire
- **CSRF Protection** : Protection intégrée NextAuth.js


### Validation des Données
```typescript
// Schemas Zod pour validation
const GradeSchema = z.object({
  studentId: z.number().positive(),
  courseId: z.number().positive(),
  value: z.number().min(0).max(20)
})
```


### Gestion des Erreurs
```typescript
// Intercepteur d'erreurs global
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      signOut({ callbackUrl: '/login' })
    }
    return Promise.reject(error)
  }
)
```


## 📊 Performance et Optimisation


### Stratégies de Cache
- **TanStack Query** : Cache intelligent des requêtes API
- **Next.js Cache** : Cache statique et dynamique
- **Stale-While-Revalidate** : Données fraîches en arrière-plan


### Optimisations Bundle
- **Tree Shaking** : Élimination du code mort
- **Code Splitting** : Chargement à la demande
- **Image Optimization** : Optimisation automatique Next.js


### Monitoring
- **Error Boundaries** : Gestion des erreurs React
- **Performance Metrics** : Métriques Web Vitals
- **Loading States** : États de chargement cohérents


---


*Documentation technique maintenue par l'équipe de développement*

