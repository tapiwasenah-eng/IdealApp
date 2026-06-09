import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';

export function useStartInvestorDocFlow() {
  const navigate = useNavigate();
  const { user, companyDna, setModalState } = useAppStore();

  const start = (source: 'overview' | 'products' | 'documents') => {
    if (!user) {
      navigate(`/signup?redirect=/dashboard&entry=${source}`);
      return;
    }
    
    // We navigate to /dashboard/documents and open the wizard modal
    // For now, if we don't have companyDna, we might want to guide them to Onboarding
    // But since FirstSessionWizard acts as our Bring Material flow:
    navigate('/dashboard'); // or we could navigate to /dashboard/documents
    
    // We will use the FirstSessionWizard logic for this flow since it contains 
    // the "Upload", "Template", "Blank" flow.
    setModalState('bringMaterialOpen', true);
  };

  return { start };
}
