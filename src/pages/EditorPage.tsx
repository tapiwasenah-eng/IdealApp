import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEditorStore } from "../store/editorStore";
import { useAuthStore } from "../store/authStore";
import { getProject, updateProject } from "../services/projectService";
import EditorCanvas from "../components/editor/EditorCanvas";
import { SectionsPanel } from "../components/editor/SectionsPanel";
import { InspectorPanel } from "../components/editor/InspectorPanel";
import { AssistantPanel } from "../components/editor/AssistantPanel";
import { MobileEditorLayout } from "../components/editor/MobileEditorLayout";
import SEOHead from "../components/Shared/SEOHead";
import { useDebounceCallback } from "../lib/debounce";
import { Cloud, CloudOff, Loader2 } from "lucide-react";
import { TEMPLATES } from "../data/templates";
import { TemplateEditor } from "../components/editor/TemplateEditor";
import { documentService } from "../services/documentService";
import { fillFields } from "../lib/templateParser";
import { nanoid } from "nanoid";

export const EditorPage: React.FC = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  const {
    sections,
    setSections,
    canvas,
    isDirty,
    setDirty,
    saveStatus,
    setSaveStatus,
    rightPanelTab,
    setRightPanelTab,
  } = useEditorStore();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);

  const templateId = searchParams.get("template");
  const template = useMemo(
    () => TEMPLATES.find((t) => t.id === templateId),
    [templateId],
  );

  useEffect(() => {
    if (searchParams.get("action") === "edit-with-ai") {
      setRightPanelTab("assistant");
    }
  }, [searchParams, setRightPanelTab]);

  useEffect(() => {
    const fetchDoc = async () => {
      if (documentId === "new") {
        setLoading(false);
        return;
      }
      if (!user) return;
      if (!documentId) {
        navigate("/dashboard");
        return;
      }

      try {
        const data = await getProject(user.uid, documentId);
        setProject(data);
        if (data.sections) {
          setSections(data.sections);
        }
        // Load local snapshot if newer... omitted for brevity
        setLoading(false);
      } catch (err) {
        console.error("Failed to load document:", err);
        setLoading(false);
      }
    };
    fetchDoc();
  }, [user, documentId, navigate, setSections]);

  // Autosave
  const saveChanges = useDebounceCallback(
    async (docId: string, uid: string, sects: any, isD: boolean) => {
      if (!isD || docId === "new") return;
      setSaveStatus("saving");
      try {
        await updateProject(uid, docId, {
          sections: sects,
        });
        setDirty(false);
        setSaveStatus("saved");
      } catch (err) {
        console.error("Autosave failed:", err);
        setSaveStatus("error");
      }
    },
    800,
  );

  useEffect(() => {
    if (project && user && isDirty && documentId !== "new") {
      saveChanges(project.id, user.uid, sections, isDirty);
    }
  }, [sections, isDirty, project, user, saveChanges, documentId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  // Render TemplateEditor if creating a new document from template
  if (documentId === "new") {
    if (!template) {
      return <div className="p-8 text-center">Template not found.</div>;
    }
    return (
      <div className="h-screen w-full bg-white flex flex-col">
        <SEOHead title={`New ${template.title} | Ideal App`} description={`Create a new ${template.title}`} />
        <TemplateEditor
          template={template}
          onBack={() => navigate("/templates")}
          onGenerate={async (fields) => {
            if (!user) return;
            const docTitle = `${fields.companyName || "My Company"} - ${template.name || template.title}`;

            try {
              // Create project for the user
              const { createProject } =
                await import("../services/projectService");
              const newId = await createProject(user.uid, {
                title: docTitle,
                workspaceId: null,
                templateId: template.id,
                canvasData: "{}",
                sections: fillFields(template.sections, fields),
                status: "draft",
                isInDataRoom: false,
                thumbnail: "",
                tags: [],
              });
              navigate(`/editor/${newId}`);
            } catch (err) {
              console.error("Failed to create project:", err);
              navigate(`/dashboard`);
            }
          }}
        />
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${project?.title || "Editor"} | Ideal App`}
        description="Edit Document"
      />

      {/* Mobile Layout (Hidden on md and up) */}
      <div className="block md:hidden h-screen bg-slate-50">
        <MobileEditorLayout project={project} />
      </div>

      {/* Desktop Layout (Hidden on mobile) */}
      <div className="hidden md:flex h-screen bg-[#F9FAFB] overflow-hidden flex-col">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-semibold"
            >
              ← Dashboard
            </button>
            <h1 className="font-bold text-slate-900 truncate max-w-[200px]">
              {project?.title || "Untitled Document"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              {saveStatus === "saving" && (
                <>
                  <Loader2 className="animate-spin" size={12} /> Saving...
                </>
              )}
              {saveStatus === "saved" && (
                <>
                  <Cloud size={14} className="text-emerald-500" /> Saved
                </>
              )}
              {saveStatus === "error" && (
                <>
                  <CloudOff size={14} className="text-red-500" /> Offline
                </>
              )}
            </div>
            <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700">
              Export PDF
            </button>
          </div>
        </header>

        {/* 3-Panel Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Sections */}
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10">
            <SectionsPanel />
          </aside>

          {/* Center: Canvas */}
          <main className="flex-1 relative overflow-hidden flex flex-col bg-slate-100">
            {/* Toolbar can go here */}
            <EditorCanvas />
          </main>

          {/* Right Panel: Inspector / Assistant */}
          <aside className="w-[320px] bg-white border-l border-slate-200 flex flex-col shrink-0 z-10">
            {rightPanelTab === "inspector" ? (
              <InspectorPanel />
            ) : (
              <AssistantPanel />
            )}
          </aside>
        </div>
      </div>
    </>
  );
};
export default EditorPage;
