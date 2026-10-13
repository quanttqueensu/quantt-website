export const formatPostDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
