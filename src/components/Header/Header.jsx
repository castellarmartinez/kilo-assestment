import reactImage from "../../assets/react-core-concepts.png";
import "./Header.css";

export default function Header() {
  return (
    <header>
      <img src={reactImage} alt="Stylized atom" />
      <h1>Kilo Coding Challenge</h1>
    </header>
  );
}
