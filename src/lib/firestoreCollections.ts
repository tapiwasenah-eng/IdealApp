import { collection } from "firebase/firestore";
import { db } from "./firebase";
import { PitchTemplate, WorkspaceDoc } from "./firestoreTypes";

export const templatesCollection = collection(db, "templates");
export const workspacesCollection = collection(db, "workspaces");
