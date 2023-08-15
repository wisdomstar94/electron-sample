import { Link } from "react-router-dom";

export function IndexPage() {
  return (
    <>
      <div>
        <Link to="/update">하위 update 페이지로..</Link>
      </div>
    </>
  );
}