import React from 'react';
import { motion } from 'framer-motion';

const AboutPage = () => {
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

  return (
    <div className="bg-gradient-to-b from-white via-teal-50/40 to-white py-16">
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div className="mx-auto max-w-4xl text-center mb-14" variants={itemVariants}>
          <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-1 text-sm font-medium text-teal-700 mb-4">
            About MUNCGLOBAL
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-teal-800 mb-4">
            Building confident young leaders for a connected world
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            MUNCGLOBAL empowers young people through diplomacy, leadership development, and community-driven impact. We create spaces where curiosity becomes confidence and ideas become action.
          </p>
        </motion.div>

        <motion.div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] mb-16" variants={itemVariants}>
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-teal-600 mb-3">Who we are</p>
            <h3 className="text-2xl font-semibold text-teal-800 mb-4">
              We equip youth to think globally and lead locally.
            </h3>
            <p className="text-gray-700 leading-relaxed mb-5">
              Our programs bring together students and young professionals to explore international affairs, strengthen public speaking, and develop practical solutions for the challenges facing their communities.
            </p>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-teal-600" />
                <span>We provide immersive Model UN experiences that build analytical thinking and diplomacy.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-teal-600" />
                <span>We create inclusive spaces for collaboration, mentorship, and personal growth.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-teal-600" />
                <span>We inspire young leaders to turn ideas into meaningful action at home and abroad.</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-teal-800 to-teal-600 p-8 text-white shadow-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-teal-100 mb-3">Our values</p>
            <ul className="space-y-3 text-sm leading-relaxed">
              <li className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3"><strong>Excellence</strong> — we deliver meaningful experiences with care and discipline.</li>
              <li className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3"><strong>Integrity</strong> — we lead with respect, accountability, and honesty.</li>
              <li className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3"><strong>Innovation</strong> — we encourage bold thinking and future-ready solutions.</li>
              <li className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3"><strong>Inclusivity</strong> — we welcome diverse voices and shared opportunity.</li>
            </ul>
          </div>
        </motion.div>

        <motion.div className="grid gap-8 md:grid-cols-2 mb-16" variants={itemVariants}>
          <div className="rounded-3xl bg-teal-50 p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-teal-600 mb-3">Mission</p>
            <h3 className="text-2xl font-semibold text-teal-800 mb-4">
              To equip young people with the voice, insight, and courage to lead meaningful change.
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Through immersive Model UN experiences, mentorship, and community programs, we help learners build confidence and turn ideas into lasting impact.
            </p>
          </div>

          <div className="rounded-3xl bg-green-50 p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-green-700 mb-3">Vision</p>
            <h3 className="text-2xl font-semibold text-green-800 mb-4">
              A generation of youth who lead with empathy, innovation, and purpose.
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We imagine a future where young people from every background can participate in global conversations and shape more inclusive, sustainable communities.
            </p>
          </div>
        </motion.div>

        <motion.div className="rounded-[2rem] border border-teal-100 bg-gradient-to-br from-teal-800 via-teal-700 to-teal-900 p-8 text-white shadow-lg" variants={itemVariants}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-teal-100 mb-2">Our impact</p>
              <h3 className="text-2xl md:text-3xl font-semibold">Shaping confident leaders and stronger communities</h3>
            </div>
            <p className="max-w-2xl text-teal-50/90 leading-relaxed">
              Every program is designed to strengthen confidence, public speaking, collaboration, and civic engagement in ways that last beyond the event.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-sm">
              <h4 className="text-3xl font-bold text-white mb-2">500+</h4>
              <p className="text-sm text-teal-50/90">Youth engaged in leadership and civic programs</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-sm">
              <h4 className="text-3xl font-bold text-white mb-2">100+</h4>
              <p className="text-sm text-teal-50/90">Young leaders trained through workshops and mentorship</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-sm">
              <h4 className="text-3xl font-bold text-white mb-2">30+</h4>
              <p className="text-sm text-teal-50/90">Schools and communities reached across the region</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
