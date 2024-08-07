export default function CheckboxContainer({ children, isChecked, onChange }) {
  return (
    <div
      className={`w-full rounded-[12px] flex justify-between border border-secondary p-[2%]`}
    >
      {children}
      <button
        onClick={onChange}
        className={`rounded-[5px] border border-secondary w-[26px] h-[26px] cursor-pointer ${
          isChecked && "bg-dominant"
        }  transition-all`}
      />
    </div>
  );
}
