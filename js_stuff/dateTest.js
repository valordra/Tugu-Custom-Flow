const today = new Date("March 24, 2025");
const options = {
    day: "numeric",
    month: "long",
    year: "numeric"
};
console.log(today.toLocaleDateString("id", options));