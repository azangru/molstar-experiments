import { Link } from "react-router-dom";

const IndexPage = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/plugin-context-without-default-ui">
            Plugin context without default UI
          </Link>
        </li>      
        <li>
          <Link to="/only-canvas">
            Only canvas
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default IndexPage;
