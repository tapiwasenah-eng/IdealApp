import React, { useEffect, useState } from 'react';
import { createWorkspaceFromTemplate, inferRenderMode } from '../../lib/documents';
import { useStore } from '../../store';
import { designSystem } from '../../lib/design-system';
import { ChevronRight, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TEMPLATES } from '../../data/templates';
import { getTemplatePath } from '../../lib/routing';

export const DashboardTemplates: React.FC = () => {
  const { colors, typography, shadows } = designSystem;
  const navigate = useNavigate();
  // Provide some recommended templates from the static TEMPLATES array
  const templates = TEMPLATES.slice(0, 4); 

  const user = useStore(state => state.user);
  
  const handleUseTemplate = async (template: any) => {
    if (!user) {
      toast.error("Please sign in first");
      return;
    }
    try {
      toast.loading("Generating document...", { id: "gen-doc" });
      const mode = inferRenderMode(template);
      const res = await createWorkspaceFromTemplate({
        userId: user.uid,
        template,
        mode,
      });
      toast.success("Document created!", { id: "gen-doc", duration: 2000 });
      navigate(res.route);
    } catch(err: any) {
      toast.error(err.message || "Failed to create document", { id: "gen-doc", duration: 3000 });
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-12">
      <div>
        <h2 style={{ fontFamily: typography.fonts.interface, fontWeight: 600, fontSize: typography.scale.h3.fontSize, color: colors.primary.obsidian }}>
          Templates & Playbooks
        </h2>
        <p className="text-slate-500 text-sm mt-1">High-leverage starting points modeling top startups.</p>
      </div>

      <div className="space-y-6">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Wand2 size={18} className="text-indigo-600" /> 
          Recommended Growth Playbooks
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map(template => (
            <div 
              key={template.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col transition-all hover:border-indigo-300 hover:shadow-md pt-8 relative overflow-hidden"
              style={{ boxShadow: shadows.e1 }}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80" />
              <h4 className="font-bold text-slate-800 text-lg mb-2">{template.name}</h4>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                {template.description || "A structured playbook covering execution logic, investor updates, and core metrics tracking."}
              </p>
              
              <div className="mt-auto flex items-center gap-3">
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="flex-1 px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg text-sm hover:bg-slate-800 transition-colors flex justify-center items-center gap-2"
                >
                  Use Template
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => navigate(getTemplatePath(template))}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg text-sm hover:bg-slate-50 transition-colors"
                >
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
