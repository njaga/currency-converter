import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, Linkedin, Globe, Mail } from 'lucide-react';

export default function About() {
  return (
    <>
      <Head>
        <title>À propos | XOF Converter - Développé par Ndiaga Ndiaye</title>
        <meta name="description" content="XOF Converter a été développé par Ndiaga Ndiaye, développeur Full Stack spécialisé dans les applications web modernes et les solutions fintech." />
        <meta name="keywords" content="Ndiaga Ndiaye, développeur, XOF Converter, React, Next.js, Full Stack" />
        <meta property="og:title" content="À propos | XOF Converter - Développé par Ndiaga Ndiaye" />
        <meta property="og:description" content="Découvrez le développeur derrière XOF Converter - Ndiaga Ndiaye, expert en développement web et solutions fintech." />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au convertisseur
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="text-center mb-8">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src="/ndiaga-ndiaye.jpg"
                  alt="Ndiaga Ndiaye"
                  fill
                  className="rounded-full object-cover border-4 border-blue-100"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Ndiaga Ndiaye</h1>
              <p className="text-lg text-gray-600">Développeur Full Stack</p>
            </div>

            <div className="space-y-6 text-gray-600">
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">À propos de moi</h2>
                <p className="leading-relaxed">
                  Passionné par le développement web et les nouvelles technologies, je crée des applications 
                  web modernes et intuitives. Spécialisé dans les solutions fintech et les outils de 
                  productivité, je m&apos;efforce de rendre la technologie accessible à tous.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Expertise</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Développement Full Stack (React, Next.js, Node.js)</li>
                  <li>Applications Web Progressive (PWA)</li>
                  <li>Solutions Fintech</li>
                  <li>UI/UX Design</li>
                  <li>Performance et Optimisation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Projets notables</h2>
                <ul className="space-y-4">
                  <li>
                    <h3 className="font-medium">Noflay</h3>
                    <p className="text-gray-600">
                      Logiciel de gestion de la location immobilière. Dédié aux agences immobilières 
                      et aux particuliers. Génération de documents officiels, comptabilité, gestion 
                      des dossiers, etc.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-medium">Sénégal Commerce</h3>
                    <p className="text-gray-600">
                      Marketplace 100% sénégalaise permettant aux vendeurs de créer facilement leur 
                      boutique en ligne et de toucher une plus large clientèle.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-medium">ColorFusion</h3>
                    <p className="text-gray-600">
                      Suite complète d&apos;outils créatifs pour les designers. Génération de palettes, 
                      manipulation des couleurs et export dans différents formats.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-medium">XOF Converter</h3>
                    <p className="text-gray-600">
                      Convertisseur de devises moderne pour le Franc CFA avec historique des taux 
                      et conversions favorites.
                    </p>
                  </li>
                  <li>
                    <h3 className="font-medium">Document Converter</h3>
                    <p className="text-gray-600">Outil de conversion de documents en ligne</p>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Expérience professionnelle</h2>
                <ul className="space-y-4">
                  <li>
                    <h3 className="font-medium">Kamit Digital Solutions & Innovations</h3>
                    <p className="text-gray-600">Fondateur et directeur général</p>
                    <a 
                      href="https://kamit.tech" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center mt-1"
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      kamit.tech
                    </a>
                  </li>
                  <li>
                    <h3 className="font-medium">Développeur Freelance</h3>
                    <p className="text-gray-600">
                      Spécialisé dans le développement d&apos;applications web modernes et 
                      de solutions sur mesure pour les entreprises.
                    </p>
                  </li>
                </ul>
              </section>

              <div className="flex justify-center space-x-6 pt-6">
                <motion.a
                  href="https://github.com/njaga"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600"
                  whileHover={{ scale: 1.1 }}
                >
                  <Github className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/ndiagandiaye"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600"
                  whileHover={{ scale: 1.1 }}
                >
                  <Linkedin className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="https://ndiagandiaye.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600"
                  whileHover={{ scale: 1.1 }}
                >
                  <Globe className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="mailto:contact@ndiagandiaye.com"
                  className="text-gray-600 hover:text-blue-600"
                  whileHover={{ scale: 1.1 }}
                >
                  <Mail className="w-6 h-6" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
} 