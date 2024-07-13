import { useEffect, useState } from "react";
import { useMenu } from "../../../../../context/MenuContext";
import { useUser } from "../../../../../context/UserContext";
import { useWorkspace } from "../../../../../context/WorkspaceContext";
import CollaboratorSelectContainer from "./CollaboratorSelectContainer";
import ElementPickerLibelle from "./ElementPickerLibelle";
import SectionSelectContainer from "./SectionSelectContainer";

export default function WorkspaceForm({
  id,
  setElementType,
  elementType,
  setCallback,
  callback,
  showContent,
  visibility,
  setShowContent,
}) {
  const { workspaces, sections } = useUser();
  const { isTaskMenuOpen, toggleTaskMenu } = useMenu();
  const { createWorkspace, updateWorkspace, setActiveWorkspace } =
    useWorkspace();
  const [workspace, setWorkspace] = useState(null);
  const [workspaceSections, setWorkspaceSections] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nameValue, setNameValue] = useState("");

  const handleElementTypeChange = (newType, from = undefined) => {
    if (from) {
      setCallback(from);
    }
    setIsTransitioning(true);
    setShowContent(false);
    setTimeout(() => {
      setElementType(newType);
      setShowContent(true);
    }, 300);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const handleWorkspaceAction = async () => {
    try {
      const workspaceData = {
        name: nameValue,
        linked_sections: workspaceSections,
        collaborators: collaborators,
      };

      if (id) {
        console.log("okee");
        await updateWorkspace(id, workspaceData);
      } else {
        console.log("ok");
        await createWorkspace(workspaceData);
      }

      if (callback) {
        handleElementTypeChange(callback);
      } else {
        toggleTaskMenu();
      }
      setCallback("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isTaskMenuOpen) {
      resetWorkspaceForm();
    }
  }, [isTaskMenuOpen]);

  useEffect(() => {
    if (!id || !workspaces || !sections) return;

    const foundWorkspace = workspaces.find((workspace) => workspace.id === id);
    if (!foundWorkspace) return;

    const uniqueSectionIds = [
      ...new Set(foundWorkspace.tasks.map((t) => t.linked_section)),
    ];

    console.log("Found Workspace:", foundWorkspace);
    setWorkspace(foundWorkspace);
    setCollaborators(foundWorkspace.users || []);
    setNameValue(foundWorkspace.name);

    const workspaceSectionObjects = sections.filter((section) =>
      uniqueSectionIds.includes(section.id)
    );

    setWorkspaceSections(workspaceSectionObjects);
  }, [id, workspaces, sections]);

  const resetWorkspaceForm = () => {
    setActiveWorkspace("");
    setWorkspace(null);
    setWorkspaceSections([]);
    setCollaborators([]);
    setNameValue("");
  };

  const transitionStyles = `transition-all duration-300 ease-in-out ${
    isTransitioning || !showContent ? "opacity-0" : "opacity-100"
  }`;

  return (
    <div className={`w-full h-full flex flex-col ${transitionStyles}`}>
      <div className="flex justify-center h-[15%] items-center">
        <ElementPickerLibelle
          handleElementTypeChange={handleElementTypeChange}
          elementType={elementType}
        />
        <input
          type="text"
          onChange={(e) => setNameValue(e.target.value)}
          value={nameValue}
          disabled={!visibility}
          placeholder={id ? "Edit Workspace" : "New Workspace"}
          className="w-full text-right placeholder:text-black placeholder:text-5xl text-black text-5xl bg-transparent h-full focus:outline-none"
        />
        <div className="flex-grow" />
      </div>
      <div className="flex h-[90%] justify-between items-center gap-[2.5%] mb-[%]">
        <SectionSelectContainer
          setWorkspaceSections={setWorkspaceSections}
          workspaceSections={workspaceSections}
        />
        <div className="h-[95%] rounded-[20px] w-[50%] flex flex-col justify-between">
          <CollaboratorSelectContainer
            collaborators={collaborators}
            setCollaborators={setCollaborators}
          />
          <button
            onClick={handleWorkspaceAction}
            className="addMenuElement glass-morphism h-[15%] rounded-[20px] text-4xl font-bold hover:scale-105 active:scale-100 transition-transform duration-100 ease-in"
          >
            {id ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}