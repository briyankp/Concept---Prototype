import React, { useState } from 'react';
import Header from '../components/Header';
import { useNavigation } from '../App';
import { BillType, Screen } from '../types';

enum FlowStep {
  SelectBiller,
  EnterDetails,
  SuccessAndRegisterPrompt,
  EnterMobile,
  OTP,
  Success,
}

const BillPaymentFlow: React.FC = () => {
  const [step, setStep] = useState<FlowStep>(FlowStep.SelectBiller);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [legalConsent, setLegalConsent] = useState(false);
  const [promoConsent, setPromoConsent] = useState(false);


  const renderStep = () => {
    switch (step) {
      case FlowStep.SelectBiller:
        return <SelectBillerScreen onSelect={() => setStep(FlowStep.EnterDetails)} />;
      case FlowStep.EnterDetails:
        return <EnterDetailsScreen onContinue={() => setStep(FlowStep.SuccessAndRegisterPrompt)} />;
      case FlowStep.SuccessAndRegisterPrompt:
        return <SuccessAndRegisterPromptScreen onRegister={() => setStep(FlowStep.EnterMobile)} />;
      case FlowStep.EnterMobile:
        return <EnterMobileScreen 
            mobile={mobileNumber} 
            setMobile={setMobileNumber} 
            legalConsent={legalConsent} 
            setLegalConsent={setLegalConsent}
            promoConsent={promoConsent}
            setPromoConsent={setPromoConsent}
            onContinue={() => setStep(FlowStep.OTP)} 
        />;
      case FlowStep.OTP:
        return <OTPScreen mobile={mobileNumber} otp={otp} setOtp={setOtp} onVerify={() => setStep(FlowStep.Success)} />;
      case FlowStep.Success:
        return <SuccessScreen isRegistered={true} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch(step) {
        case FlowStep.SelectBiller: return "Select Biller";
        case FlowStep.EnterDetails: return "Electricity Bill";
        case FlowStep.SuccessAndRegisterPrompt: return "Payment Successful";
        case FlowStep.EnterMobile: return "Register Customer";
        case FlowStep.OTP: return "Verify OTP";
        case FlowStep.Success: return "Success";
        default: return "Bill Payment";
    }
  }

  return (
    <div>
        <Header title={getTitle()} showBackButton={step !== FlowStep.Success} />
        {renderStep()}
    </div>
  );
};

const SelectBillerScreen: React.FC<{onSelect: (biller: BillType) => void}> = ({onSelect}) => (
    <div className="p-4">
        <p className="text-gray-600 mb-4">Choose a category to pay a bill.</p>
        <div className="grid grid-cols-3 gap-4">
            {Object.values(BillType).map(biller => (
                <button key={biller} onClick={() => onSelect(biller)} className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:bg-orange-50">
                    <span className="text-3xl mb-2">
                        {
                            { [BillType.Electricity]: '⚡️', [BillType.Water]: '💧', [BillType.Gas]: '🔥', [BillType.Mobile]: '📱', [BillType.DTH]: '📺' }[biller]
                        }
                    </span>
                    <span className="text-sm text-center text-gray-700">{biller}</span>
                </button>
            ))}
        </div>
    </div>
);

const EnterDetailsScreen: React.FC<{onContinue: () => void}> = ({onContinue}) => (
    <div className="p-4 space-y-4">
        <div>
            <label className="text-sm font-medium text-gray-700">Consumer Number</label>
            <input type="text" defaultValue="1029384756" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
        </div>
        <div>
            <label className="text-sm font-medium text-gray-700">Amount</label>
            <input type="text" defaultValue="850" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
        </div>
        <button onClick={onContinue} className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-md">Proceed to Pay</button>
    </div>
);

const SuccessAndRegisterPromptScreen: React.FC<{ onRegister: () => void }> = ({ onRegister }) => {
    const { navigate } = useNavigation();
    return (
        <div className="p-6 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Payment of ₹850 Successful!</h2>
             <div className="my-4 w-full bg-yellow-100 text-yellow-800 p-4 rounded-lg">
                <p className="font-bold">🎉 Your customer earned 50 points!</p>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6 w-full">
                <h2 className="text-xl font-bold text-gray-800">Register Customer for Benefits?</h2>
                <p className="text-gray-600 my-4">Get bill reminders & earn rewards. Customer gets ₹5 cashback on registration!</p>
                <div className="space-y-3">
                    <button onClick={onRegister} className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-md">Register Customer (ग्राहक रजिस्टर करें)</button>
                    <button onClick={() => navigate(Screen.Dashboard)} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg">Not Now</button>
                </div>
            </div>
        </div>
    );
};

const EnterMobileScreen: React.FC<{
    mobile: string, 
    setMobile: (m: string) => void, 
    legalConsent: boolean, 
    setLegalConsent: (c: boolean) => void, 
    promoConsent: boolean,
    setPromoConsent: (c: boolean) => void,
    onContinue: () => void
}> = ({ mobile, setMobile, legalConsent, setLegalConsent, promoConsent, setPromoConsent, onContinue }) => (
     <div className="p-4 space-y-4">
        <div>
            <label className="text-sm font-medium text-gray-700">Customer Mobile Number</label>
            <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Enter 10-digit mobile number" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
        </div>
        <div className="space-y-3">
            <div className="flex items-start space-x-3">
                <input 
                    id="legal-consent-checkbox"
                    type="checkbox" 
                    checked={legalConsent}
                    onChange={(e) => setLegalConsent(e.target.checked)}
                    className="h-5 w-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                    aria-required="true"
                />
                <label htmlFor="legal-consent-checkbox" className="text-sm text-gray-600">
                    I consent to receive legal and transactional reminders.
                </label>
            </div>
            <div className="flex items-start space-x-3">
                <input 
                    id="promo-consent-checkbox"
                    type="checkbox" 
                    checked={promoConsent}
                    onChange={(e) => setPromoConsent(e.target.checked)}
                    className="h-5 w-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                />
                <label htmlFor="promo-consent-checkbox" className="text-sm text-gray-600">
                    I agree to receive promotions and rewards information.
                </label>
            </div>
        </div>
        <button onClick={onContinue} disabled={mobile.length !== 10 || !legalConsent} className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-md disabled:bg-gray-300">Send OTP</button>
    </div>
);

const OTPScreen: React.FC<{mobile: string, otp: string, setOtp: (o: string) => void, onVerify: () => void}> = ({mobile, otp, setOtp, onVerify}) => {
    const maskedMobile = `******${mobile.slice(-4)}`;
    return (
        <div className="p-4 space-y-4 text-center">
            <p className="text-gray-600">Enter the 4-digit OTP sent to {maskedMobile}</p>
            <div>
                <input type="tel" value={otp} onChange={e => setOtp(e.target.value)} maxLength={4} placeholder="----" className="tracking-[1em] text-center text-2xl font-bold mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
            </div>
            <button onClick={onVerify} disabled={otp.length !== 4} className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-md disabled:bg-gray-300">Verify & Complete Payment</button>
            <button className="text-sm text-orange-500 mt-2">Resend OTP</button>
        </div>
    );
};

const SuccessScreen: React.FC<{isRegistered: boolean}> = ({isRegistered}) => {
    const { navigate } = useNavigation();

    return (
        <div className="p-6 text-center flex flex-col items-center justify-center h-[80vh]">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Payment of ₹850 Successful!</h2>
            {isRegistered && (
                <div className="mt-4 bg-orange-100 text-orange-700 p-4 rounded-lg">
                    <p className="font-bold">Customer Registered!</p>
                    <p className="text-sm">They'll get reminders + ₹5 cashback.</p>
                </div>
            )}
             <div className="mt-4 bg-yellow-100 text-yellow-800 p-4 rounded-lg">
                <p className="font-bold">🎉 Your customer earned 50 points!</p>
            </div>
            <button onClick={() => navigate(Screen.Dashboard)} className="mt-8 w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg shadow-md">Back to Home</button>
        </div>
    );
}

export default BillPaymentFlow;