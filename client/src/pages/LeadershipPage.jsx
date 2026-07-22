import React from 'react';
import { motion } from 'framer-motion';

const LeadershipPage = () => {
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

  // Leadership team data
  const leadershipTeam = [
    {
      name: "Owusu Ababio Godisking Ameyaw",
      role: "Executive Chairman",
      description: "Dedicated to empowering young leaders and championing innovative social initiatives.",
      image: '/images/Godisking.JPG',
      tags: ['Corporate Governance Specialist', 'FinTech & Commercial Law']
    },
    {
      name: "Asante Samuel Christian",
      role: "Programs Director",
      description: "Extensive experience in designing and delivering leadership development and community engagement initiatives.",
      image: '/images/Samuel.jpeg',
      tags: ['Leadership Development', 'Program Strategy']
    },
    {
      name: "Kwadwo Marfo",
      role: "Operations Manager",
      description: "Focused on delivery, coordination, and operational excellence across all MUNCGLOBAL events.",
      image: '/images/leadership.JPG',
      tags: ['Event Operations', 'Logistics & Coordination']
    }
  ];


  return (
    <div className="bg-white py-16">
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-teal-800 mb-4">Our Leadership Team</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Our diverse leadership team unites strengths in youth empowerment, diplomatic training, and community‑focused impact.
          </p>
        </motion.div>

        {/* Featured Leadership */}
        <div className="grid gap-6 md:grid-cols-3">
          {leadershipTeam.map((leader, index) => (
            <motion.div
              key={leader.name}
              className="group h-[420px] [perspective:1200px]"
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <div className="relative h-full w-full rounded-3xl shadow-xl transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                <div className="absolute inset-0 overflow-hidden rounded-3xl border border-gray-100 bg-white [backface-visibility:hidden]">
                  <div className="h-3/4 overflow-hidden bg-gray-100">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="h-1/4 p-5 text-left">
                    <h4 className="text-xl font-semibold text-teal-900 mb-1">{leader.name}</h4>
                    <p className="text-teal-600 text-sm font-medium">{leader.role}</p>
                  </div>
                </div>

                <div className="absolute inset-0 flex flex-col justify-center rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-700 to-teal-900 p-6 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <p className="text-sm uppercase tracking-[0.3em] text-teal-100 mb-4">About</p>
                  <h4 className="text-2xl font-semibold mb-3">{leader.name}</h4>
                  <p className="text-sm leading-relaxed text-teal-50 mb-5">{leader.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {leader.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-teal-50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LeadershipPage;
