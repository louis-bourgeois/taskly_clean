export default function DateHeader({ index }) {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + index);
  const dayLabel = index === 0 ? "Today" : index === 1 ? "Tomorrow" : undefined;

  const dateOptions = {
    weekday: "long",
  };
  const dateNumber = futureDate.getDate();

  return (
    <>
      <h2 className="text-5xl font-extralight">
        {(dateNumber < 10 ? "0" : "") + dateNumber}
      </h2>
      <h2 className="text-5xl font-bold">
        {dayLabel || futureDate.toLocaleDateString("en-EN", dateOptions)}
      </h2>
    </>
  );
}
