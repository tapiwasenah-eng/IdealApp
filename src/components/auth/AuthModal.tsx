import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

type AuthTab = 'signin' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: AuthTab;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'signin',
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" closeOnBackdrop>
      {/* Tab switcher */}
      <div className="flex border-b border-[#E5E7EB] mb-6 -mx-6 px-6">
        <button
          onClick={() => setActiveTab('signin')}
          className={[
            'pb-3 mr-6 text-sm font-semibold transition-colors',
            activeTab === 'signin'
              ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
              : 'text-gray-500 hover:text-gray-700',
          ].join(' ')}
        >
          Sign In
        </button>
        <button
          onClick={() => setActiveTab('signup')}
          className={[
            'pb-3 text-sm font-semibold transition-colors',
            activeTab === 'signup'
              ? 'text-[#3B82F6] border-b-2 border-[#3B82F6]'
              : 'text-gray-500 hover:text-gray-700',
          ].join(' ')}
        >
          Sign Up
        </button>
      </div>

      {activeTab === 'signin' ? (
        <LoginForm
          onSuccess={onClose}
          onSwitchToSignup={() => setActiveTab('signup')}
        />
      ) : (
        <SignupForm
          onSuccess={onClose}
          onSwitchToSignin={() => setActiveTab('signin')}
        />
      )}
    </Modal>
  );
};

export default AuthModal;
