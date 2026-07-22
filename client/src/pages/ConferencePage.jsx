import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ConferencePage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Committee data - mapped to PDF files
  const committees = [
    {
      id: 'who',
      name: 'World Health Organization (WHO)',
      file: '/files/WHO.pdf'
    },
    {
      id: 'disec',
      name: 'Disarmament and International Security Committee (DISEC)',
      file: '/files/DISEC.pdf'
    },
    {
      id: 'sochum',
      name: 'Social, Humanitarian and Cultural Committee (SOCHUM)',
      file: '/files/SOCHUM.pdf'
    },
    {
      id: 'unep',
      name: 'UN Environment Programme (UNEP)',
      file: '/files/UNEP.pdf'
    },
    {
      id: 'ecofin',
      name: 'Economic and Financial Committee (ECOFIN)',
      file: '/files/ECOFIN.pdf'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 text-white py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div
              className="lg:max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm uppercase tracking-widest text-yellow-200 mb-4">Past Conference Archive</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">MUNC-GH 2025 Conference</h1>
              <p className="text-xl md:text-2xl font-light mb-6">"Securing the Future through Innovation and Inclusion"</p>
              <p className="max-w-3xl text-gray-200 mb-8">
                Explore the 2025 conference experience with gallery moments, committee topics, background guides, awardees, dais members, and delegate stories.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#explore-2025" className="btn bg-yellow-300 text-teal-800 hover:bg-yellow-400">Explore 2025</a>
                <Link to="/registration" className="btn bg-white text-teal-700 hover:bg-teal-100">Register for 2027</Link>
              </div>
            </motion.div>

            <motion.div
              className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <img
                src="/images/event.JPG"
                alt="MUNC-GH 2025 Conference"
                className="w-full h-full object-cover min-h-[360px]"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold text-teal-800 mb-6">What You Can Explore</h2>
              <p className="text-gray-700 mb-6">
                This conference page preserves the full MUNC-GH 2025 experience while we prepare for future conferences.
              </p>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-teal-600">•</span>
                  <span><strong>Gallery</strong> — browse photos and event highlights from the 2025 conference.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-teal-600">•</span>
                  <span><strong>Committees & Topics</strong> — review committees used alongside topics and agendas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-teal-600">•</span>
                  <span><strong>Background Guides</strong> — access the research resources and committee briefs.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-teal-600">•</span>
                  <span><strong>Resolutions</strong> — read the adopted and working resolutions from the conference.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-teal-600">•</span>
                  <span><strong>Awardees</strong> — see the delegates and teams recognized for excellence.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-teal-600">•</span>
                  <span><strong>Dais & Delegates</strong> — learn about dais leadership and delegate participation.</span>
                </li>
              </ul>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-teal-50 rounded-3xl p-10 shadow-lg">
              <h3 className="text-2xl font-semibold text-teal-800 mb-4">Archive Highlights</h3>
              <p className="text-gray-700 mb-4">
                The 2025 archive preserves official documents, committee guides, photos, and records of the conference.
              </p>
              <div className="space-y-4">
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-sm uppercase tracking-widest text-teal-600 mb-2">Committee Topics</p>
                  <p className="text-gray-700">Review committee topics and supporting background materials for the 2025 conference.</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-sm uppercase tracking-widest text-teal-600 mb-2">Resolutions</p>
                  <p className="text-gray-700">See the working papers and final resolutions produced during the event.</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="text-sm uppercase tracking-widest text-teal-600 mb-2">Awardees</p>
                  <p className="text-gray-700">Recognized delegates, outstanding speakers, and leadership contributions.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Committees */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={containerVariants}
            className="mb-16"
          >
            <motion.div variants={itemVariants} className="text-center mb-10">
              <h2 className="text-3xl font-bold text-teal-800 mb-4">Conference Committees</h2>
              <p className="text-gray-700 max-w-3xl mx-auto">
                MUNCGLOBAL Conference 2025 features 5 diverse committees covering a wide range of global issues. 
                Delegates will have the opportunity to represent countries and engage in substantive 
                debates on these topics while developing critical diplomatic and leadership skills.
              </p>
            </motion.div>
            
            <motion.div 
              id="explore-2025"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={containerVariants}
            >
              {committees.map((committee) => (
                <motion.div
                  key={committee.id}
                  className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <a href={committee.file} download className="block">
                    <h3 className="text-lg font-semibold text-teal-700 mb-2 hover:text-teal-900">{committee.name}</h3>
                    <div className="mt-3 text-teal-600 text-sm flex items-center">
                      <span>Download Guide</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Registration CTA */}
          <motion.div
            className="bg-teal-50 p-8 rounded-xl text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-teal-800 mb-4">Prepare for MUNC-GH 2027</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              While the 2025 archive preserves past conference moments, registration for MUNC-GH 2027 is opening soon.
              Stay updated and secure your place when registration goes live.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/registration" 
                className="px-8 py-3 bg-teal-700 text-white font-medium rounded-md hover:bg-teal-800 transition-colors"
              >
                Register for 2027
              </Link>
              <Link 
                to="/conference" 
                className="px-8 py-3 bg-white text-teal-700 border border-teal-700 font-medium rounded-md hover:bg-teal-50 transition-colors"
              >
                Explore 2025 Archive
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ConferencePage;
