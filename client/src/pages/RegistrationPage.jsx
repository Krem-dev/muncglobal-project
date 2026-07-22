import React from 'react';
import useRegistration from '../hooks/useRegistration';
import { motion } from 'framer-motion';
import RegistrationForm from '../components/Registration/RegistrationForm';
import PaymentStep from '../components/Registration/PaymentStep';
import SuccessStep from '../components/Registration/SuccessStep';

const RegistrationPage = () => {
  const registrationsOpen = false;

  // Use our custom registration hook
  const {
    step,
    formData,
    paymentData,
    delegateId,
    isLoading,
    handleFormSubmit,
    handlePaymentComplete
  } = useRegistration();

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-teal-500 mb-4">
              Registration opening soon
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              We’re preparing the registration window for MUNC-GH 2027 and will announce the opening date shortly.
            </p>
          </div>

          {registrationsOpen && (
            <div className="mb-10">
              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <div className={`text-sm font-medium ${
                    step >= 1 ? 'text-teal-500' : 'text-gray-500'
                  } ml-2`}>
                    Personal Details
                  </div>
                </div>
                <div className={`flex-grow h-0.5 mx-2 ${
                  step >= 2 ? 'bg-teal-500' : 'bg-gray-200'
                }`}></div>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 2 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <div className={`text-sm font-medium ${
                    step >= 2 ? 'text-teal-500' : 'text-gray-500'
                  } ml-2`}>
                    Payment
                  </div>
                </div>
                <div className={`flex-grow h-0.5 mx-2 ${
                  step >= 3 ? 'bg-teal-500' : 'bg-gray-200'
                }`}></div>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 3 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </div>
                  <div className={`text-sm font-medium ${
                    step >= 3 ? 'text-teal-500' : 'text-gray-500'
                  } ml-2`}>
                    Confirmation
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-[2rem] border border-yellow-200 bg-gradient-to-br from-yellow-50 via-white to-teal-50 p-8 shadow-sm">
            {!registrationsOpen ? (
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-yellow-700 mb-3">Coming soon</p>
                <h3 className="text-2xl md:text-3xl font-semibold text-teal-800 mb-4">
                  Registration for MUNC-GH 2027 will open soon
                </h3>
                <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto mb-6">
                  We’re preparing the registration experience and will share the official opening date shortly. In the meantime, you can explore our past conference highlights and committee archives.
                </p>
                <div className="rounded-2xl border border-teal-100 bg-teal-50 px-5 py-4 text-sm text-teal-800 inline-block">
                  Stay tuned for updates on the official registration launch.
                </div>
              </div>
            ) : (
              <>
                {step === 1 && (
                  <RegistrationForm onSubmit={handleFormSubmit} />
                )}
                
                {step === 2 && (
                  <PaymentStep 
                    formData={formData}
                    onPaymentComplete={handlePaymentComplete}
                  />
                )}
                
                {step === 3 && (
                  <SuccessStep 
                    delegateId={delegateId}
                    formData={formData}
                    paymentData={paymentData}
                  />
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegistrationPage;
