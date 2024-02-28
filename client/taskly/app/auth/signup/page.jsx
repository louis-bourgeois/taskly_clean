import { darkMode } from "@/layout";
import FormMenu from "@/ui/FormMenu";

export default function Page() {
  const formDataArray = {
    fName: "",
    lName: "",
    age: "",
    email: "",
    password: "",
  };
  const action = "add user";
  const inputs = [
    {
      type: "text",
      name: "fName",
      autoComplete: "given-name",
      placeholder: "First Name",
    },
    {
      type: "text",
      name: "lName",
      autoComplete: "family-name",
      placeholder: "Last Name",
    },
    {
      type: "text",
      name: "username",
      autoComplete: "username",
      placeholder: "Username",
    },
    {
      type: "text",
      name: "age",
      placeholder: "Age",
      pattern: "[0-9]{1,3}",
      inputMode: "numeric",
    },
    {
      type: "email",
      name: "email",
      autoComplete: "email",
      placeholder: "Email",
    },
  ];

  return (
    <>
      <FormMenu
        absolute
        mainTitle="Welcome to Taskly !"
        libelle="User data"
        inputs={inputs}
        password
        confirmPassword
        formDataArray={formDataArray}
        action={action}
        submitValue="Start the adventure"
        bottomMessage="Already registered?"
        termsConditions
        succeedRedirect="/app"
        newUser={true}
      />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1
          className={`${
            darkMode ? "text-white" : ""
          } font-black text-8xl text-center w-full`}
        >
          Welcome to task<span className="text-blue">ly</span>!
        </h1>
        <button
          className={`${
            darkMode ? "border-gradient-dark-mode-gold-to-black text-white" : ""
          } shadow-[0_2px_40px_rgba(0,0,0.1)] hover:scale-110 transition ease-in-out text-3xl font-black rounded-full mt-[3vh]  px-[10%] py-[0.75%]`}
        >
          Sign up
        </button>
      </div>
    </>
  );
}
