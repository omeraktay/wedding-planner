export default function capitalize(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}