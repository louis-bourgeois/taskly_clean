"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AnchorPoint from "ui/AnchorPoint";
import Form from "ui/Form";
import Input from "ui/Input";
import PasswordInputContainer from "ui/auth/PasswordInputContainer";
import { useUser } from "../../context/UserContext";

export default function FormMenu({
  absolute,
  mainTitle,
  libelle,
  inputs,
  password,
  confirmPassword,
  submitValue,
  formDataArray,
  action,
  bottomMessage,
  termsConditions = false,
  succeedRedirect,
  newUser,
}) {
  const router = useRouter();
  const [formData, setFormData] = useState(formDataArray);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const { login } = useUser();
  const { user } = useUser();

  const [passwordMatch, setPasswordMatch] = useState(true);
  const errors = [
    {
      error: "already exist",
      message: "We already know about you,",
      anchor: "log in.",
      href: "/auth/login",
    },
    {
      error: "Unauthorized",
      message: "Password is incorrect.",
      anchor: undefined,
      href: undefined,
    },
    {
      error: "username already taken",
      message: "This username is already taken!",
      anchor: undefined,
      href: undefined,
    },
    {
      error: "Internal Servor Error",
      message: "Server Error (500), ",
      anchor: "report here",
      href: "/support/report",
    },
    {
      error: "Not Found",
      message: "We don't know about you :(,",
      anchor: "please sign up.",
      href: "/auth/signup",
    },
    {
      error: "password doesn't match",
      message: "The passwords are not the same!",
      anchor: undefined,
      href: undefined,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (
      (name === "password" || name === "confirm_password") &&
      confirmPassword
    ) {
      setFormData((prev) => {
        // On utilise les valeurs les plus récentes de formData
        const isMatch =
          name === "password"
            ? value === prev.confirm_password
            : prev.password === value;
        setPasswordMatch(isMatch);
        if (!isMatch) {
          setError("password doesn't match");
        } else {
          setError("");
        }
        return prev; // On retourne prev sans le modifier
      });
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    switch (action) {
      case "add user":
        addUser(formData);
        break;
      case "check user":
        const res = await login(formData);
        if (res && res.status === 200) {
          router.push("/app");
        } else {
          setError(res.statusText);

          return null;
        }
    }
  };
  const cleanFormData = (formData) => {
    const {
      confirm_password,
      "terms and conditions checkbox": termsConditions,
      ...cleanedFormData
    } = formData;

    return cleanedFormData;
  };

  const checkUser = async (data) => {
    try {
      const result = await axios.post(
        "http://localhost:3001/api/users/check",
        data
      );
      // Si le statut est 200, on peut assumer que la requête a réussi.
    } catch (error) {
      // Axios encapsule la réponse d'erreur dans `error.response`
      if (error.response) {
        const { status } = error.response;
        if (status === 404) {
          setError("not found");
        } else if (status === 401) {
          setError("unauthorized");
        }
      } else {
        // Gère les erreurs qui ne sont pas des réponses HTTP (ex. problème réseau)
        console.log("Error: ", error.message);
        setError("An unexpected error occurred");
      }
    }
  };

  const addUser = async (data) => {
    data = cleanFormData(formData);
    const result = await axios.post(
      "http://localhost:3001/api/users/register",
      {
        data,
      }
    );
    console.log(result);

    if (result.data === "already exist") {
      setError("already exist");
    } else if (result.data === "username already taken") {
      setError("username already taken");
    } else if (result.status === 200) {
      const res = await login(formData);
      if (res && res.status === 200) {
        router.push("/app");
      } else {
        console.log("anormal error", res);
        setError(res.statusText);
        return null;
      }
    }
  };
  return (
    <div
      className={`rounded-3xl shadow-[0_4px_20px_rgba(0,0,0.5)] bg-white ${
        absolute &&
        "absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-2"
      }`}
    >
      {" "}
      {/* faut adapter dans le theme tailwind le 3xl pr le border radius */}{" "}
      <div className="m-10 flex flex-col justify-center items-center gap-10 ">
        {libelle && (
          <p className="self-start font-extralight text-3xl">{libelle}</p>
        )}

        {mainTitle && (
          <h3 className="text-6xl font-bold self-start text-gradient-black-to-purple">
            {mainTitle}
          </h3>
        )}
        <Form onSubmit={handleFormSubmit} onChange={handleChange}>
          {inputs.map((input, index) => (
            <Input
              key={index}
              type={input.type}
              name={input.name}
              autoComplete={input.autoComplete}
              placeholder={input.placeholder}
              additionalStyles={input.additionalStyles}
              pattern={input.pattern}
              inputMode={input.inputMode}
              autoDimensions={!(input.width || input.height)}
              flexShrinkGrow
              required
              onChange={
                input.type === "email"
                  ? () => {
                      setError("");
                    }
                  : undefined
              }
            />
          ))}

          {password && (
            <PasswordInputContainer
              name="password"
              placeholder="Enter a strong Password"
              setVisibilityState={setPasswordVisible}
              visibilityState={passwordVisible}
              autoDimensions
              newUser={newUser}
            />
          )}
          {confirmPassword && (
            <PasswordInputContainer
              name="confirm_password"
              placeholder="Confirm Password"
              setVisibilityState={setConfirmPasswordVisible}
              visibilityState={confirmPasswordVisible}
              autoDimensions
              newUser={true}
            />
          )}
          {error &&
            errors.map((e, index) => {
              if (e.error === error) {
                return (
                  <p
                    className="text-red-800 text-right text-xl ml-auto"
                    key={index}
                  >
                    {e.message}{" "}
                    {e.href && e.anchor && (
                      <AnchorPoint href={e.href}>
                        <span className="text-blue">{e.anchor}</span>
                      </AnchorPoint>
                    )}
                  </p>
                );
              } else {
                return null; // Retourne null si la condition n'est pas remplie
              }
            })}

          {termsConditions && (
            <div className="mr-auto ml-2 flex gap-10 w-full mt-[2rem]">
              <Input
                type="checkbox"
                name="terms and conditions checkbox"
                id="terms and conditions checkbox"
                additionalStyles="p-2 border border-grey rounded-2xl w-5 rounded-full"
              />

              <label
                htmlFor="terms and conditions checkbox"
                className="flex-grow-2 text-xl text-black italic"
              >
                I have read and accepted the{" "}
                <span className="text-blue">
                  <AnchorPoint href="/legal/conditions">conditions</AnchorPoint>
                </span>{" "}
                and{" "}
                <span className="text-blue">
                  <AnchorPoint href="/legal/terms">terms of use</AnchorPoint>
                </span>
                .
              </label>
            </div>
          )}
          <Input
            type="submit"
            value={submitValue}
            additionalStyles="p-2 border-black text-3xl mt-[2rem] font-black w-full cursor-pointer hover:scale-105 transition ease-in-out"
            disabled={!passwordMatch}
          />
        </Form>
        <AnchorPoint href="/auth/login">
          <span className="text-blue text-xl">{bottomMessage}</span>
        </AnchorPoint>
      </div>
    </div>
  );
}
