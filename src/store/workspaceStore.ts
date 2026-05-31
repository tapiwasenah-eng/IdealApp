import { useStore } from './index';

export const useWorkspaceStore = () => {
  const workspaces = useStore((state) => state.workspaces);
  const activeWorkspaceId = useStore((state) => state.activeWorkspaceId);
  const setWorkspaces = useStore((state) => state.setWorkspaces);
  const setActiveWorkspace = useStore((state) => state.setActiveWorkspaceId);

  return {
    workspaces,
    activeWorkspaceId,
    setWorkspaces,
    setActiveWorkspace,
  };
};
