# XOF Currency Converter

<div align="center">
  <img src="public/logo.svg" alt="XOF Converter Logo" width="200"/>

  Un convertisseur de devises moderne et intuitif, spécialement conçu pour la conversion entre le Franc CFA (XOF) et d'autres devises internationales.

  [Voir la démo en direct](https://xof-converter.vercel.app) | [Signaler un bug](https://github.com/njaga/currency-converter/issues) | [Demander une fonctionnalité](https://github.com/njaga/currency-converter/issues)
</div>

## 🌟 Fonctionnalités

- ⚡️ Conversion en temps réel entre différentes devises
- 💾 Sauvegarde locale des conversions favorites
- 📊 Historique des taux de change avec visualisation graphique
- 🔄 Double API pour une fiabilité maximale
- 📱 Interface responsive et moderne
- 🎨 Animations fluides et interactions intuitives
- 🌙 Support de multiples devises (USD, EUR, GBP, JPY, etc.)
- 🔒 Aucun stockage de données personnelles

## 🚀 Technologies Utilisées

- **Frontend:**
  - [Next.js 14](https://nextjs.org/) - Framework React moderne
  - [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitaire
  - [Framer Motion](https://www.framer.com/motion/) - Bibliothèque d'animations
  - [Lucide React](https://lucide.dev/) - Icônes modernes et personnalisables
  - [Recharts](https://recharts.org/) - Bibliothèque de graphiques

- **APIs:**
  - [ExchangeRate-API](https://www.exchangerate-api.com/) - API principale de taux de change
  - [CurrencyAPI](https://currencyapi.com/) - API secondaire (fallback)

## 🛠️ Installation

1. **Clonez le répertoire**
   ```bash
   git clone https://github.com/njaga/currency-converter.git
   ```

2. **Installez les dépendances**
   ```bash
   cd currency-converter
   npm install
   ```
   ou
   ```bash
   yarn install
   ```

3. **Configurez les variables d'environnement**
   ```bash
   cp .env.example .env
   ```
   Ajoutez vos clés API dans le fichier `.env.local`:
   ```
   CURRENCY_API_KEY=votre_clé_ici
   EXCHANGE_RATE_API_KEY=votre_clé_ici
   ```

4. **Démarrez le serveur de développement**
   ```bash
   npm run dev
   ```
   ou
   ```bash
   yarn dev
   ```

5. **Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur**

## 📦 Structure du Projet

- `components/`: Composants React
- `pages/`: Pages Next.js
- `public/`: Fichiers statiques
- `styles/`: Styles globaux
- `utils/`: Fonctions utilitaires

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer votre branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Ndiaga Ndiaye**
- Portfolio: [ndiagandiaye.com](https://ndiagandiaye.com)
- Email: [contact@ndiagandiaye.com](mailto:contact@ndiagandiaye.com)
- GitHub: [@njaga](https://github.com/njaga)

## 💖 Remerciements

- [ExchangeRate-API](https://www.exchangerate-api.com/) pour leur API fiable
- [CurrencyAPI](https://currencyapi.com/) pour leur service de backup
- La communauté open source pour leurs contributions inestimables

---

<div align="center">
  Développé avec ❤️ par <a href="https://ndiagandiaye.com">Ndiaga Ndiaye</a>
</div>
