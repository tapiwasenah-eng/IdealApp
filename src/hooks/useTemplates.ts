// src/hooks/useTemplates.ts
import { useState, useMemo } from 'react';
import { TEMPLATES as allTemplates } from '../data/templates';
import { Template } from '../types';

export function useTemplates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab,   setActiveTab]   = useState('all');
  const [industry,    setIndustry]    = useState('All Industries');
  const [stage,       setStage]       = useState('All Stages');

  const filteredTemplates: Template[] = useMemo(() => {
    return allTemplates.filter(t => {
      const matchesTab      = activeTab === 'all' || t.category === activeTab;
      const matchesSearch   = !searchQuery || 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesIndustry = industry === 'All Industries' || t.industry === industry;
      const matchesStage    = stage === 'All Stages' || t.stage === stage;
      return matchesTab && matchesSearch && matchesIndustry && matchesStage;
    });
  }, [searchQuery, activeTab, industry, stage]);

  return {
    templates: allTemplates,
    filteredTemplates,
    searchQuery, setSearchQuery,
    activeTab,   setActiveTab,
    industry,    setIndustry,
    stage,       setStage,
  };
}
