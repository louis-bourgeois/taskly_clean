import { darkMode } from "@/layout";
import FormMenu from "@/ui/FormMenu";

export default function Page() {
  const inputs = [
    {
      type: "email",
      name: "email",
      autoComplete: "email",
      placeholder: "Email",
    },
  ];
  const formDataArray = {
    email: "",
    password: "",
  };
  const action = "check user";
  return (
    <>
      <FormMenu
        absolute="true"
        mainTitle="Welcome back to Taskly"
        libelle="User data"
        inputs={inputs}
        password
        formDataArray={formDataArray}
        action={action}
        bottomMessage="Not registered?"
        submitValue="Log in"
      ></FormMenu>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="font-black text-8xl text-center">Welcome to taskly!</h1>
        <button
          className={`${
            darkMode ? " border border-blue" : ""
          } shadow-[0_2px_40px_rgba(0,0,0.1)] hover:scale-110 transition ease-in-out text-3xl font-black rounded-full mt-[3vh]  px-[8vw] py-[1vh]`}
        >
          Log in
        </button>
      </div>
    </>
  );
}
